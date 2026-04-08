# Contexto Técnico del Proyecto

## Resumen

Aplicación web de catálogo con panel de administración para gestionar productos y categorías.

Actualmente la app permite:

- listar productos activos en el catálogo público
- ver detalle de producto
- administrar productos desde un panel privado
- administrar categorías
- subir y ordenar imágenes de productos en Supabase Storage
- sincronizar automáticamente la portada del producto desde base de datos

## Stack

### Frontend

- Vite
- React
- TypeScript
- React Router
- TanStack Query (React Query)
- Tailwind CSS
- shadcn/ui
- dnd-kit
- Sonner

### Backend / BaaS

- Supabase
- Postgres
- Supabase Auth
- Supabase Storage

## Estructura general

### Páginas principales

- `src/pages/Index.tsx`
  - home pública
- `src/pages/Products.tsx`
  - listado público de productos activos
- `src/pages/ProductDetail.tsx`
  - detalle público por `slug`
- `src/pages/AdminLogin.tsx`
  - login admin
- `src/pages/AdminDashboard.tsx`
  - panel admin de productos y categorías

### Servicios

- `src/services/products.ts`
  - CRUD de productos
- `src/services/categories.ts`
  - CRUD de categorías
- `src/services/productImages.ts`
  - acceso a `product_images` y helpers de imágenes
- `src/services/upload.ts`
  - helper de upload legacy

### Hooks

- `src/hooks/useProducts.ts`
  - queries de productos
- `src/hooks/useCategories.ts`
  - queries de categorías
- `src/hooks/useAuth.ts`
  - estado de autenticación
- `src/hooks/useProductImages.ts`
  - query legacy para imágenes de producto

### Componentes relevantes

- `src/components/ProductCard.tsx`
  - tarjeta de producto pública
- `src/components/admin/ProductImageUploader.tsx`
  - uploader de imágenes, actualmente refactorizado como componente controlado
- `src/components/admin/ProductImageItem.tsx`
  - item sortable del uploader

## Modelo de datos relevante

### `products`

Campos observables desde código:

- `id`
- `title`
- `slug`
- `description`
- `price`
- `category_id`
- `image`
- `active`
- `created_at`
- `updated_at`

Uso actual:

- `products.image` se usa como imagen principal en listado y detalle
- el frontend no debería decidir manualmente la portada final

### `product_images`

Campos observables desde código:

- `id`
- `product_id`
- `url`
- `position`
- `created_at`

Uso actual:

- almacena múltiples imágenes por producto
- `position` define el orden
- la imagen con menor `position` es la portada lógica

### Storage

- bucket público: `products`

Los archivos se suben con paths derivados del producto y un UUID.

## Arquitectura actual de imágenes

### Regla de portada

La portada del producto ya no debería ser manejada por frontend.

Estado actual esperado:

- `product_images` define el orden real
- la base de datos sincroniza `products.image` automáticamente mediante triggers
- el frontend solo debe persistir imágenes y posiciones

### Estado del frontend

Se inició un refactor del uploader para trabajar con estado local de borrador:

```ts
type DraftImage = {
  id: string;
  file: File;
  previewUrl: string;
}
```

Estado local actual:

- `draftImages: DraftImage[]`

Objetivo de este modelo:

- evitar múltiples fuentes de verdad
- evitar depender de `productId` previo
- permitir previews, reordenamiento y eliminación antes de persistir

## Flujo actual de creación de productos

Estado del código actual en `AdminDashboard.tsx`:

1. El formulario administra:
   - título
   - slug
   - descripción
   - precio
   - categoría
   - `draftImages`
2. El componente `ProductImageUploader` ya está integrado como componente controlado:
   - recibe `draftImages`
   - emite `onChange`
3. `handleSubmit` todavía mantiene el flujo anterior de creación:
   - crea o actualiza producto con `createProduct` / `updateProduct`
   - no persiste aún `draftImages`
4. En creación, el producto sigue insertándose con:
   - `image: form.image || "/placeholder.svg"`

Conclusión:

- la UI ya permite preparar imágenes antes de guardar
- pero el submit todavía no integra la subida a storage ni la inserción en `product_images`

## Estado actual del uploader

### Antes del refactor

El uploader anterior:

- dependía de `productId`
- consultaba imágenes persistidas por React Query
- mezclaba:
  - imágenes existentes
  - imágenes pendientes
  - una lista combinada
- incluía lógica de backend dentro del componente

Eso hacía el flujo más frágil y provocó problemas como:

- demasiadas fuentes de verdad
- sincronización confusa
- riesgo de loops de render

### Después del refactor

`ProductImageUploader` ahora:

- no usa React Query
- no usa Supabase
- no conoce `productId`
- no sube archivos
- no guarda nada en backend
- solo edita un array local `draftImages`

Responsabilidades actuales:

- agregar imágenes con `input[type=file][multiple]`
- generar previews con `URL.createObjectURL`
- eliminar imágenes
- reordenar con dnd-kit
- revocar `previewUrl` al eliminar y al desmontar

## Estado actual de AdminDashboard

En `src/pages/AdminDashboard.tsx`:

- el formulario ya maneja `draftImages`
- el uploader ya está integrado
- `draftImages` se resetea al:
  - abrir nuevo producto
  - cancelar
  - entrar en edición

Limitaciones actuales:

- `handleSubmit` todavía no usa `draftImages`
- el flujo real de persistencia de imágenes todavía no fue migrado
- el código de edición sigue arrastrando conceptos del flujo anterior (`form.image`, creación previa del producto, etc.)

## Servicios relacionados con imágenes

### `src/services/productImages.ts`

Actualmente contiene lógica para:

- obtener imágenes persistidas de un producto
- subir una imagen a storage
- insertar una fila en `product_images`
- eliminar imagen
- actualizar posiciones

Observación importante:

- parte de este servicio responde al flujo anterior basado en `productId` previo
- es probable que necesite reestructuración para soportar el nuevo submit en un solo paso

### `src/hooks/useProductImages.ts`

Hook legacy para consultar imágenes de producto por `productId`.

Observación:

- ya no forma parte del nuevo uploader controlado
- probablemente quede obsoleto cuando se complete el refactor del flujo de creación

## Problemas conocidos

### 1. Flujo de creación incompleto

El formulario ya permite preparar imágenes antes de guardar, pero el submit todavía no las persiste.

### 2. Persistencia no transaccional entre DB y Storage

Crear producto + subir imágenes + registrar `product_images` involucra dos subsistemas distintos:

- Postgres
- Storage

No existe una transacción única entre ambos. El flujo final necesita compensaciones para evitar:

- productos duplicados
- archivos huérfanos en storage
- inserts parciales de imágenes

### 3. Código legacy todavía presente

Siguen existiendo piezas del flujo anterior:

- `useProductImages`
- helpers de servicios orientados a upload por producto ya existente
- uso de `form.image`
- partes del flujo pensadas para “crear primero y subir después”

### 4. Riesgo de inconsistencias durante reintentos

Cuando se integre `draftImages` al submit, habrá que evitar:

- recrear el producto si ya fue creado en un intento previo fallido
- perder los `File` locales si falla la subida
- dejar archivos en storage sin filas asociadas en `product_images`

## Refactor en progreso

### Objetivo del refactor

Pasar de este flujo:

1. crear producto
2. luego subir imágenes

a este:

1. completar formulario completo
2. agregar/reordenar/eliminar imágenes localmente
3. hacer un único submit
4. crear producto
5. subir imágenes
6. insertar `product_images`
7. dejar que los triggers sincronicen `products.image`

### Estado actual del refactor

Completado:

- `ProductImageUploader` convertido a componente controlado
- introducción de `DraftImage`
- integración de `draftImages` en `AdminDashboard`

Pendiente:

- conectar `draftImages` al submit
- definir estrategia de rollback / reintento
- limpiar servicios y hooks legacy
- simplificar el flujo de edición según la nueva arquitectura

## Archivos clave para entender el proyecto

- `src/pages/AdminDashboard.tsx`
- `src/components/admin/ProductImageUploader.tsx`
- `src/components/admin/ProductImageItem.tsx`
- `src/services/products.ts`
- `src/services/productImages.ts`
- `src/hooks/useProducts.ts`
- `src/hooks/useCategories.ts`
- `supabase/migrations/20260225115757_ed2cc057-1daf-4816-bf50-d39d8d95bd89.sql`
- `supabase/migrations/20260327021945_cb9712e1-9f78-4c30-8422-6000c6e1e830.sql`

## Próximo paso esperado

Completar el flujo de submit para que use `draftImages` y persista en este orden:

1. crear producto
2. subir archivos a storage
3. insertar filas en `product_images`
4. invalidar queries
5. manejar rollback si falla una etapa intermedia

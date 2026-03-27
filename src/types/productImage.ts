export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  position: number;
  createdAt: string;
}

/** Local-only image pending upload */
export interface PendingImage {
  localId: string;
  file: File;
  previewUrl: string;
}

/** Union used in the sortable list */
export type SortableImage =
  | { kind: "existing"; data: ProductImage }
  | { kind: "pending"; data: PendingImage };

export function sortableImageId(img: SortableImage): string {
  return img.kind === "existing" ? img.data.id : img.data.localId;
}

import {
  DraftImage,
  EditableImage,
  ExistingEditableImage,
  NewEditableImage,
} from "@/types/productImage";
import { Product } from "@/types/product";
import { createProduct, deleteProduct, updateProduct } from "@/services/products";
import {
  deleteProductImage,
  insertProductImages,
  removeImagesFromStorage,
  updateImagePositions,
  uploadImageToProductStorage,
} from "@/services/productImages";

type CreateProductInput = Parameters<typeof createProduct>[0];
type UpdateProductInput = Parameters<typeof updateProduct>[1];

interface UploadedNewImage {
  path: string;
  url: string;
  localId: string;
}

interface InsertedImageRecord {
  id: string;
  url: string;
  localId: string;
}

interface FinalImageState {
  id: string;
  url: string;
}

interface UpdateProductWithImagesInput {
  productId: string;
  productData: UpdateProductInput;
  editableImages: EditableImage[];
  originalImages: ExistingEditableImage[];
}

// interface UpdateProductWithImagesResult {
//   hasError: boolean;
// }

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function throwStepError(step: string, error: unknown): never {
  throw new Error(`${step} failed: ${toErrorMessage(error)}`);
}

export async function uploadNewImages(
  productId: string,
  newImages: NewEditableImage[],
): Promise<UploadedNewImage[]> {
  const uploadedImages: UploadedNewImage[] = [];

  try {
    for (const [index, image] of newImages.entries()) {
      const uploaded = await uploadImageToProductStorage(productId, image.file, index);
      uploadedImages.push({
        path: uploaded.path,
        url: uploaded.publicUrl,
        localId: image.localId,
      });
    }

    return uploadedImages;
  } catch (error) {
    if (uploadedImages.length > 0) {
      try {
        await removeImagesFromStorage(uploadedImages.map((image) => image.path));
      } catch (cleanupError) {
        throw new Error(
          `upload cleanup failed after partial upload: ${toErrorMessage(cleanupError)}`,
        );
      }
    }

    throwStepError("upload new images", error);
  }
}

async function insertUploadedImages(
  productId: string,
  uploadedImages: UploadedNewImage[],
): Promise<InsertedImageRecord[]> {
  if (uploadedImages.length === 0) return [];

  try {
    const inserted = await insertProductImages(
      uploadedImages.map((image) => ({
        product_id: productId,
        url: image.url,
        position: 0,
      })),
    );

    return inserted.map((image, index) => ({
      id: image.id,
      url: image.url,
      localId: uploadedImages[index].localId,
    }));
  } catch (error) {
    try {
      await removeImagesFromStorage(uploadedImages.map((image) => image.path));
    } catch (cleanupError) {
      throw new Error(
        `insert uploaded images failed and cleanup failed: ${toErrorMessage(cleanupError)}`,
      );
    }

    throwStepError("insert uploaded images", error);
  }
}

export async function deleteRemovedImages(
  productId: string,
  deletedImages: ExistingEditableImage[],
): Promise<void> {
  try {
    for (const image of deletedImages) {
      await deleteProductImage({
        id: image.id,
        productId,
        url: image.url,
        position: image.position,
        createdAt: "",
      });
    }
  } catch (error) {
    throwStepError("delete removed images", error);
  }
}

export function buildFinalImageState(
  editableImages: EditableImage[],
  insertedImages: InsertedImageRecord[],
): FinalImageState[] {
  try {
    return editableImages.map((image) => {
      if (image.kind === "existing") {
        return {
          id: image.id,
          url: image.url,
        };
      }

      const insertedImage = insertedImages.find(
        (inserted) => inserted.localId === image.localId,
      );

      if (!insertedImage) {
        throw new Error(`missing inserted image for localId ${image.localId}`);
      }

      return insertedImage;
    });
  } catch (error) {
    throwStepError("build final image state", error);
  }
}

export async function reorderImages(finalImages: FinalImageState[]): Promise<void> {
  try {
    const reordered = finalImages
      .filter((image) => !!image?.id)
      .map((image, index) => ({
        id: image.id,
        position: index,
      }));

    if (reordered.length > 0) {
      await updateImagePositions(reordered);
    }
  } catch (error) {
    throwStepError("reorder images", error);
  }
}

export async function updateProductCover(
  productId: string,
  productData: UpdateProductInput,
  finalImages: FinalImageState[],
): Promise<void> {
  try {
    const coverImage = finalImages.length > 0 ? finalImages[0].url : "/placeholder.svg";

    await updateProduct(productId, {
      ...productData,
      image: coverImage,
    });
  } catch (error) {
    throwStepError("update product cover", error);
  }
}

export async function updateProductWithImages({
  productId,
  productData,
  editableImages,
  originalImages,
}: UpdateProductWithImagesInput): Promise<void> {
  const newImages = editableImages.filter(
    (image): image is NewEditableImage => image.kind === "new",
  );

  const deletedImages = originalImages.filter(
    (original) =>
      !editableImages.some(
        (image) => image.kind === "existing" && image.id === original.id,
      ),
  );

  const uploadedImages = await uploadNewImages(productId, newImages);
  const insertedImages = await insertUploadedImages(productId, uploadedImages);
  await deleteRemovedImages(productId, deletedImages);
  const finalImages = buildFinalImageState(editableImages, insertedImages);
  await reorderImages(finalImages);
  await updateProductCover(productId, productData, finalImages);
}

async function uploadDraftImages(
  productId: string,
  draftImages: DraftImage[],
): Promise<{ path: string; url: string; position: number }[]> {
  const uploadedImages: { path: string; url: string; position: number }[] = [];

  try {
    for (const [index, draftImage] of draftImages.entries()) {
      const uploaded = await uploadImageToProductStorage(productId, draftImage.file, index);
      uploadedImages.push({
        path: uploaded.path,
        url: uploaded.publicUrl,
        position: index,
      });
    }

    return uploadedImages;
  } catch (error) {
    if (uploadedImages.length > 0) {
      try {
        await removeImagesFromStorage(uploadedImages.map((image) => image.path));
      } catch (cleanupError) {
        throw new Error(
          `create upload cleanup failed after partial upload: ${toErrorMessage(cleanupError)}`,
        );
      }
    }

    throwStepError("upload draft images", error);
  }
}

export async function createProductWithImages(
  productData: CreateProductInput,
  draftImages: DraftImage[],
): Promise<{ product: Product; imagesFailed: boolean }> {
  const created = await createProduct(productData);

  let imagesFailed = false;

  if (draftImages.length > 0) {
    try {
      const uploadedImages = await uploadDraftImages(created.id, draftImages);

      await insertProductImages(
        uploadedImages.map((image) => ({
          product_id: created.id,
          url: image.url,
          position: image.position,
        })),
      );
    } catch (error) {
      console.error("Image upload failed, product still created:", error);
      imagesFailed = true;

      // ⚠️ NO borramos el producto
      // ⚠️ NO hacemos rollback
    }
  }

  return {
    product: created,
    imagesFailed,
  };
}

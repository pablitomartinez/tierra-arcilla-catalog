// types/productImage.ts 

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  position: number;
  createdAt: string;
}

export interface DraftImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface ExistingEditableImage {
  kind: "existing";
  id: string;
  url: string;
  position: number;
}

export interface NewEditableImage {
  kind: "new";
  localId: string;
  file: File;
  previewUrl: string;
}

export type EditableImage = ExistingEditableImage | NewEditableImage;

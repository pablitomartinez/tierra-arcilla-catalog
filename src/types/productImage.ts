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

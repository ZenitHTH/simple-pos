export interface Image {
  id: number;
  file_name: string;
  file_hash: string;
  file_path: string;
  created_at: string;
  image_object_position?: string;
}

export interface ProductImage {
  product_id: number;
  image_id: number;
}

export interface StorageInfo {
  image_path: string;
  db_path: string;
}

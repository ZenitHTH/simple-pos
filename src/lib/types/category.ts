export interface Category {
  id: number;
  name: string;
}

export type NewCategory = Omit<Category, "id">;

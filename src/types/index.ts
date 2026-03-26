export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Document {
  id: number;
  title: string;
  content: string | null;
  categoryId: number | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  categoryName?: string | null;
}

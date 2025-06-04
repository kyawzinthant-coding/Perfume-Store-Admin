import { z } from 'zod';
export interface CategoryType {
  id: string;
  name: string;
  image_url?: string | null;
  created_at: any;
}

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  image_url: z.string().optional(),
});

export interface CategoryCRUDType {
  name: string;
  image_url?: string | null;
}

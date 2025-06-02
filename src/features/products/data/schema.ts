import { z } from 'zod';

export interface ProductType {
  id: string;
  name: string;
  description: string;
  brand_name: string;
  category_name: string;
  size_ml: number;
  price: string;
  stock_quantity: number;
  top_notes: string;
  middle_notes: string;
  base_notes: string;
  gender_affinity: string;
  is_active: number;
  image_url: string;
}

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  brand_id: z.string(),
  category_id: z.string(),
  size_ml: z.number(),
  price: z.string(),
  cloudinary_public_id: z.string(),
  stock_quantity: z.number(),
  top_notes: z.string(),
  middle_notes: z.string(),
  base_notes: z.string(),
  gender_affinity: z.string(),
  is_active: z.number(),
  image_url: z.string().url(),
});

export interface ProductCreateType {
  name: string;
  description: string;
  brand_id: string;
  category_id: string;
  size_ml: number;
  price: string;
  stock_quantity: number;
  top_notes?: string;
  middle_notes?: string;
  base_notes?: string;
  gender_affinity: string;
  is_active?: number;
  product_image?: File;
}

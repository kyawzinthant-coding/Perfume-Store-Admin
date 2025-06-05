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
  id?: string;
  name: string;
  description: string;
  brand_id: string;
  category_id: string;
  size_ml: number;
  price: number;
  stock_quantity: number;
  top_notes?: string;
  middle_notes?: string;
  base_notes?: string;
  gender_affinity: string;
  is_active?: number;
  product_image?: File;
  image_url?: string;
}

// Zod schema for form validation
export const productSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  brand_id: z.string().min(1, {
    message: 'Please select a brand.',
  }),
  category_id: z.string().min(1, {
    message: 'Please select a category.',
  }),
  size_ml: z.number().min(1, {
    message: 'Size must be at least 1ml.',
  }),
  price: z.number().min(1, {
    message: 'Price is required.',
  }),
  stock_quantity: z.number().min(0, {
    message: 'Stock quantity is required and must be 0 or greater.',
  }),
  top_notes: z.string().optional(),
  middle_notes: z.string().optional(),
  base_notes: z.string().optional(),
  gender_affinity: z.string().min(1, {
    message: 'Please select gender affinity.',
  }),
  product_image: z.any(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

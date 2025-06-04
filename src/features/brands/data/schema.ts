import { z } from 'zod';
export interface Brandtype {
  id: string;
  name: string;
  image_url: string;
  created_at: any;
}

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  image_url: z.string().url(),
});

export interface BrandCRUDType {
  name: string;
  image_url?: string | null;
}

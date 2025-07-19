import { z } from 'zod';

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  created_at: z.string(),
});

export interface UserRoldChange {
  role: string;
}

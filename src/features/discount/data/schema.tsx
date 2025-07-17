import { z } from 'zod';

export interface DiscountType {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  value: string;
  start_date: string;
  end_date: string;
  is_active: 0 | 1;
}

export const DiscountSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1, 'Discount code cannot be empty.'),
  description: z.string().optional().nullable(),
  discount_type: z.union([z.literal('percentage'), z.literal('fixed_amount')]),
  value: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'Value must be a valid number or decimal with up to 2 places.'
    ),
  start_date: z.string(),
  end_date: z.string(),
  is_active: z.union([z.literal(0), z.literal(1)]),
});

export interface DiscountCRUDType {
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  value: any;
  start_date: string;
  end_date: string;
  is_active?: 0 | 1;
}

/**
 * Zod schema for validating discount code data during creation/update.
 * 'id' is omitted.
 */
export const DiscountCRUDSchema = z.object({
  code: z.string().min(1, 'Discount code cannot be empty.'),
  description: z.string().min(1, 'Description cannot be empty.'),
  discount_type: z.union([z.literal('percentage'), z.literal('fixed_amount')]),
  value: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'Value must be a valid number or decimal with up to 2 places.'
    ),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  is_active: z.union([z.literal(0), z.literal(1)]),
});

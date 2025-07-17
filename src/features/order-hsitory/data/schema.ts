import { z } from 'zod';

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderType {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: string;
  shipping_customer_name: string;
  shipping_customer_email: string;
  created_at: string;
  updated_at: string;
  total_items: string;
}

export const OrderSchema = z.object({
  id: z.string().uuid('Invalid order ID format.'),
  user_id: z.string().uuid('Invalid user ID format.'),
  order_number: z.string().min(1, 'Order number cannot be empty.'),
  status: z.union([
    z.literal('Pending'),
    z.literal('Processing'),
    z.literal('Shipped'),
    z.literal('Delivered'),
    z.literal('Cancelled'),
    z.literal('Refunded'),
  ]),
  total_amount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'Total amount must be a valid currency format (e.g., 123.45).'
    ),
  shipping_customer_name: z
    .string()
    .min(1, 'Shipping customer name is required.'),
  shipping_customer_email: z
    .string()
    .email('Invalid shipping customer email format.'),
  created_at: z.string(),
  updated_at: z.string(),
  total_items: z.string(),
});

export interface OrderCRUDType {
  user_id: string;
  status?: OrderStatus; // Optional, might be defaulted or only relevant for updates
  total_amount: string;
  shipping_customer_name: string;
  shipping_customer_email: string;
  total_items: string;
}

export const OrderCRUDSchema = z.object({
  user_id: z.string().uuid('User ID must be a valid UUID.').optional(), // User ID might be from auth context, making it optional for CRUD payload if backend infers it
  status: z
    .union([
      z.literal('Pending'),
      z.literal('Processing'),
      z.literal('Shipped'),
      z.literal('Delivered'),
      z.literal('Cancelled'),
      z.literal('Refunded'),
    ])
    .optional(), // Status might be optional for creation or only for updates
  total_amount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      'Total amount must be a valid currency format (e.g., 123.45).'
    ),
  shipping_customer_name: z
    .string()
    .min(1, 'Shipping customer name is required.'),
  shipping_customer_email: z
    .string()
    .email('Invalid shipping customer email format.'),
  total_items: z.string(),
});

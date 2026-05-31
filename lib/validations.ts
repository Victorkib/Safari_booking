import { z } from 'zod'

export const createBookingSchema = z.object({
  package_id: z.string().min(1, 'Package is required'),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid start date'),
  number_of_guests: z.number().int().min(1).max(50),
  special_requests: z.string().max(2000).optional(),
})

export const adminCreateBookingSchema = createBookingSchema.extend({
  customerUserId: z.string().min(1, 'Customer is required'),
})

export const adminRecordPaymentSchema = z.object({
  booking_id: z.string().min(1),
  method: z.enum(['cash', 'bank_transfer', 'mpesa_manual', 'mpesa_stk']),
  mpesa_phone: z.string().max(20).optional(),
  transaction_id: z.string().max(128).optional(),
  mpesa_receipt: z.string().max(32).optional(),
  notes: z.string().max(500).optional(),
})

export const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['customer', 'driver', 'admin']),
})

export const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().optional(),
  role: z.enum(['customer', 'driver', 'admin']).optional(),
})

export const createPaymentSchema = z.object({
  booking_id: z.string().min(1),
  payment_method: z.enum(['mpesa', 'stripe', 'bank_transfer']),
  transaction_id: z.string().min(1).max(128).optional(),
  mpesa_receipt: z.string().max(32).optional(),
  mpesa_phone: z.string().max(20).optional(),
})

export const updateBookingStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['pending', 'paid', 'confirmed', 'cancelled', 'completed']),
})

export const adminPaymentStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
})

export function formatZodError(error: z.ZodError): string {
  return error.errors.map((e) => e.message).join(', ')
}

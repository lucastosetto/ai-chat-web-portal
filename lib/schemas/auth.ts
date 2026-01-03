import { z } from 'zod';

/**
 * Schema for requesting a magic link
 */
export const requestMagicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

/**
 * Schema for verifying a magic link token
 */
export const verifyMagicLinkSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;


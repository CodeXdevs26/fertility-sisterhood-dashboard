import * as z from "zod";

export const planSchema = z.object({
  title: z.string().trim().min(1, "Package name is required").max(80),
  description: z.string().trim().min(1, "Description is required").max(500),
  price: z
    .string({ required_error: "Price is required" })
    .trim()
    .min(1, "Price is required")
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Enter a valid price with up to two decimal places")
    .refine((value) => Number(value) > 0, "Price must be greater than 0"),
});

export type PlanFormValues = z.infer<typeof planSchema>;

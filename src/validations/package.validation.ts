import * as z from "zod";

export const packageSchema = z.object({
  title: z.string().trim().min(1, "Package name is required").max(100),
  billingCycle: z.enum(["MONTHLY", "ANNUAL"], { error: "Billing cycle is required" }),
  revenueCatProductId: z.string().trim().min(1, "Product ID is required"),
  entitlementId: z.string().trim().min(1, "Entitlement ID is required"),
  // one feature per line, sent as an array
  description: z
    .string()
    .refine((value) => value.split("\n").filter((line) => line.trim()).length <= 20, "Up to 20 features"),
  price: z
    .string({ error: "Price is required" })
    .trim()
    .min(1, "Price is required")
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Enter a valid price with up to two decimal places")
    .refine((value) => Number(value) > 0, "Price must be greater than 0"),
});

export type PackageFormValues = z.infer<typeof packageSchema>;

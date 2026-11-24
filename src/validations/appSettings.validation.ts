import * as z from "zod";

export const appSettingsSchema = z.object({
  supportEmail: z.string().trim().min(1, "Support email is required").email("Enter a valid email"),
  supportPhone: z
    .string()
    .trim()
    .min(1, "Support phone is required")
    .regex(/^\+?[\d\s()-]{6,20}$/, "Enter a valid phone number"),
  communityLink: z.string().trim().min(1, "Community link is required").url("Enter a valid link (https://...)"),
});

export type AppSettingsFormValues = z.infer<typeof appSettingsSchema>;

import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "User name is required")
    .min(2, "User name must be at least 2 characters"),
  // email is read-only, shown for reference only
  email: z.string(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

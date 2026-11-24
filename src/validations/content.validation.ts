import * as z from "zod";

export const quoteSchema = z.object({
  text: z.string().trim().min(1, "Quote is required").max(300),
  author: z.string().trim().max(80),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;

export const checklistTemplateSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().trim().min(1, "Item is required").max(200),
});

export type ChecklistTemplateFormValues = z.infer<typeof checklistTemplateSchema>;

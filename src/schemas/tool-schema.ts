import { z } from "zod";

// Define the canonical form schema with Zod
export const toolFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  pricing: z.string().min(1, { message: "Please enter pricing information" }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL" }),
  // Optional URLs: Allow empty string or valid URL. Null conversion handled in onSubmit.
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  reviewUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  // Booleans: Should be non-optional boolean. Default handled in useForm.
  openSource: z.boolean(),
  apiAccess: z.boolean(),
  // Optional strings. Null conversion handled in onSubmit.
  documentationQuality: z.string().optional(),
  communitySize: z.string().optional(),
  lastUpdated: z.string().optional(),
  license: z.string().optional(),
  easeOfUse: z.string().optional(),
  reliability: z.string().optional(),
  // Comma-separated strings for arrays (handled in onSubmit)
  features: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  languages: z.string().optional(),
  // Optional number (handle string input). Null conversion handled in onSubmit.
  // Let the form handle string input directly
  reviewCount: z.string().optional().refine((val) => !val || !isNaN(Number(val)), { message: "Must be a valid number" }),
});

// Infer the type for form values (will now have string | undefined, not string | null | undefined for transformed fields)
export type ToolFormValues = z.infer<typeof toolFormSchema>; 
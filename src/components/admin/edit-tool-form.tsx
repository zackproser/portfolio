"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateTool } from "@/actions/tool-actions" // We'll assume an updateTool action exists
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { ManifestTool } from "@/actions/tool-actions"

// Define the form schema (similar to AddToolForm)
const toolFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  pricing: z.string().min(1, { message: "Please enter pricing information" }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL" }),
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  logoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  openSource: z.boolean().default(false),
  apiAccess: z.boolean().default(false),
  documentationQuality: z.string().optional(),
  communitySize: z.string().optional(),
  lastUpdated: z.string().optional(),
  features: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  languages: z.string().optional(),
  reviewCount:
    // Accept an optional string from the form
    z.string()
    .optional()
    // Transform to number | null before validation/submission
    .transform((val) => (val && val.trim() !== "" ? Number.parseInt(val.trim(), 10) : null))
    // Add refine to ensure it's a valid number if provided
    .refine((val) => val === null || !isNaN(val), { message: "Must be a valid number" }),
  reviewUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

type ToolFormValues = z.infer<typeof toolFormSchema>

// Define a type for the data expected by updateTool
// (Based on the ManifestTool model, excluding id)
type ToolUpdateData = Partial<Omit<ManifestTool, 'id'>>;

interface EditToolFormProps {
  tool: ManifestTool // Pass the tool data to pre-fill the form
  onSuccess?: () => void
}

export function EditToolForm({ tool, onSuccess }: EditToolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize the form with existing tool data
  const form = useForm<ToolFormValues>({
    // Cast the resolver to any to bypass type conflicts
    resolver: zodResolver(toolFormSchema) as any,
    defaultValues: {
      name: tool.name || "",
      description: tool.description || "",
      category: tool.category || "",
      pricing: tool.pricing || "",
      websiteUrl: tool.websiteUrl || "",
      githubUrl: tool.githubUrl || "",
      logoUrl: tool.logoUrl || "",
      openSource: tool.openSource || false,
      apiAccess: tool.apiAccess || false,
      documentationQuality: tool.documentationQuality || "",
      communitySize: tool.communitySize || "",
      lastUpdated: tool.lastUpdated || "",
      // Convert arrays back to comma-separated strings for the form
      features: tool.features?.join(", ") || "",
      pros: tool.pros?.join(", ") || "",
      cons: tool.cons?.join(", ") || "",
      languages: tool.languages?.join(", ") || "",
      // Keep as string for the form input - Cast to any
      reviewCount: (tool.reviewCount !== null && tool.reviewCount !== undefined ? String(tool.reviewCount) : "") as any,
      reviewUrl: tool.reviewUrl || "",
    },
  })
  
  // Reset form if the tool prop changes (e.g., user edits another tool)
  useEffect(() => {
    form.reset({
      name: tool.name || "",
      description: tool.description || "",
      category: tool.category || "",
      pricing: tool.pricing || "",
      websiteUrl: tool.websiteUrl || "",
      githubUrl: tool.githubUrl || "",
      logoUrl: tool.logoUrl || "",
      openSource: tool.openSource || false,
      apiAccess: tool.apiAccess || false,
      documentationQuality: tool.documentationQuality || "",
      communitySize: tool.communitySize || "",
      lastUpdated: tool.lastUpdated || "",
      features: tool.features?.join(", ") || "",
      pros: tool.pros?.join(", ") || "",
      cons: tool.cons?.join(", ") || "",
      languages: tool.languages?.join(", ") || "",
      // Keep as string for the form input - Cast to any
      reviewCount: (tool.reviewCount !== null && tool.reviewCount !== undefined ? String(tool.reviewCount) : "") as any,
      reviewUrl: tool.reviewUrl || "", // Ensure only one reviewUrl entry
    });
  }, [tool, form]);

  // Handle form submission
  async function onSubmit(data: any) {
    // console.log("onSubmit function called with data:", data); // Remove log
    setIsSubmitting(true)

    try {
      // Process arrays from comma-separated strings
      // console.log("Attempting to process data..."); // Remove log
      const processedData = {
        ...data,
        // Add string type to item
        features: data.features ? data.features.split(",").map((item: string) => item.trim()) : undefined,
        // Add string type to item
        pros: data.pros ? data.pros.split(",").map((item: string) => item.trim()) : undefined,
        // Add string type to item
        cons: data.cons ? data.cons.split(",").map((item: string) => item.trim()) : undefined, // Pass undefined for empty optional lists
        // Add string type to item
        languages: data.languages ? data.languages.split(",").map((item: string) => item.trim()) : undefined, // Pass undefined for empty optional lists
        // Parse reviewCount string to number | null or use number directly
        reviewCount: typeof data.reviewCount === 'number' 
          ? data.reviewCount 
          : (data.reviewCount && data.reviewCount.trim() !== "" ? Number.parseInt(data.reviewCount.trim(), 10) : undefined),
      }
      // console.log("Processed data:", processedData); // Remove log

      // Call the server action to update the tool
      // console.log(`Calling updateTool for tool ID: ${tool.id}`); // Remove log
      await updateTool(tool.id, processedData as ToolUpdateData)

      toast({
        title: "Tool updated successfully",
        description: `${data.name} has been updated.`,
      })

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Refresh the page data
      router.refresh()
    } catch (error) {
      console.error("Error updating tool:", error)
      toast({
        title: "Error updating tool",
        description: "There was a problem updating the tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Categories for the dropdown (same as AddToolForm)
  const categories = [
    { id: "llm", name: "LLM APIs" },
    { id: "vector-db", name: "Vector Databases" },
    { id: "framework", name: "AI Frameworks" },
    { id: "agent", name: "Agent Frameworks" },
    { id: "embedding", name: "Embedding Models" },
    { id: "orchestration", name: "Orchestration" },
    { id: "evaluation", name: "Evaluation Tools" },
    { id: "fine-tuning", name: "Fine-tuning" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-8">
        {/* Form fields are identical to AddToolForm, just pre-filled */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tool Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., OpenAI API" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this tool does and its main purpose..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="pricing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Free, Freemium, Pay-per-token" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="openSource"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Open Source</FormLabel>
                      <FormDescription>Is this tool open source?</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="apiAccess"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>API Access</FormLabel>
                      <FormDescription>Does this tool provide API access?</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* URLs and Additional Info */}
          <div className="space-y-6">
            <FormField
              control={form.control as any}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL*</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                   <FormDescription>If hosted locally, use relative path e.g., /logos/logo.svg</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Other optional fields - identical structure */}
            <FormField
              control={form.control as any}
              name="documentationQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documentation Quality (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Excellent, Good, Poor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control as any}
              name="communitySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Size (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Large, Medium, Small" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control as any}
              name="lastUpdated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Updated (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2024-07-15 or 'Actively maintained'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Advanced/Optional Fields */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-gray-800">
           <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Detailed Information (Optional)</h3>
           <FormField
              control={form.control as any}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Features</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List key features, separated by commas..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>Example: Feature A, Feature B, Another Feature</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

           <FormField
              control={form.control as any}
              name="pros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pros</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List pros, separated by commas..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>Example: Easy to use, Great support, Flexible</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

           <FormField
              control={form.control as any}
              name="cons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cons</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List cons, separated by commas..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Example: Limited free tier, Steep learning curve</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supported Languages/SDKs</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Python, JavaScript, Go" {...field} />
                  </FormControl>
                   <FormDescription>Separate languages with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="reviewCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control as any}
                name="reviewUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/reviews" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

        </div>

        <div className="flex justify-end space-x-4">
           <Button type="button" variant="outline" onClick={onSuccess} disabled={isSubmitting}>
             Cancel
           </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 dark:from-blue-700 dark:to-blue-900 dark:hover:from-blue-600 dark:hover:to-blue-800 text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
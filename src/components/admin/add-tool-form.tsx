"use client"

import { useState } from "react"
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
import { addTool } from "@/actions/tool-actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Define the form schema with Zod
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
  reviewCount: z
    .string()
    .transform((val) => (val ? Number.parseInt(val, 10) : undefined))
    .optional(),
  reviewUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

type ToolFormValues = z.infer<typeof toolFormSchema>

interface AddToolFormProps {
  onSuccess?: () => void
}

export function AddToolForm({ onSuccess }: AddToolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      pricing: "",
      websiteUrl: "",
      githubUrl: "",
      logoUrl: "/placeholder.svg?height=40&width=40",
      openSource: false,
      apiAccess: false,
      documentationQuality: "",
      communitySize: "",
      lastUpdated: "",
      features: "",
      pros: "",
      cons: "",
      languages: "",
      reviewCount: "",
      reviewUrl: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: ToolFormValues) {
    setIsSubmitting(true)

    try {
      // Process arrays from comma-separated strings
      const processedData = {
        ...data,
        features: data.features ? data.features.split(",").map((item) => item.trim()) : undefined,
        pros: data.pros ? data.pros.split(",").map((item) => item.trim()) : undefined,
        cons: data.cons ? data.cons.split(",").map((item) => item.trim()) : undefined,
        languages: data.languages ? data.languages.split(",").map((item) => item.trim()) : undefined,
      }

      // In a real app, this would call a server action to save to a database
      // For this demo, we'll simulate a successful save
      await addTool(processedData)

      toast({
        title: "Tool added successfully",
        description: `${data.name} has been added to your comparison platform.`,
      })

      // Reset the form
      form.reset()

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }

      // Refresh the page data
      router.refresh()
    } catch (error) {
      console.error("Error adding tool:", error)
      toast({
        title: "Error adding tool",
        description: "There was a problem adding the tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Categories for the dropdown
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
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
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/example/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="/placeholder.svg?height=40&width=40" {...field} />
                  </FormControl>
                  <FormDescription>Leave as default for a placeholder image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="documentationQuality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documentation Quality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communitySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Very Large">Very Large</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Small but growing">Small but growing</SelectItem>
                        <SelectItem value="Small">Small</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastUpdated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Updated</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., May 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supported Languages</FormLabel>
                    <FormControl>
                      <Input placeholder="Python, JavaScript, Java" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated list</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Features, Pros, Cons */}
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Features</FormLabel>
                <FormControl>
                  <Textarea placeholder="Feature 1, Feature 2, Feature 3..." className="min-h-[80px]" {...field} />
                </FormControl>
                <FormDescription>Enter features as a comma-separated list</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="pros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pros</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Pro 1, Pro 2, Pro 3..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormDescription>Enter pros as a comma-separated list</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cons</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Con 1, Con 2, Con 3..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormDescription>Enter cons as a comma-separated list</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="reviewCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Count</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 dark:from-blue-700 dark:to-blue-900 dark:hover:from-blue-600 dark:hover:to-blue-800 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Tool"
          )}
        </Button>
      </form>
    </Form>
  )
} 
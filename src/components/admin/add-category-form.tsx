"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Define the form schema with Zod
const categoryFormSchema = z.object({
  id: z.string().min(2, { message: "ID must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  color: z.string().min(1, { message: "Please select a color" }),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface AddCategoryFormProps {
  onSuccess?: () => void
}

// In a real app, this would be a server action
async function addCategory(data: CategoryFormValues) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Adding category:", data)
  return { success: true }
}

export function AddCategoryForm({ onSuccess }: AddCategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      color: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: CategoryFormValues) {
    setIsSubmitting(true)

    try {
      // In a real app, this would call a server action to save to a database
      await addCategory(data)

      toast({
        title: "Category added successfully",
        description: `${data.name} has been added to your categories.`,
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
      console.error("Error adding category:", error)
      toast({
        title: "Error adding category",
        description: "There was a problem adding the category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Available colors
  const colors = [
    { id: "violet", name: "Violet" },
    { id: "blue", name: "Blue" },
    { id: "green", name: "Green" },
    { id: "amber", name: "Amber" },
    { id: "pink", name: "Pink" },
    { id: "cyan", name: "Cyan" },
    { id: "indigo", name: "Indigo" },
    { id: "orange", name: "Orange" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category ID*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., llm, vector-db" {...field} />
                </FormControl>
                <FormDescription>
                  A unique identifier used in URLs and API calls (no spaces, use hyphens)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., LLM APIs" {...field} />
                </FormControl>
                <FormDescription>The display name shown to users</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this category of tools..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.id}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full bg-${color.id}-500 mr-2`}
                          aria-hidden="true"
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>This color will be used to identify the category in the UI</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-cyan-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Category"
          )}
        </Button>
      </form>
    </Form>
  )
}
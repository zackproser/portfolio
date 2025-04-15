"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CategoryList } from "@/components/admin/category-list"
import { AddCategoryForm } from "@/components/admin/add-category-form"

export default function CategoriesAdminPage() {
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">Manage Categories</h1>
      </div>

      {isAddingCategory ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Add New Category</h2>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              Cancel
            </Button>
          </div>
          <AddCategoryForm onSuccess={() => setIsAddingCategory(false)} />
        </div>
      ) : (
        <Button onClick={() => setIsAddingCategory(true)} className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-600">
          <Plus className="w-4 h-4 mr-2" />
          Add New Category
        </Button>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">All Categories</h2>
        <CategoryList />
      </div>
    </div>
  )
} 
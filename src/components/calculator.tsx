"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type AddOn = {
  id: string
  name: string
  description: string
  price: number
  selected?: boolean
  count?: number
}

export function Calculator() {
  const basePrice = 20000

  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: "data-source",
      name: "Custom Data Source",
      description: "Retrieve context from your own database or vector store",
      price: 1500,
      selected: false,
      count: 1,
    },
    {
      id: "additional-data-source",
      name: "Additional Data Sources",
      description: "Each additional data source beyond the first",
      price: 500,
      selected: false,
      count: 0,
    },
    {
      id: "ui-loading",
      name: "Custom Loading States",
      description: "Tailored loading experiences for your application",
      price: 1200,
      selected: false,
    },
    {
      id: "ui-branding",
      name: "Custom Branding & Logos",
      description: "Professional design integration with your brand",
      price: 1800,
      selected: false,
    },
    {
      id: "ui-marketing",
      name: "Marketing & Landing Pages",
      description: "Conversion-optimized pages to showcase your product",
      price: 2500,
      selected: false,
    },
    {
      id: "email-capture",
      name: "Email Capture with EmailOctopus",
      description: "Integrated email capture system with EmailOctopus",
      price: 1000,
      selected: false,
    },
  ])

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)

  const toggleAddOn = (id: string) => {
    setAddOns(addOns.map((addon) => (addon.id === id ? { ...addon, selected: !addon.selected } : addon)))
  }

  const updateDataSourceCount = (count: number) => {
    if (count < 0) count = 0

    setAddOns(addOns.map((addon) => (addon.id === "additional-data-source" ? { ...addon, count } : addon)))
  }

  const calculateTotal = () => {
    let total = basePrice

    addOns.forEach((addon) => {
      if (addon.selected) {
        if (addon.id === "additional-data-source" && addon.count) {
          total += addon.price * addon.count
        } else {
          total += addon.price
        }
      }
    })

    return total
  }

  const handleCheckout = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError(true)
      return
    }

    setEmailError(false)
    // In a real application, this would redirect to Stripe checkout
    alert(`Redirecting to Stripe checkout for $${calculateTotal().toLocaleString()}`)
  }

  const total = calculateTotal()
  const depositAmount = total / 2

  return (
    <div className="shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-950 text-white p-6">
        <h2 className="text-2xl font-semibold">Project Calculator</h2>
        <p className="text-indigo-300 text-sm mt-1.5">Configure your custom Next.js development project</p>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center text-indigo-900">
              <CheckCircle2 className="mr-2 h-5 w-5 text-yellow-500" />
              Base Project
            </h3>
            <p className="text-slate-600 mb-2">
              Custom Next.js development with Generative AI or RAG chatbot functionality deployed on Vercel.
            </p>
            <div className="bg-indigo-50 p-3 rounded-md flex justify-between items-center">
              <span className="font-medium text-indigo-900">Base Project Cost</span>
              <span className="font-semibold text-indigo-900">${basePrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-indigo-900">Add-Ons & Enhancements</h3>

            <div className="space-y-4">
              {addOns.map((addon) => (
                <div
                  key={addon.id}
                  className={cn(
                    "border rounded-md p-4 transition-colors",
                    addon.selected ? "border-indigo-300 bg-indigo-50/50" : "border-slate-200",
                  )}
                >
                  <div className="flex items-start">
                    <Checkbox
                      id={addon.id}
                      checked={addon.selected}
                      onCheckedChange={() => toggleAddOn(addon.id)}
                      className="mt-1 border-indigo-400 text-indigo-600 rounded-sm"
                    />
                    <div className="ml-3 flex-1">
                      <Label htmlFor={addon.id} className="font-medium cursor-pointer text-indigo-900">
                        {addon.name}
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">{addon.description}</p>

                      {addon.id === "additional-data-source" && addon.selected && (
                        <div className="mt-3 flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-indigo-300 text-indigo-700"
                            onClick={() => updateDataSourceCount((addon.count || 0) - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-3 min-w-8 text-center">{addon.count}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-indigo-300 text-indigo-700"
                            onClick={() => updateDataSourceCount((addon.count || 0) + 1)}
                          >
                            +
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-right font-medium text-indigo-900">
                      ${addon.price.toLocaleString()}
                      {addon.id === "additional-data-source" && addon.count && addon.count > 0 && addon.selected && (
                        <span className="block text-sm text-slate-600">
                          × {addon.count} = ${(addon.price * addon.count).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-indigo-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-indigo-900">Total Project Cost</span>
              <span className="text-xl font-bold text-indigo-900">${total.toLocaleString()}</span>
            </div>
            <div className="text-sm text-slate-600">
              <p className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-indigo-500" />
                50% deposit due upfront: ${depositAmount.toLocaleString()}
              </p>
              <p className="ml-5">50% due upon project delivery: ${depositAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className={emailError ? "text-red-500" : "text-indigo-900"}>
              Email Address {emailError && "(Please enter a valid email)"}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(false)
              }}
              className={cn(
                "border-indigo-200 focus:border-indigo-300 focus:ring-indigo-300",
                emailError ? "border-red-500" : "",
              )}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white px-6 pb-6 pt-0">
        <Button
          className="w-full py-6 text-lg bg-amber-500 hover:bg-amber-600 text-black font-medium"
          onClick={handleCheckout}
        >
          Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-slate-600 text-center mt-4">
          By proceeding, you agree to our terms of service and project timeline.
        </p>
      </div>
    </div>
  )
} 
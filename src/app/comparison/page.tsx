"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, Minus } from "lucide-react"
import type { Tool } from "@/types/tools"
import { getAllTools } from "@/actions/tool-actions"

export default function ComparisonPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true)
      const toolIds = searchParams.get("tools")?.split(",") || []
      
      if (toolIds.length < 2) {
        router.push("/devtools")
        return
      }

      const allTools = await getAllTools()
      const selectedTools = allTools.filter((tool) => toolIds.includes(tool.id))
      
      if (selectedTools.length < 2) {
        router.push("/devtools")
        return
      }
      
      setTools(selectedTools)
      setLoading(false)
    }

    fetchTools()
  }, [searchParams, router])

  const comparisonFeatures = [
    { id: "pricing", name: "Pricing" },
    { id: "category", name: "Category" },
    { id: "openSource", name: "Open Source" },
    { id: "apiAccess", name: "API Access" },
    { id: "documentationQuality", name: "Documentation Quality" },
    { id: "communitySize", name: "Community Size" },
    { id: "lastUpdated", name: "Last Updated" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <ArrowLeft className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-700 mb-2">Loading comparison...</h1>
          <p className="text-slate-500">Please wait while we prepare your comparison.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/devtools")}
            className="mr-4 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 text-transparent bg-clip-text">
            Comparing {tools.length} Tools
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100">
                <TableHead className="w-[200px] font-bold text-slate-800">Feature</TableHead>
                {tools.map((tool) => (
                  <TableHead key={tool.id} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                        {tool.logoUrl ? (
                          <div 
                            className="w-full h-full bg-cover bg-center bg-no-repeat p-1"
                            style={{ backgroundImage: `url(${tool.logoUrl || "/placeholder.svg?height=40&width=40"})` }}
                            role="img"
                            aria-label={`${tool.name} logo`}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                            {tool.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-800">{tool.name}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonFeatures.map((feature, index) => (
                <TableRow key={feature.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <TableCell className="font-medium text-slate-700">{feature.name}</TableCell>
                  {tools.map((tool) => (
                    <TableCell key={`${tool.id}-${feature.id}`} className="text-center">
                      {renderComparisonValue(tool, feature.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow className="bg-white">
                <TableCell className="font-medium text-slate-700">Key Features</TableCell>
                {tools.map((tool) => (
                  <TableCell key={`${tool.id}-features`}>
                    <ul className="list-disc pl-5 space-y-1">
                      {tool.features?.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-700">
                          {feature}
                        </li>
                      )) || <Minus className="h-4 w-4 mx-auto text-slate-400" />}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-slate-50">
                <TableCell className="font-medium text-slate-700">Pros</TableCell>
                {tools.map((tool) => (
                  <TableCell key={`${tool.id}-pros`}>
                    <ul className="list-disc pl-5 space-y-1">
                      {tool.pros?.map((pro, index) => (
                        <li key={index} className="text-sm text-green-700">
                          {pro}
                        </li>
                      )) || <Minus className="h-4 w-4 mx-auto text-slate-400" />}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-white">
                <TableCell className="font-medium text-slate-700">Cons</TableCell>
                {tools.map((tool) => (
                  <TableCell key={`${tool.id}-cons`}>
                    <ul className="list-disc pl-5 space-y-1">
                      {tool.cons?.map((con, index) => (
                        <li key={index} className="text-sm text-red-700">
                          {con}
                        </li>
                      )) || <Minus className="h-4 w-4 mx-auto text-slate-400" />}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function renderComparisonValue(tool: any, featureId: string) {
  switch (featureId) {
    case "pricing":
      return tool.pricing ? (
        <Badge variant="outline" className="bg-white text-slate-700 border-slate-200">
          {tool.pricing}
        </Badge>
      ) : (
        <Minus className="h-4 w-4 text-slate-400 mx-auto" />
      )

    case "category":
      return tool.categoryName ? (
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
          {tool.categoryName}
        </Badge>
      ) : (
        <Minus className="h-4 w-4 text-slate-400 mx-auto" />
      )

    case "openSource":
      return tool.openSource ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      )

    case "apiAccess":
      return tool.apiAccess ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      )

    case "documentationQuality":
      return tool.documentationQuality ? (
        <Badge variant="outline" className="bg-white text-slate-700 border-slate-200">
          {tool.documentationQuality}
        </Badge>
      ) : (
        <Minus className="h-4 w-4 text-slate-400 mx-auto" />
      )

    case "communitySize":
      return tool.communitySize ? (
        <Badge variant="outline" className="bg-white text-slate-700 border-slate-200">
          {tool.communitySize}
        </Badge>
      ) : (
        <Minus className="h-4 w-4 text-slate-400 mx-auto" />
      )

    case "lastUpdated":
      return tool.lastUpdated ? (
        <span className="text-slate-700">{tool.lastUpdated}</span>
      ) : (
        <Minus className="h-4 w-4 text-slate-400 mx-auto" />
      )

    default:
      return <Minus className="h-4 w-4 text-slate-400 mx-auto" />
  }
} 
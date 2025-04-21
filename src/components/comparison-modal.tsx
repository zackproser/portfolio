"use client"

import { useTools } from "@/components/tools-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, Minus } from "lucide-react"

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  const { tools, selectedTools } = useTools()
  
  const selectedToolDetails = tools.filter((tool) => selectedTools.includes(tool.id))

  const comparisonFeatures = [
    { id: "pricing", name: "Pricing" },
    { id: "category", name: "Category" },
    { id: "openSource", name: "Open Source" },
    { id: "apiAccess", name: "API Access" },
    { id: "documentationQuality", name: "Documentation Quality" },
    { id: "communitySize", name: "Community Size" },
    { id: "lastUpdated", name: "Last Updated" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 text-transparent bg-clip-text">
            Tool Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-violet-50 to-purple-50">
                <TableHead className="w-[200px] font-bold">Feature</TableHead>
                {selectedToolDetails.map((tool) => (
                  <TableHead key={tool.id} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
                        {tool.logoUrl ? (
                          <img
                            src={tool.logoUrl}
                            alt={`${tool.name} logo`}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
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
                  {selectedToolDetails.map((tool) => (
                    <TableCell key={`${tool.id}-${feature.id}`} className="text-center">
                      {renderComparisonValue(tool, feature.id)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow className="bg-white">
                <TableCell className="font-medium text-slate-700">Key Features</TableCell>
                {selectedToolDetails.map((tool) => (
                  <TableCell key={`${tool.id}-features`}>
                    <ul className="list-disc pl-5 space-y-1">
                      {tool.features?.map((feature: string, index: number) => (
                        <li key={index} className="text-sm text-slate-700">
                          {feature}
                        </li>
                      )) || <Minus className="h-4 w-4 text-slate-400 mx-auto" />}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-slate-50">
                <TableCell className="font-medium text-slate-700">Pros</TableCell>
                {selectedToolDetails.map((tool) => (
                  <TableCell key={`${tool.id}-pros`}>
                    <ul className="list-disc pl-5 space-y-1">
                      {tool.pros?.map((pro: string, index: number) => (
                        <li key={index} className="text-sm text-green-700">
                          {pro}
                        </li>
                      )) || <Minus className="h-4 w-4 text-slate-400 mx-auto" />}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-white">
                <TableCell className="font-medium text-slate-700">Cons</TableCell>
                {selectedToolDetails.map((tool) => (
                  <TableCell key={`${tool.id}-cons`}>
                    <ul className="list-disc pl-5 space-y-1">
                      {tool.cons?.map((con: string, index: number) => (
                        <li key={index} className="text-sm text-red-700">
                          {con}
                        </li>
                      )) || <Minus className="h-4 w-4 text-slate-400 mx-auto" />}
                    </ul>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
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
        <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700">
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
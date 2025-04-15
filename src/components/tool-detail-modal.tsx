"use client"

import { useTools } from "@/components/tools-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Plus, Check, Github, MessageSquare } from "lucide-react"

interface ToolDetailModalProps {
  toolId: string
  isOpen: boolean
  onClose: () => void
}

export function ToolDetailModal({ toolId, isOpen, onClose }: ToolDetailModalProps) {
  const { tools, toggleToolSelection, selectedTools } = useTools()
  const tool = tools.find(t => t.id === toolId)
  const isSelected = selectedTools.includes(toolId)

  if (!tool) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat p-1"
                style={{ backgroundImage: `url(${tool.logoUrl || "/placeholder.svg?height=40&width=40"})` }}
                role="img"
                aria-label={`${tool.name} logo`}
              />
            </div>
            <div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-blue-700 to-blue-600 text-transparent bg-clip-text">
                {tool.name}
              </DialogTitle>
              {tool.reviewCount && (
                <a
                  href={tool.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-700 mt-1"
                >
                  <MessageSquare className="h-3 w-3" />
                  {tool.reviewCount} reviews
                </a>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
            {tool.categoryName}
          </Badge>
          {tool.pricing && (
            <Badge variant="outline" className="text-slate-700 border-slate-200">
              {tool.pricing}
            </Badge>
          )}
          {tool.openSource && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Open Source
            </Badge>
          )}
        </div>

        <p className="text-slate-600 dark:text-slate-300 mt-4">{tool.description}</p>

        <Tabs defaultValue="features" className="mt-6">
          <TabsList className="bg-slate-100 dark:bg-gray-700 p-1">
            <TabsTrigger value="features" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-700">
              Features
            </TabsTrigger>
            <TabsTrigger value="pros-cons" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-700">
              Pros & Cons
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-700">
              Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="mt-4">
            <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-slate-200">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
              {tool.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="pros-cons" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900">
                <h3 className="text-lg font-medium mb-2 text-green-700 dark:text-green-400">Pros</h3>
                <ul className="list-disc pl-5 space-y-2 text-green-700 dark:text-green-400">
                  {tool.pros?.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900">
                <h3 className="text-lg font-medium mb-2 text-red-700 dark:text-red-400">Cons</h3>
                <ul className="list-disc pl-5 space-y-2 text-red-700 dark:text-red-400">
                  {tool.cons?.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Documentation Quality</h3>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">{tool.documentationQuality || "Not rated"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Community Size</h3>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">{tool.communitySize || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Updated</h3>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">{tool.lastUpdated || "Not specified"}</p>
                </div>
              </div>
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">API Access</h3>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">{tool.apiAccess ? "Yes" : "No"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">License</h3>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">{tool.license || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Languages</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tool.languages?.map((lang, index) => (
                      <Badge key={index} variant="outline" className="bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-gray-700">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <div className="flex gap-2">
            {tool.githubUrl && (
              <Button
                variant="outline"
                className="border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white"
                asChild
              >
                <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className="border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white"
              asChild
            >
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </a>
            </Button>
          </div>
          <Button
            onClick={() => toggleToolSelection(tool.id)}
            variant={isSelected ? "default" : "outline"}
            className={
              isSelected
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none"
                : "text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            }
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Added to Comparison
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add to Comparison
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
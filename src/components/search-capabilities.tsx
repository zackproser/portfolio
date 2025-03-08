import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SearchCapabilitiesProps {
  databases: Database[]
}

export default function SearchCapabilities({ databases }: SearchCapabilitiesProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Search Features</CardTitle>
          <CardDescription>Core vector search capabilities and features</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow key="search-features-header">
                <TableHead className="w-[250px]">Feature</TableHead>
                {databases.map((db, index) => (
                  <TableHead key={db.id || `db-${index}`}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { key: "similaritySearch", label: "Similarity Search" },
                { key: "hybridSearch", label: "Hybrid Search" },
                { key: "filtering", label: "Metadata Filtering" },
                { key: "pagination", label: "Pagination" },
                { key: "batchOperations", label: "Batch Operations" },
                { key: "realTimeUpdates", label: "Real-time Updates" },
              ].map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium">
                    <div>
                      <span>{feature.label}</span>
                      {feature.key === "hybridSearch" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Combining vector and keyword search
                        </p>
                      )}
                      {feature.key === "realTimeUpdates" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Immediate index updates
                        </p>
                      )}
                    </div>
                  </TableCell>
                  {databases.map((db, index) => (
                    <TableCell key={`${db.id || `db-${index}`}-${feature.key}`}>
                      {renderFeatureSupport(db.searchCapabilities[feature.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Search Features</CardTitle>
          <CardDescription>Advanced vector search capabilities and optimizations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="features">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="features">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Feature</TableHead>
                    {databases.map((db) => (
                      <TableHead key={db.id}>{db.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { key: "rangeSearch", label: "Range Search" },
                    { key: "multiVectorSearch", label: "Multi-vector Search" },
                    { key: "facetedSearch", label: "Faceted Search" },
                    { key: "aggregations", label: "Aggregations" },
                    { key: "joins", label: "Joins" },
                    { key: "geospatialSearch", label: "Geospatial Search" },
                  ].map((feature) => (
                    <TableRow key={feature.key}>
                      <TableCell className="font-medium">
                        <div>
                          <span>{feature.label}</span>
                          {feature.key === "multiVectorSearch" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Searching with multiple vectors simultaneously
                            </p>
                          )}
                          {feature.key === "facetedSearch" && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Filtering and grouping by multiple attributes
                            </p>
                          )}
                        </div>
                      </TableCell>
                      {databases.map((db) => (
                        <TableCell key={`${db.id}-${feature.key}`}>
                          {renderFeatureSupport(db.searchCapabilities[feature.key])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="performance">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Metric</TableHead>
                    {databases.map((db) => (
                      <TableHead key={db.id}>{db.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { key: "maxVectors", label: "Max Vectors" },
                    { key: "querySpeed", label: "Query Speed" },
                    { key: "scalability", label: "Scalability" },
                    { key: "accuracy", label: "Accuracy" },
                  ].map((metric) => (
                    <TableRow key={metric.key}>
                      <TableCell className="font-medium">{metric.label}</TableCell>
                      {databases.map((db) => (
                        <TableCell key={`${db.id}-${metric.key}`}>
                          {db.searchCapabilities[metric.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function renderFeatureSupport(support: boolean | string) {
  if (support === true) {
    return <Check className="h-5 w-5 text-green-500" />
  } else if (support === false) {
    return <X className="h-5 w-5 text-red-500" />
  } else if (support === "partial") {
    return <AlertTriangle className="h-5 w-5 text-amber-500" />
  } else if (support === "planned") {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Planned
      </Badge>
    )
  } else {
    return <Badge variant="outline">{support}</Badge>
  }
} 
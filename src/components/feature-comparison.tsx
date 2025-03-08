import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { VectorBadge } from "@/components/ui/vector-badge"
import React from "react"

interface FeatureComparisonProps {
  databases: Database[]
}

export default function FeatureComparison({ databases }: FeatureComparisonProps) {
  // Define feature categories
  const featureCategories = [
    {
      name: "Deployment Options",
      features: ["cloudNative", "serverless", "hybridSearch"],
      labels: ["Cloud Native", "Serverless", "Hybrid Search"],
      useSimpleBoolean: true,
    },
    {
      name: "Data Management",
      features: ["metadataFiltering", "batchOperations"],
      labels: ["Metadata Filtering", "Batch Operations"],
      useSimpleBoolean: true,
    },
    {
      name: "Performance Features",
      features: ["scalability", "latency", "throughput"],
      labels: ["Scalability", "Latency", "Throughput"],
      types: ["scalability", "latency", "throughput"],
      useSimpleBoolean: false,
    },
  ]

  return (
    <div className="space-y-8">
      {featureCategories.map((category) => (
        <Card key={category.name} className="overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>Comparing {category.name.toLowerCase()} across vector databases</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow key={`${category.name}-header-row`} className="bg-white dark:bg-slate-900">
                    <TableHead className="w-[200px]">Feature</TableHead>
                    {databases.map((db, index) => (
                      <TableHead key={`db-${index}-${db.name}`}>{db.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.features.map((feature, index) => (
                    <TableRow key={`${category.name}-${feature}-row`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium">{category.labels[index]}</TableCell>
                      {databases.map((db, dbIndex) => (
                        <TableCell key={`db-${dbIndex}-${feature}`} className="text-center">
                          {category.name === "Performance Features" ? (
                            <VectorBadge 
                              value={db.performance && feature in db.performance ? db.performance[feature] : null} 
                              type={category.types ? category.types[index] as any : 'text'} 
                            />
                          ) : (
                            <VectorBadge 
                              value={db.features && feature in db.features ? db.features[feature] : null} 
                              type={typeof db.features?.[feature] === 'boolean' ? 'boolean' : 'text'} 
                              simpleBoolean={category.useSimpleBoolean}
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
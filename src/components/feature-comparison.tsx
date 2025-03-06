import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FeatureComparisonProps {
  databases: Database[]
}

export default function FeatureComparison({ databases }: FeatureComparisonProps) {
  // Define feature categories
  const featureCategories = [
    {
      name: "Deployment Options",
      features: ["cloud", "selfHosted", "hybrid", "kubernetes", "docker"],
      labels: ["Cloud", "Self-Hosted", "Hybrid", "Kubernetes", "Docker"],
    },
    {
      name: "Data Management",
      features: ["schemaSupport", "jsonSupport", "binaryVectors", "multiTenancy", "versioning"],
      labels: ["Schema Support", "JSON Support", "Binary Vectors", "Multi-Tenancy", "Versioning"],
    },
    {
      name: "Scaling & Performance",
      features: ["horizontalScaling", "verticalScaling", "sharding", "replication", "caching"],
      labels: ["Horizontal Scaling", "Vertical Scaling", "Sharding", "Replication", "Caching"],
    },
  ]

  return (
    <div className="space-y-8">
      {featureCategories.map((category) => (
        <Card key={category.name}>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>Comparing {category.name.toLowerCase()} across vector databases</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {databases.map((db) => (
                    <TableHead key={db.id}>{db.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.features.map((feature, index) => (
                  <TableRow key={feature}>
                    <TableCell className="font-medium">{category.labels[index]}</TableCell>
                    {databases.map((db) => (
                      <TableCell key={`${db.id}-${feature}`}>
                        {db.features[feature] === true ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : db.features[feature] === false ? (
                          <X className="h-5 w-5 text-red-500" />
                        ) : (
                          <Badge variant="outline">{db.features[feature]}</Badge>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, AlertTriangle, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SecurityComparisonProps {
  databases: Database[]
}

export default function SecurityComparison({ databases }: SecurityComparisonProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>Core security features and capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow key="security-features-header">
                <TableHead className="w-[250px]">Feature</TableHead>
                {databases.map((db) => (
                  <TableHead key={db.id || `db-${db.name}`}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { key: "authentication", label: "Authentication" },
                { key: "encryption", label: "Encryption" },
                { key: "access_control", label: "Access Control" },
                { key: "audit_logging", label: "Audit Logging" },
                { key: "encrypted_at_rest", label: "Encrypted at Rest" },
                { key: "encrypted_in_transit", label: "Encrypted in Transit" },
                { key: "multitenancy", label: "Multitenancy" },
              ].map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium">
                    <div>
                      <span>{feature.label}</span>
                      {feature.key === "multitenancy" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Support for multiple tenants
                        </p>
                      )}
                    </div>
                  </TableCell>
                  {databases.map((db, index) => (
                    <TableCell key={`${db.id || `db-${index}`}-${feature.key}`}>
                      {renderFeatureSupport(db.security[feature.key])}
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
          <CardTitle>Compliance & Certifications</CardTitle>
          <CardDescription>Industry compliance standards and certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow key="compliance-header">
                <TableHead className="w-[250px]">Standard</TableHead>
                {databases.map((db) => (
                  <TableHead key={db.id || `db-${db.name}`}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { key: "soc2_compliance", label: "SOC 2" },
                { key: "gdpr_compliance", label: "GDPR" },
              ].map((cert) => (
                <TableRow key={cert.key}>
                  <TableCell className="font-medium">
                    <div>
                      <span>{cert.label}</span>
                      {cert.key === "gdpr_compliance" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          General Data Protection Regulation
                        </p>
                      )}
                    </div>
                  </TableCell>
                  {databases.map((db, index) => (
                    <TableCell key={`${db.id || `db-${index}`}-${cert.key}`}>
                      {renderComplianceStatus(db.security[cert.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {databases.map((db) => (
          <Card key={db.id} className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {db.name}
              </CardTitle>
              <CardDescription>Security Score: {calculateSecurityScore(db.security)}/10</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(db.security)
                  .filter(([key]) => key !== "soc2_compliance" && key !== "gdpr_compliance")
                  .map(([key, value]) => (
                    <li key={key} className="flex items-start">
                      {value === true ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      ) : value === false ? (
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      )}
                      <span>{formatFeatureName(key)}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function renderFeatureSupport(support: boolean | string | undefined) {
  if (support === undefined) {
    return <X className="h-5 w-5 text-gray-300" />
  } else if (support === true) {
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

function renderComplianceStatus(status: boolean | string | undefined) {
  if (status === undefined) {
    return <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">Not Specified</Badge>
  } else if (status === true) {
    return <Badge className="bg-green-50 text-green-700 border-green-200">Certified</Badge>
  } else if (status === false) {
    return <Badge variant="destructive">Not Certified</Badge>
  } else if (status === "Unknown") {
    return <Badge variant="outline">Unknown</Badge>
  } else {
    return <Badge variant="outline">{status}</Badge>
  }
}

function calculateSecurityScore(security: Record<string, boolean | string | undefined>): number {
  if (!security) return 0;
  
  const features = Object.entries(security).filter(
    ([key]) => key !== "soc2_compliance" && key !== "gdpr_compliance"
  )
  const totalFeatures = features.length
  if (totalFeatures === 0) return 0;
  
  const supportedFeatures = features.filter(([_, value]) => value === true).length
  return Math.round((supportedFeatures / totalFeatures) * 10)
}

function formatFeatureName(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
} 
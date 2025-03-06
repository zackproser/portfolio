import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface CompanyMetricsProps {
  databases: Database[]
}

export default function CompanyMetrics({ databases }: CompanyMetricsProps) {
  // Prepare data for funding chart
  const fundingData = databases.map((db) => ({
    name: db.name,
    funding: parseFloat(db.company.funding.replace(/[^0-9.-]+/g, "")),
  }))

  // Prepare data for employee count chart
  const employeeData = databases.map((db) => ({
    name: db.name,
    employees: db.company.employees,
  }))

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Company Overview</CardTitle>
          <CardDescription>Key information about the companies behind these vector databases</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Database</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Founded</TableHead>
                <TableHead>Funding</TableHead>
                <TableHead>Employees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databases.map((db) => (
                <TableRow key={db.id}>
                  <TableCell className="font-medium">{db.name}</TableCell>
                  <TableCell>{db.company.name}</TableCell>
                  <TableCell>{db.company.founded}</TableCell>
                  <TableCell>{db.company.funding}</TableCell>
                  <TableCell>{db.company.employees}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Funding</CardTitle>
            <CardDescription>Total funding raised in millions USD</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`$${value}M`, "Funding"]} />
                <Bar dataKey="funding" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Count</CardTitle>
            <CardDescription>Approximate number of employees</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="employees" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
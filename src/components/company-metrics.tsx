import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Building2, Users, Calendar, DollarSign } from "lucide-react"

interface CompanyMetricsProps {
  databases: Database[]
}

function formatFundingForChart(funding: string): number {
  if (!funding || funding === "Not disclosed") return 0;
  const match = funding.match(/\$?(\d+(?:\.\d+)?)[MBK]?/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  if (funding.includes('B')) return value * 1000;
  if (funding.includes('K')) return value / 1000;
  return value; // Already in millions
}

function formatEmployeeCount(count: number | string): string {
  if (typeof count === 'number') {
    if (count === 0) return 'Not disclosed';
    return count.toString();
  }
  return count;
}

export default function CompanyMetrics({ databases }: CompanyMetricsProps) {
  if (!databases?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Please select some databases to compare.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Prepare data for funding chart
  const fundingData = databases
    .filter(db => db?.company) // Filter out any databases without company info
    .map((db) => ({
      name: db.name,
      funding: formatFundingForChart(db.company.funding || "Not disclosed"),
    }))
    .sort((a, b) => b.funding - a.funding);

  // Prepare data for employee count chart
  const employeeData = databases
    .filter(db => db?.company) // Filter out any databases without company info
    .map((db) => ({
      name: db.name,
      employees: db.company.employees || 0,
    }))
    .sort((a, b) => b.employees - a.employees);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Overview
          </CardTitle>
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
              {databases.map((db, index) => (
                <TableRow key={`${db.id || db.name}-${index}`}>
                  <TableCell className="font-medium">{db.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {db.company?.name || db.name}
                      {db.business_info?.headquarters && (
                        <Badge variant="outline" className="text-xs">
                          {db.business_info.headquarters}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {db.company?.founded ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {db.company.founded}
                      </div>
                    ) : (
                      "Not disclosed"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {db.company?.funding || "Not disclosed"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {formatEmployeeCount(db.company?.employees || 0)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {fundingData.length > 0 && employeeData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Funding
              </CardTitle>
              <CardDescription>Total funding raised in millions USD</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundingData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value) => [`$${value}M`, "Funding"]}
                    cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                  />
                  <Bar 
                    dataKey="funding" 
                    fill="#8884d8"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Count
              </CardTitle>
              <CardDescription>Approximate number of employees</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(130, 202, 157, 0.1)' }}
                  />
                  <Bar 
                    dataKey="employees" 
                    fill="#82ca9d"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Mail, BarChart3, Settings } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="mb-8 text-white">
        <h1 className="text-5xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-xl opacity-80">Manage your website content and settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card/60 backdrop-blur-sm border-purple-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Newsletter
            </CardTitle>
            <CardDescription>Manage your newsletter campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Create, schedule, and analyze your newsletter campaigns.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/newsletter">
                Manage Newsletters
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-card/60 backdrop-blur-sm border-purple-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>View performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Track views, clicks, and conversions across your website.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/analytics">
                View Analytics
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-card/60 backdrop-blur-sm border-purple-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>Manage website settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Update site configuration and preferences.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/settings">
                Edit Settings
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 
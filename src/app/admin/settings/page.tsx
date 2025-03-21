import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-12 text-white">
        <h1 className="text-5xl font-bold mb-4">Admin Settings</h1>
        <p className="text-xl opacity-80">Configure your website preferences</p>
      </div>
      
      <Tabs defaultValue="newsletter" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="newsletter">
          <Card className="bg-card/60 backdrop-blur-sm border-purple-600/20">
            <CardHeader>
              <CardTitle>Newsletter Settings</CardTitle>
              <CardDescription>Configure your newsletter preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Email Octopus API Key</Label>
                <Input id="api-key" type="password" placeholder="Enter your API key" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="list-id">Default List ID</Label>
                <Input id="list-id" placeholder="Enter your default list ID" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" type="email" placeholder="newsletter@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" placeholder="Your Name" />
              </div>
              
              <Button className="w-full mt-4">Save Newsletter Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="website">
          <Card className="bg-card/60 backdrop-blur-sm border-purple-600/20">
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Configure general website settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Website settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="bg-card/60 backdrop-blur-sm border-purple-600/20">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Account settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
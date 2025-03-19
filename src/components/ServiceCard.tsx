import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

export default function ServiceCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <Card className="bg-orange-950/30 backdrop-blur-sm border-orange-600/20 hover:border-orange-500/40 transition-all duration-300 h-full">
      <CardHeader>
        <div className="bg-orange-600/20 p-3 rounded-lg w-fit mb-4 text-orange-400">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
} 
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
    <Card className="bg-blue-700 backdrop-blur-sm border-blue-600/20 hover:border-blue-500/40 transition-all duration-300 h-full">
      <CardHeader>
        <div className="bg-orange-500/20 p-3 rounded-lg w-fit mb-4 text-orange-400">{icon}</div>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white/80">{description}</p>
      </CardContent>
    </Card>
  )
} 
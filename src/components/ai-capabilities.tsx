import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

interface AICapabilitiesProps {
  databases: Database[]
}

export default function AICapabilities({ databases }: AICapabilitiesProps) {
  // Prepare data for radar chart
  const radarData = [
    {
      feature: "LLM Integration",
      ...databases.reduce((acc, db) => ({ ...acc, [db.name]: db.aiCapabilities.scores.llmIntegration }), {}),
    },
    {
      feature: "Embedding Generation",
      ...databases.reduce((acc, db) => ({ ...acc, [db.name]: db.aiCapabilities.scores.embeddingGeneration }), {}),
    },
    {
      feature: "RAG Support",
      ...databases.reduce((acc, db) => ({ ...acc, [db.name]: db.aiCapabilities.scores.ragSupport }), {}),
    },
    {
      feature: "Fine-tuning",
      ...databases.reduce((acc, db) => ({ ...acc, [db.name]: db.aiCapabilities.scores.fineTuning }), {}),
    },
    {
      feature: "Model Hosting",
      ...databases.reduce((acc, db) => ({ ...acc, [db.name]: db.aiCapabilities.scores.modelHosting }), {}),
    },
  ]

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Integration Features</CardTitle>
          <CardDescription>Comparing AI and LLM integration capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow key="ai-integration-header">
                <TableHead className="w-[250px]">Feature</TableHead>
                {databases.map((db, index) => (
                  <TableHead key={db.id || `db-${index}`}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { key: "embeddingGeneration", label: "Built-in Embedding Generation" },
                { key: "llmIntegration", label: "LLM Integration" },
                { key: "ragSupport", label: "RAG Support" },
                { key: "semanticCaching", label: "Semantic Caching" },
                { key: "modelHosting", label: "Model Hosting" },
                { key: "fineTuning", label: "Fine-tuning Support" },
              ].map((feature) => (
                <TableRow key={feature.key}>
                  <TableCell className="font-medium">
                    <div>
                      <span>{feature.label}</span>
                      {feature.key === "ragSupport" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Retrieval-Augmented Generation capabilities
                        </p>
                      )}
                      {feature.key === "semanticCaching" && (
                        <p className="text-xs text-muted-foreground mt-1">Caching based on semantic similarity</p>
                      )}
                    </div>
                  </TableCell>
                  {databases.map((db, index) => (
                    <TableCell key={`${db.id || `db-${index}`}-${feature.key}`}>
                      {renderFeatureSupport(db.aiCapabilities.features[feature.key])}
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
          <CardTitle>AI Capabilities Comparison</CardTitle>
          <CardDescription>Radar chart comparing AI capabilities across databases</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={150} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="feature" />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              {databases.map((db, index) => (
                <Radar
                  key={db.id}
                  name={db.name}
                  dataKey={db.name}
                  stroke={getColorByIndex(index)}
                  fill={getColorByIndex(index)}
                  fillOpacity={0.6}
                />
              ))}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported AI Models & Frameworks</CardTitle>
          <CardDescription>AI models and frameworks supported by each database</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow key="llm-integration-header">
                <TableHead className="w-[250px]">Feature</TableHead>
                {databases.map((db, index) => (
                  <TableHead key={db.id || `db-${index}`}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { key: "openai", label: "OpenAI (GPT)" },
                { key: "huggingface", label: "Hugging Face" },
                { key: "pytorch", label: "PyTorch" },
                { key: "tensorflow", label: "TensorFlow" },
                { key: "langchain", label: "LangChain" },
                { key: "llamaindex", label: "LlamaIndex" },
              ].map((model) => (
                <TableRow key={model.key}>
                  <TableCell className="font-medium">{model.label}</TableCell>
                  {databases.map((db, index) => (
                    <TableCell key={`${db.id || `db-${index}`}-${model.key}`}>
                      {renderFeatureSupport(db.aiCapabilities.supportedModels[model.key])}
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
          <CardTitle>RAG Capabilities</CardTitle>
          <CardDescription>Retrieval-Augmented Generation features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {databases.map((db) => (
              <Card key={db.id} className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{db.name}</CardTitle>
                  <CardDescription>RAG Score: {db.aiCapabilities.scores.ragSupport}/10</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {db.aiCapabilities.ragFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {db.aiCapabilities.ragLimitations.map((limitation, index) => (
                      <li key={`limit-${index}`} className="flex items-start text-muted-foreground">
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
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

function getColorByIndex(index: number) {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
  ]
  return colors[index % colors.length]
} 
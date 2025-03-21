"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  LineChart,
  PieChart,
  Calendar,
  MousePointer,
  UserMinus,
  TrendingUp,
  TrendingDown,
  Mail,
  Clock,
} from "lucide-react"

// Mock data for demonstration
const mockEpisodes = [
  {
    id: "1",
    subject: "Latest Web Development Trends - March 2025",
    dateCreated: "2025-03-15T10:30:00Z",
    dateSent: "2025-03-16T09:00:00Z",
    stats: {
      opens: 1250,
      clicks: 432,
      unsubscribes: 5,
      openRate: 62.5,
      clickRate: 21.6,
      clickToOpenRate: 34.6,
      dailyStats: [
        { date: "2025-03-16", opens: 850, clicks: 320, unsubscribes: 2 },
        { date: "2025-03-17", opens: 250, clicks: 80, unsubscribes: 1 },
        { date: "2025-03-18", opens: 100, clicks: 25, unsubscribes: 1 },
        { date: "2025-03-19", opens: 50, clicks: 7, unsubscribes: 1 },
      ],
      linkPerformance: [
        { title: "The Future of React in 2025", clicks: 210, ctr: 16.8 },
        { title: "CSS Container Queries: A Complete Guide", clicks: 145, ctr: 11.6 },
        { title: "Building Performant Web Apps", clicks: 77, ctr: 6.2 },
      ],
      deviceStats: {
        desktop: 65,
        mobile: 30,
        tablet: 5,
      },
      timeOfDay: {
        morning: 45,
        afternoon: 30,
        evening: 20,
        night: 5,
      },
    },
  },
  {
    id: "2",
    subject: "AI Tools for Developers - February 2025",
    dateCreated: "2025-02-20T14:15:00Z",
    dateSent: "2025-02-22T09:00:00Z",
    stats: {
      opens: 1420,
      clicks: 567,
      unsubscribes: 3,
      openRate: 71.0,
      clickRate: 28.4,
      clickToOpenRate: 39.9,
      dailyStats: [
        { date: "2025-02-22", opens: 980, clicks: 410, unsubscribes: 1 },
        { date: "2025-02-23", opens: 320, clicks: 120, unsubscribes: 1 },
        { date: "2025-02-24", opens: 90, clicks: 30, unsubscribes: 1 },
        { date: "2025-02-25", opens: 30, clicks: 7, unsubscribes: 0 },
      ],
      linkPerformance: [
        { title: "Top 10 AI Coding Assistants", clicks: 280, ctr: 19.7 },
        { title: "How to Use GPT-5 for Code Generation", clicks: 210, ctr: 14.8 },
        { title: "AI-Powered Testing Tools", clicks: 77, ctr: 5.4 },
      ],
      deviceStats: {
        desktop: 60,
        mobile: 35,
        tablet: 5,
      },
      timeOfDay: {
        morning: 40,
        afternoon: 35,
        evening: 20,
        night: 5,
      },
    },
  },
  {
    id: "3",
    subject: "DevOps Best Practices - January 2025",
    dateCreated: "2025-01-10T11:45:00Z",
    dateSent: "2025-01-12T09:00:00Z",
    stats: {
      opens: 1150,
      clicks: 389,
      unsubscribes: 7,
      openRate: 57.5,
      clickRate: 19.5,
      clickToOpenRate: 33.8,
      dailyStats: [
        { date: "2025-01-12", opens: 750, clicks: 280, unsubscribes: 3 },
        { date: "2025-01-13", opens: 280, clicks: 85, unsubscribes: 2 },
        { date: "2025-01-14", opens: 90, clicks: 20, unsubscribes: 1 },
        { date: "2025-01-15", opens: 30, clicks: 4, unsubscribes: 1 },
      ],
      linkPerformance: [
        { title: "Containerization Strategies for 2025", clicks: 180, ctr: 15.7 },
        { title: "GitHub Actions vs. Jenkins: A Comparison", clicks: 130, ctr: 11.3 },
        { title: "Kubernetes Best Practices", clicks: 79, ctr: 6.9 },
      ],
      deviceStats: {
        desktop: 70,
        mobile: 25,
        tablet: 5,
      },
      timeOfDay: {
        morning: 50,
        afternoon: 25,
        evening: 20,
        night: 5,
      },
    },
  },
]

export function NewsletterAnalytics() {
  const searchParams = useSearchParams()
  const episodeId = searchParams.get("id")
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(episodeId || mockEpisodes[0].id)
  const [activeTab, setActiveTab] = useState("overview")

  const selectedEpisode = mockEpisodes.find((ep) => ep.id === selectedEpisodeId) || mockEpisodes[0]
  const stats = selectedEpisode.stats

  // Calculate trends (comparing to average of previous episodes)
  const calculateTrend = (metric: string) => {
    const currentValue = selectedEpisode.stats[metric as keyof typeof selectedEpisode.stats] as number
    const otherEpisodes = mockEpisodes.filter((ep) => ep.id !== selectedEpisodeId)
    const avgValue =
      otherEpisodes.reduce((sum, ep) => sum + (ep.stats[metric as keyof typeof ep.stats] as number), 0) /
      otherEpisodes.length

    return {
      value: currentValue,
      change: ((currentValue - avgValue) / avgValue) * 100,
      positive: currentValue >= avgValue,
    }
  }

  const opensTrend = calculateTrend("openRate")
  const clicksTrend = calculateTrend("clickRate")
  const unsubscribesTrend = calculateTrend("unsubscribes")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">{selectedEpisode.subject}</h2>

        <Select value={selectedEpisodeId} onValueChange={setSelectedEpisodeId}>
          <SelectTrigger className="w-full md:w-[300px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select an episode" />
          </SelectTrigger>
          <SelectContent className="bg-blue-900 border-blue-700 text-white">
            {mockEpisodes.map((episode) => (
              <SelectItem key={episode.id} value={episode.id} className="focus:bg-blue-800 focus:text-white">
                {episode.subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center text-sm text-blue-300 space-x-4">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Sent: {new Date(selectedEpisode.dateSent).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{new Date(selectedEpisode.dateSent).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-300 text-sm">Open Rate</p>
                <p className="text-3xl font-bold">{stats.openRate}%</p>
              </div>
              <div className={`flex items-center ${opensTrend.positive ? "text-green-400" : "text-red-400"}`}>
                {opensTrend.positive ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                <span>{Math.abs(opensTrend.change).toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-blue-300">
              <Mail className="h-4 w-4 mr-1" />
              <span>{stats.opens} total opens</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-300 text-sm">Click Rate</p>
                <p className="text-3xl font-bold">{stats.clickRate}%</p>
              </div>
              <div className={`flex items-center ${clicksTrend.positive ? "text-green-400" : "text-red-400"}`}>
                {clicksTrend.positive ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                <span>{Math.abs(clicksTrend.change).toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-blue-300">
              <MousePointer className="h-4 w-4 mr-1" />
              <span>{stats.clicks} total clicks</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-300 text-sm">Unsubscribes</p>
                <p className="text-3xl font-bold">{stats.unsubscribes}</p>
              </div>
              <div className={`flex items-center ${!unsubscribesTrend.positive ? "text-green-400" : "text-red-400"}`}>
                {!unsubscribesTrend.positive ? (
                  <TrendingDown className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingUp className="h-5 w-5 mr-1" />
                )}
                <span>{Math.abs(unsubscribesTrend.change).toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-blue-300">
              <UserMinus className="h-4 w-4 mr-1" />
              <span>{((stats.unsubscribes / (stats.opens / stats.openRate)) * 100).toFixed(2)}% unsubscribe rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
      >
        <TabsList className="bg-white/20 m-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-blue-600 text-white">
            Link Performance
          </TabsTrigger>
          <TabsTrigger value="audience" className="data-[state=active]:bg-blue-600 text-white">
            Audience Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-4 space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Engagement Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-blue-300">
                  [Interactive chart showing opens, clicks, and unsubscribes over time would be displayed here]
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {stats.dailyStats.map((day, index) => (
                  <Card key={index} className="bg-blue-800/50 border-blue-700">
                    <CardContent className="p-4">
                      <p className="text-sm text-blue-300 mb-2">{new Date(day.date).toLocaleDateString()}</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-blue-300">Opens</p>
                          <p className="font-bold">{day.opens}</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-300">Clicks</p>
                          <p className="font-bold">{day.clicks}</p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-300">Unsubs</p>
                          <p className="font-bold">{day.unsubscribes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="p-4 space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Link Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.linkPerformance.map((link, index) => (
                  <div key={index} className="border border-blue-700 rounded-md p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h4 className="font-medium text-white">{link.title}</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-xs text-blue-300">Clicks</p>
                          <p className="font-bold">{link.clicks}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-blue-300">CTR</p>
                          <p className="font-bold">{link.ctr}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-blue-900 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${link.ctr * 3}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center">
                  <p className="text-blue-300">[Pie chart showing device breakdown would be displayed here]</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div>
                    <p className="text-sm text-blue-300">Desktop</p>
                    <p className="font-bold text-lg">{stats.deviceStats.desktop}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Mobile</p>
                    <p className="font-bold text-lg">{stats.deviceStats.mobile}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Tablet</p>
                    <p className="font-bold text-lg">{stats.deviceStats.tablet}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time of Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center">
                  <p className="text-blue-300">[Bar chart showing time of day engagement would be displayed here]</p>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                  <div>
                    <p className="text-sm text-blue-300">Morning</p>
                    <p className="font-bold text-lg">{stats.timeOfDay.morning}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Afternoon</p>
                    <p className="font-bold text-lg">{stats.timeOfDay.afternoon}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Evening</p>
                    <p className="font-bold text-lg">{stats.timeOfDay.evening}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Night</p>
                    <p className="font-bold text-lg">{stats.timeOfDay.night}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


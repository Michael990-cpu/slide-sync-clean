"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Heart, Share2, Download, TrendingUp, Users, Clock, Star } from "lucide-react"

interface AnalyticsData {
  totalViews: number
  totalLikes: number
  totalShares: number
  totalDownloads: number
  engagementRate: number
  averageWatchTime: number
  topPerformingSlideshow: string
  recentActivity: any[]
  platformBreakdown: any[]
  audienceInsights: any
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        totalViews: 12847,
        totalLikes: 1923,
        totalShares: 456,
        totalDownloads: 234,
        engagementRate: 78.5,
        averageWatchTime: 8.3,
        topPerformingSlideshow: "Fitness Transformation Journey",
        recentActivity: [
          { type: "view", slideshow: "Beauty Makeover", time: "2 minutes ago", platform: "Instagram" },
          { type: "share", slideshow: "Home Renovation", time: "5 minutes ago", platform: "Facebook" },
          { type: "like", slideshow: "Fitness Journey", time: "8 minutes ago", platform: "TikTok" },
          { type: "download", slideshow: "Recipe Creation", time: "12 minutes ago", platform: "Direct" },
        ],
        platformBreakdown: [
          { platform: "Instagram", views: 5234, percentage: 40.7 },
          { platform: "TikTok", views: 3891, percentage: 30.3 },
          { platform: "Facebook", views: 2456, percentage: 19.1 },
          { platform: "Twitter", views: 1266, percentage: 9.9 },
        ],
        audienceInsights: {
          topCountries: ["United States", "United Kingdom", "Canada", "Australia"],
          ageGroups: [
            { range: "18-24", percentage: 35 },
            { range: "25-34", percentage: 42 },
            { range: "35-44", percentage: 18 },
            { range: "45+", percentage: 5 },
          ],
          peakHours: ["7-9 PM", "12-2 PM", "8-10 AM"],
        },
      })
      setLoading(false)
    }, 1500)
  }, [timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your slideshow performance and audience engagement</p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7 days</TabsTrigger>
            <TabsTrigger value="30d">30 days</TabsTrigger>
            <TabsTrigger value="90d">90 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Likes</p>
                <p className="text-2xl font-bold">{analyticsData.totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shares</p>
                <p className="text-2xl font-bold">{analyticsData.totalShares.toLocaleString()}</p>
              </div>
              <Share2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15.7%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">{analyticsData.totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+22.1%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Engagement Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Engagement Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Engagement Rate</span>
                <span className="font-medium">{analyticsData.engagementRate}%</span>
              </div>
              <Progress value={analyticsData.engagementRate} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Average Watch Time</span>
                <span className="font-medium">{analyticsData.averageWatchTime}s</span>
              </div>
              <Progress value={(analyticsData.averageWatchTime / 15) * 100} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Top Performing Slideshow</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">#1</Badge>
                <span className="text-sm">{analyticsData.topPerformingSlideshow}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Platform Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.platformBreakdown.map((platform, index) => (
                <div key={platform.platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-purple-500"
                          : index === 1
                            ? "bg-black"
                            : index === 2
                              ? "bg-blue-500"
                              : "bg-blue-400"
                      }`}
                    />
                    <span className="text-sm font-medium">{platform.platform}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{platform.views.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{platform.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "view"
                        ? "bg-blue-500"
                        : activity.type === "share"
                          ? "bg-green-500"
                          : activity.type === "like"
                            ? "bg-red-500"
                            : "bg-purple-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {activity.type === "view"
                        ? "Viewed"
                        : activity.type === "share"
                          ? "Shared"
                          : activity.type === "like"
                            ? "Liked"
                            : "Downloaded"}{" "}
                      "{activity.slideshow}"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time} • {activity.platform}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.platform}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

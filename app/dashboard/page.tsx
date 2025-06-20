"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Edit, Trash2, Crown, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { Slideshow } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [slideshows, setSlideshows] = useState<Slideshow[]>([])
  const [loadingSlideshows, setLoadingSlideshows] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchSlideshows()
    } else if (!loading) {
      setLoadingSlideshows(false)
    }
  }, [user, loading])

  const fetchSlideshows = async () => {
    if (!user) return

    try {
      setError(null)
      console.log("Fetching slideshows for user:", user.id)

      const { data, error: fetchError } = await supabase
        .from("slideshows")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (fetchError) {
        console.error("Supabase error:", fetchError)
        setError(`Database error: ${fetchError.message}`)

        toast({
          title: "Error loading slideshows",
          description: "Please make sure your database is set up correctly.",
          variant: "destructive",
        })
      } else {
        console.log("Fetched slideshows:", data)
        setSlideshows(data || [])

        // Show success message if we just refreshed
        if (refreshing) {
          toast({
            title: "Refreshed successfully",
            description: `Found ${data?.length || 0} slideshows.`,
          })
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setError("Failed to load slideshows")
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading your slideshows.",
        variant: "destructive",
      })
    } finally {
      setLoadingSlideshows(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setLoadingSlideshows(true)
    await fetchSlideshows()
  }

  const deleteSlideshow = async (id: string) => {
    try {
      const { error } = await supabase.from("slideshows").delete().eq("id", id)

      if (error) {
        console.error("Error deleting slideshow:", error)
        toast({
          title: "Error",
          description: "Failed to delete slideshow.",
          variant: "destructive",
        })
      } else {
        setSlideshows(slideshows.filter((s) => s.id !== id))
        toast({
          title: "Slideshow deleted",
          description: "Your slideshow has been deleted successfully.",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  // Create a test slideshow for demonstration
  const createTestSlideshow = async () => {
    if (!user) return

    try {
      const testSlideshow = {
        user_id: user.id,
        title: "Test Slideshow",
        description: "This is a test slideshow created from the dashboard",
        images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
        transition: "fade",
        text_overlays: [],
        music: null,
        settings: { exportFormat: "720p" },
      }

      const { data, error } = await supabase.from("slideshows").insert([testSlideshow]).select().single()

      if (error) {
        console.error("Error creating test slideshow:", error)
        toast({
          title: "Error",
          description: "Failed to create test slideshow.",
          variant: "destructive",
        })
      } else {
        setSlideshows([data, ...slideshows])
        toast({
          title: "Test slideshow created!",
          description: "A test slideshow has been added to your dashboard.",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center">
              S
            </div>
            <span>SlideSync</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.user_metadata?.full_name || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Link href="/premium">
              <Button variant="outline" size="sm">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Slideshows</h1>
            <p className="text-muted-foreground">Create and manage your before & after slideshows</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={createTestSlideshow}>
              <Plus className="mr-2 h-4 w-4" />
              Add Test Slideshow
            </Button>
            <Link href="/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Slideshow
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <h3 className="font-medium text-destructive">Database Error</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please make sure you've run the database setup SQL in your Supabase dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Debug Info</h3>
            <div className="text-sm space-y-1">
              <p>User ID: {user?.id}</p>
              <p>Slideshows count: {slideshows.length}</p>
              <p>Loading: {loadingSlideshows ? "Yes" : "No"}</p>
              <p>Error: {error || "None"}</p>
            </div>
          </CardContent>
        </Card>

        {loadingSlideshows ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : slideshows.length === 0 && !error ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No slideshows yet</h3>
              <p className="text-muted-foreground mb-6">Create your first before & after slideshow to get started</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={createTestSlideshow} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test Slideshow
                </Button>
                <Link href="/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Slideshow
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {slideshows.map((slideshow) => (
              <Card key={slideshow.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                    {slideshow.images && slideshow.images.length > 0 ? (
                      <img
                        src={slideshow.images[0] || "/placeholder.svg"}
                        alt="Slideshow preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                    ) : (
                      <span className="text-muted-foreground">No images</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{slideshow.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{slideshow.description || "No description"}</p>
                    <div className="text-xs text-muted-foreground mb-4">
                      {slideshow.images?.length || 0} images • {slideshow.transition} transition
                      {slideshow.music && " • With music"}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link href={`/create?id=${slideshow.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this slideshow?")) {
                            deleteSlideshow(slideshow.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

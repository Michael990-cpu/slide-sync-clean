"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Instagram, Facebook, Twitter, Copy, Download, CheckCircle, Share2, LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SocialShareProps {
  videoUrl?: string
  title: string
  description?: string
  hashtags?: string[]
}

export function SocialShare({ videoUrl, title, description, hashtags = [] }: SocialShareProps) {
  const [shareText, setShareText] = useState(`Check out my amazing before & after slideshow: ${title}`)
  const [customHashtags, setCustomHashtags] = useState(
    hashtags.join(" ") || "#BeforeAndAfter #Transformation #SlideSync",
  )
  const [copying, setCopying] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  // Get current page URL for sharing
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href
    }
    return ""
  }

  const downloadVideo = async () => {
    if (!videoUrl) {
      toast({
        title: "No video to download",
        description: "Please export your slideshow first.",
        variant: "destructive",
      })
      return
    }

    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + Math.random() * 15 + 5 // More realistic progress
        })
      }, 300)

      // Create a proper download
      const response = await fetch(videoUrl)
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_slideshow.mp4`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      window.URL.revokeObjectURL(url)

      setTimeout(() => {
        setIsDownloading(false)
        setDownloadProgress(0)
        toast({
          title: "Download completed! 📥",
          description: "Your slideshow video has been saved to your Downloads/Pictures folder.",
        })
      }, 2000)
    } catch (error) {
      setIsDownloading(false)
      setDownloadProgress(0)
      toast({
        title: "Download failed",
        description: "There was an error downloading your video.",
        variant: "destructive",
      })
    }
  }

  // Native Web Share API
  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: getCurrentUrl(),
        })
        toast({
          title: "Shared successfully!",
          description: "Content shared via native sharing.",
        })
      } catch (error) {
        if (error.name !== "AbortError") {
          toast({
            title: "Sharing failed",
            description: "Please try one of the platform-specific options below.",
            variant: "destructive",
          })
        }
      }
    } else {
      toast({
        title: "Web Share not supported",
        description: "Use the platform-specific buttons below.",
        variant: "destructive",
      })
    }
  }

  // Generate QR code for the current URL
  const generateQRCode = () => {
    const url = getCurrentUrl()
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  }

  const copyShareLink = async () => {
    setCopying(true)
    try {
      await navigator.clipboard.writeText(`${shareText} ${getCurrentUrl()} ${customHashtags}`)
      toast({
        title: "Copied to clipboard!",
        description: "Share message and link copied successfully.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy share message and link.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setCopying(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Share Your Slideshow</h3>
        <p className="text-muted-foreground text-sm">
          Share your amazing before & after transformation with the world!
        </p>
      </div>

      {/* Quick Share Button (Mobile) */}
      <div className="md:hidden">
        <Button onClick={shareViaWebShare} className="w-full" size="lg">
          <Share2 className="mr-2 h-4 w-4" />
          Quick Share
        </Button>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platforms">Share Now</TabsTrigger>
          <TabsTrigger value="download">Download</TabsTrigger>
          <TabsTrigger value="link">Copy Link</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Share2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Social Sharing Coming Soon! 🚀</h3>
                  <p className="text-muted-foreground">
                    We're working on direct sharing to Instagram, TikTok, Facebook, and more platforms.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span className="text-sm">Instagram</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="h-4 w-4 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">
                      T
                    </div>
                    <span className="text-sm">TikTok</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Facebook</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Twitter</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  For now, download your video and share it manually on your favorite platforms!
                </p>
                <Button onClick={downloadVideo} disabled={isDownloading || !videoUrl} className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? `Downloading... ${downloadProgress}%` : "Download Video to Share"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Download Your Video</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Download your slideshow to share on any platform or save for later
              </p>

              {isDownloading && (
                <div className="mb-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{downloadProgress}% complete</p>
                </div>
              )}

              <Button onClick={downloadVideo} disabled={isDownloading || !videoUrl} size="lg" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? `Downloading... ${downloadProgress}%` : "Download Video (MP4)"}
              </Button>

              {!videoUrl && (
                <p className="text-xs text-muted-foreground mt-2">Export your slideshow first to enable download</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <LinkIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">Share Link</h3>
                  <p className="text-muted-foreground text-sm">Copy link and message to share anywhere</p>
                </div>

                <div className="space-y-3">
                  <Label>Share Message:</Label>
                  <Textarea
                    value={shareText}
                    onChange={(e) => setShareText(e.target.value)}
                    placeholder="Enter your share message..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Hashtags:</Label>
                  <Input
                    value={customHashtags}
                    onChange={(e) => setCustomHashtags(e.target.value)}
                    placeholder="#BeforeAndAfter #Transformation"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyShareLink} disabled={copying} className="flex-1">
                    {copying ? <CheckCircle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copying ? "Copied!" : "Copy Message & Link"}
                  </Button>
                  <Button onClick={shareViaWebShare} variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* QR Code */}
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Or scan QR code to share:</p>
                  <img
                    src={generateQRCode() || "/placeholder.svg"}
                    alt="QR Code"
                    className="mx-auto border rounded-lg"
                    width={150}
                    height={150}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

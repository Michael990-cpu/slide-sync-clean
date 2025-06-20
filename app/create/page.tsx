"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Upload, Music, Type, Eye, Share2, Wand2 } from "lucide-react"
import Link from "next/link"
import { ImageUploader } from "@/components/image-uploader"
import { TransitionSelector } from "@/components/transition-selector"
import { TextEditor } from "@/components/text-editor"
import { MusicSelector } from "@/components/music-selector"
import { SlidePreview } from "@/components/slide-preview"
import { ExportOptions } from "@/components/export-options"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { createSlideshow, updateSlideshow } from "@/lib/slideshow-service"
import { useSearchParams } from "next/navigation"
import { AutoEnhance } from "@/components/auto-enhance"
import { SmartSuggestions } from "@/components/smart-suggestions"

export default function CreatePage() {
  const [activeStep, setActiveStep] = useState("upload")
  const [images, setImages] = useState<File[]>([])
  const [transition, setTransition] = useState("fade")
  const [textOverlays, setTextOverlays] = useState<any[]>([])
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [exportFormat, setExportFormat] = useState("720p")
  const { toast } = useToast()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const slideshowId = searchParams.get("id")
  const [slideshowTitle, setSlideshowTitle] = useState("My Slideshow")
  const [saving, setSaving] = useState(false)
  const [enhancements, setEnhancements] = useState<any>(null)

  const steps = [
    { id: "upload", label: "Upload", icon: <Upload className="h-4 w-4" /> },
    { id: "enhance", label: "AI Enhance", icon: <Wand2 className="h-4 w-4" /> },
    { id: "transition", label: "Transition", icon: <ArrowRight className="h-4 w-4" /> },
    { id: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
    { id: "music", label: "Music", icon: <Music className="h-4 w-4" /> },
    { id: "preview", label: "Preview", icon: <Eye className="h-4 w-4" /> },
    { id: "export", label: "Export & Share", icon: <Share2 className="h-4 w-4" /> },
  ]

  const handleNext = () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep)
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep)
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id)
    }
  }

  const handleExport = () => {
    toast({
      title: "Export completed! 🎉",
      description: "Your slideshow is ready to share on social media!",
    })
  }

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your slideshow.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const slideshowData = {
        user_id: user.id,
        title: slideshowTitle,
        description: "Created with SlideSync",
        images: images.map((img) => URL.createObjectURL(img)), // In real app, these would be storage URLs
        transition,
        text_overlays: textOverlays,
        music: selectedMusic,
        settings: { exportFormat },
      }

      if (slideshowId) {
        await updateSlideshow(slideshowId, slideshowData)
        toast({
          title: "Slideshow updated",
          description: "Your changes have been saved.",
        })
      } else {
        const newSlideshow = await createSlideshow(slideshowData)
        toast({
          title: "Slideshow saved",
          description: "Your slideshow has been saved to your dashboard.",
        })
        // Update URL to include the new slideshow ID
        window.history.replaceState({}, "", `/create?id=${newSlideshow.id}`)
      }
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your slideshow.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const canProceed = (step: string) => {
    switch (step) {
      case "transition":
      case "text":
      case "music":
      case "preview":
      case "export":
      case "enhance":
        return images.length >= 2
      default:
        return true
    }
  }

  const handleApplySuggestion = (type: string, suggestion: any) => {
    switch (type) {
      case "text":
        setTextOverlays((prev) => [
          ...prev,
          {
            imageIndex: 0,
            text: suggestion.text,
            font: "Inter",
            size: 28,
            color: suggestion.color,
            position: suggestion.position,
            x: 50,
            y: suggestion.position === "top" ? 20 : suggestion.position === "bottom" ? 80 : 50,
          },
        ])
        break
      case "music":
        setSelectedMusic(suggestion)
        break
      case "timing":
        // Could be used to adjust transition timing
        break
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center">
              S
            </div>
            <span>SlideSync</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Your Slideshow</h1>
          <p className="text-muted-foreground mt-2">Follow the steps below to create your before & after slideshow</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <Tabs value={activeStep} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
                {steps.map((step) => (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className="flex items-center gap-2"
                    disabled={!canProceed(step.id)}
                  >
                    {step.icon}
                    <span className="hidden md:inline">{step.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <Card>
                <CardContent className="p-6">
                  <TabsContent value="upload" className="mt-0">
                    <ImageUploader images={images} setImages={setImages} />
                  </TabsContent>

                  <TabsContent value="enhance" className="mt-0">
                    <AutoEnhance images={images} onEnhance={setEnhancements} onImagesUpdated={setImages} />
                  </TabsContent>

                  <TabsContent value="transition" className="mt-0">
                    <TransitionSelector transition={transition} setTransition={setTransition} />
                  </TabsContent>

                  <TabsContent value="text" className="mt-0">
                    <TextEditor images={images} textOverlays={textOverlays} setTextOverlays={setTextOverlays} />
                  </TabsContent>

                  <TabsContent value="music" className="mt-0">
                    <MusicSelector selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic} />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <SlidePreview
                      images={images}
                      transition={transition}
                      textOverlays={textOverlays}
                      music={selectedMusic}
                    />
                  </TabsContent>

                  <TabsContent value="export" className="mt-0">
                    <ExportOptions
                      exportFormat={exportFormat}
                      setExportFormat={setExportFormat}
                      onExport={handleExport}
                      images={images}
                      transition={transition}
                      textOverlays={textOverlays}
                      music={selectedMusic}
                    />
                  </TabsContent>
                </CardContent>
              </Card>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={activeStep === steps[0].id}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {activeStep === steps[steps.length - 1].id ? (
                  <Button onClick={() => setActiveStep("export")} disabled={!canProceed("export")}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Ready to Share!
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed(steps[steps.findIndex((s) => s.id === activeStep) + 1]?.id)}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </Tabs>
          </div>

          <div className="space-y-6">
            <SmartSuggestions enhancements={enhancements} onApplySuggestion={handleApplySuggestion} />

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Options
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <div className="mr-2 h-4 w-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-sm"></div>
                    Instagram Stories & Reels
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <div className="mr-2 h-4 w-4 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">
                      T
                    </div>
                    TikTok Videos
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <div className="mr-2 h-4 w-4 bg-blue-600 rounded-sm"></div>
                    Facebook Posts
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs mt-4">Export your slideshow to unlock sharing options</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted">
        <div className="container py-6 px-4 md:px-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} SlideSync. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

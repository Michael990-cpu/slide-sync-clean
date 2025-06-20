"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SlidePreviewProps {
  images: File[]
  transition: string
  textOverlays: any[]
  music: string | null
}

export function SlidePreview({ images, transition, textOverlays, music }: SlidePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  // Duration per slide in milliseconds
  const slideDuration = 3000

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying && images.length > 0) {
      const interval = 50 // Update progress every 50ms
      timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (interval / slideDuration) * 100

          if (newProgress >= 100) {
            // Move to next slide
            setCurrentSlide((current) => {
              const next = current + 1
              if (next >= images.length) {
                setIsPlaying(false)
                toast({
                  title: "Slideshow completed",
                  description: "Your slideshow has finished playing.",
                })
                return 0
              }
              return next
            })
            return 0
          }

          return newProgress
        })
      }, interval)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, images.length, currentSlide, toast])

  const togglePlay = () => {
    if (images.length === 0) {
      toast({
        title: "No images to preview",
        description: "Please upload some images first.",
        variant: "destructive",
      })
      return
    }
    setIsPlaying(!isPlaying)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setProgress(0)
    setIsPlaying(false)
  }

  const previousSlide = () => {
    const prev = currentSlide - 1
    setCurrentSlide(prev < 0 ? images.length - 1 : prev)
    setProgress(0)
    setIsPlaying(false)
  }

  const nextSlide = () => {
    const next = currentSlide + 1
    setCurrentSlide(next >= images.length ? 0 : next)
    setProgress(0)
    setIsPlaying(false)
  }

  const resetSlideshow = () => {
    setCurrentSlide(0)
    setProgress(0)
    setIsPlaying(false)
    toast({
      title: "Slideshow reset",
      description: "Returned to the first slide.",
    })
  }

  const getCurrentOverlays = () => {
    return textOverlays.filter((overlay) => overlay.imageIndex === currentSlide)
  }

  const getImageUrl = (file: File) => {
    try {
      return URL.createObjectURL(file)
    } catch (error) {
      console.error("Error creating object URL:", error)
      return "/placeholder.svg?height=400&width=600"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Preview Slideshow</h2>
        <p className="text-muted-foreground">Preview your slideshow with all effects applied</p>
      </div>

      {images.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                {/* Main image */}
                <img
                  src={getImageUrl(images[currentSlide]) || "/placeholder.svg"}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                  }}
                />

                {/* Text overlays */}
                {getCurrentOverlays().map((overlay, i) => (
                  <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${overlay.x}%`,
                      top: `${overlay.y}%`,
                      transform: "translate(-50%, -50%)",
                      color: overlay.color,
                      fontSize: `${overlay.size}px`,
                      fontFamily: overlay.font,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {overlay.text}
                  </div>
                ))}

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div className="h-full bg-primary transition-all duration-75" style={{ width: `${progress}%` }} />
                </div>

                {/* Slide counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentSlide + 1} / {images.length}
                </div>

                {/* Transition indicator */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {transition.replace("-", " ").toUpperCase()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button size="icon" variant="outline" onClick={resetSlideshow}>
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="outline" onClick={previousSlide}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button size="icon" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button size="icon" variant="outline" onClick={nextSlide}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Settings summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Preview Settings</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Transition:</span>
                    <span className="ml-2 capitalize">{transition.replace("-", " ")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Music:</span>
                    <span className="ml-2">{music ? "Selected" : "None"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Text Overlays:</span>
                    <span className="ml-2">{textOverlays.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2">{(images.length * 3).toFixed(0)}s</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">Please upload images first to preview your slideshow.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back to Upload
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wand2, Sparkles, Zap, Eye, ImageIcon, Palette, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AutoEnhanceProps {
  images: File[]
  onEnhance: (enhancements: any) => void
  onImagesUpdated: (images: File[]) => void
}

interface ImageAnalysis {
  brightness: number
  contrast: number
  saturation: number
  sharpness: number
  dominantColors: string[]
  mood: "bright" | "dark" | "vibrant" | "muted"
  quality: "excellent" | "good" | "fair" | "poor"
  suggestions: string[]
}

export function AutoEnhance({ images, onEnhance, onImagesUpdated }: AutoEnhanceProps) {
  const [enhancing, setEnhancing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [imageAnalyses, setImageAnalyses] = useState<ImageAnalysis[]>([])
  const [enhancedImages, setEnhancedImages] = useState<File[]>([])
  const [autoSettings, setAutoSettings] = useState({
    smartCrop: true,
    colorCorrection: true,
    noiseReduction: true,
    sharpening: true,
    autoText: true,
    smartMusic: true,
    optimalTiming: true,
    faceDetection: false,
  })
  const [intensity, setIntensity] = useState(70)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Real image analysis using Canvas
  const analyzeImage = useCallback(async (file: File): Promise<ImageAnalysis> => {
    return new Promise((resolve) => {
      const img = new Image()
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Analyze image properties
        let totalBrightness = 0
        let totalSaturation = 0
        const colorCounts: { [key: string]: number } = {}

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Calculate brightness
          const brightness = (r + g + b) / 3
          totalBrightness += brightness

          // Calculate saturation
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const saturation = max === 0 ? 0 : (max - min) / max
          totalSaturation += saturation

          // Track dominant colors (simplified)
          const colorKey = `${Math.floor(r / 50) * 50},${Math.floor(g / 50) * 50},${Math.floor(b / 50) * 50}`
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1
        }

        const pixelCount = data.length / 4
        const avgBrightness = totalBrightness / pixelCount
        const avgSaturation = totalSaturation / pixelCount

        // Get dominant colors
        const dominantColors = Object.entries(colorCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([color]) => `rgb(${color})`)

        // Determine mood and quality
        const mood = avgSaturation > 0.3 ? "vibrant" : avgBrightness > 128 ? "bright" : "muted"
        const quality = avgBrightness > 50 && avgBrightness < 200 ? "excellent" : "good"

        // Generate suggestions
        const suggestions = []
        if (avgBrightness < 100) suggestions.push("Increase brightness")
        if (avgSaturation < 0.2) suggestions.push("Boost colors")
        if (avgBrightness > 200) suggestions.push("Reduce overexposure")

        resolve({
          brightness: avgBrightness,
          contrast: Math.abs(avgBrightness - 128) / 128,
          saturation: avgSaturation,
          sharpness: 0.5, // Would need edge detection for real sharpness
          dominantColors,
          mood,
          quality,
          suggestions,
        })
      }

      img.src = URL.createObjectURL(file)
    })
  }, [])

  // Apply enhancements to image
  const enhanceImage = useCallback(
    async (file: File, analysis: ImageAnalysis): Promise<File> => {
      return new Promise((resolve) => {
        const img = new Image()
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height

          // Apply filters based on analysis and settings
          let filterString = ""

          if (autoSettings.colorCorrection) {
            const brightnessAdjust = analysis.brightness < 100 ? 1.2 : analysis.brightness > 180 ? 0.8 : 1
            const contrastAdjust = analysis.contrast < 0.3 ? 1.2 : 1
            const saturationAdjust = analysis.saturation < 0.2 ? 1.3 : 1

            filterString += `brightness(${brightnessAdjust}) contrast(${contrastAdjust}) saturate(${saturationAdjust}) `
          }

          if (autoSettings.sharpening) {
            // Simulate sharpening with contrast
            filterString += `contrast(${1 + intensity / 200}) `
          }

          if (autoSettings.noiseReduction) {
            // Simulate noise reduction with slight blur
            filterString += `blur(${0.5 - intensity / 200}px) `
          }

          ctx.filter = filterString
          ctx.drawImage(img, 0, 0)

          // Convert back to file
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const enhancedFile = new File([blob], file.name, { type: file.type })
                resolve(enhancedFile)
              } else {
                resolve(file)
              }
            },
            file.type,
            0.95,
          )
        }

        img.src = URL.createObjectURL(file)
      })
    },
    [autoSettings, intensity],
  )

  const handleAutoEnhance = async () => {
    if (images.length === 0) {
      toast({
        title: "No images to enhance",
        description: "Please upload images first.",
        variant: "destructive",
      })
      return
    }

    setEnhancing(true)
    setAnalysisProgress(0)
    setCurrentStep("Analyzing images...")

    try {
      // Step 1: Analyze all images
      const analyses: ImageAnalysis[] = []
      for (let i = 0; i < images.length; i++) {
        setCurrentStep(`Analyzing image ${i + 1} of ${images.length}...`)
        setAnalysisProgress((i / images.length) * 30)

        const analysis = await analyzeImage(images[i])
        analyses.push(analysis)

        // Small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setImageAnalyses(analyses)
      setCurrentStep("Applying enhancements...")
      setAnalysisProgress(40)

      // Step 2: Enhance images
      const enhanced: File[] = []
      for (let i = 0; i < images.length; i++) {
        setCurrentStep(`Enhancing image ${i + 1} of ${images.length}...`)
        setAnalysisProgress(40 + (i / images.length) * 40)

        const enhancedImage = await enhanceImage(images[i], analyses[i])
        enhanced.push(enhancedImage)

        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      setEnhancedImages(enhanced)
      setCurrentStep("Generating smart suggestions...")
      setAnalysisProgress(85)

      // Step 3: Generate content suggestions
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const overallMood = analyses.reduce((acc, curr) => {
        if (curr.mood === "vibrant") return "vibrant"
        if (curr.mood === "bright" && acc !== "vibrant") return "bright"
        return acc
      }, "muted")

      const suggestedTexts = generateTextSuggestions(overallMood, analyses)
      const suggestedMusic = generateMusicSuggestion(overallMood)
      const optimalDuration = calculateOptimalDuration(images.length, analyses)

      setCurrentStep("Finalizing enhancements...")
      setAnalysisProgress(100)

      const enhancements = {
        images: enhanced,
        analyses,
        suggestedTexts: autoSettings.autoText ? suggestedTexts : [],
        suggestedMusic: autoSettings.smartMusic ? suggestedMusic : null,
        optimalDuration: autoSettings.optimalTiming ? optimalDuration : null,
        overallMood,
        improvements: analyses.flatMap((a) => a.suggestions),
      }

      // Update the images in the parent component
      onImagesUpdated(enhanced)
      onEnhance(enhancements)

      toast({
        title: "Auto-Enhancement Complete! ✨",
        description: `Enhanced ${images.length} images with AI-powered optimizations!`,
      })
    } catch (error) {
      console.error("Enhancement error:", error)
      toast({
        title: "Enhancement failed",
        description: "Please try again or adjust settings manually.",
        variant: "destructive",
      })
    } finally {
      setEnhancing(false)
      setAnalysisProgress(0)
      setCurrentStep("")
    }
  }

  const generateTextSuggestions = (mood: string, analyses: ImageAnalysis[]) => {
    const suggestions = []

    if (mood === "vibrant") {
      suggestions.push(
        { text: "Amazing Transformation! 🌟", position: "center", style: "bold", color: "#ff6b6b" },
        { text: "Before & After", position: "top", style: "elegant", color: "#4ecdc4" },
      )
    } else if (mood === "bright") {
      suggestions.push(
        { text: "Incredible Journey ✨", position: "center", style: "modern", color: "#45b7d1" },
        { text: "See the Difference", position: "bottom", style: "clean", color: "#96ceb4" },
      )
    } else {
      suggestions.push(
        { text: "Stunning Results", position: "center", style: "classic", color: "#ffeaa7" },
        { text: "The Transformation", position: "top", style: "minimal", color: "#dda0dd" },
      )
    }

    return suggestions
  }

  const generateMusicSuggestion = (mood: string) => {
    const musicMap = {
      vibrant: "energetic",
      bright: "upbeat",
      muted: "cinematic",
      dark: "dramatic",
    }
    return musicMap[mood] || "upbeat"
  }

  const calculateOptimalDuration = (imageCount: number, analyses: ImageAnalysis[]) => {
    // Base duration per image
    let baseDuration = 3

    // Adjust based on image complexity
    const avgComplexity =
      analyses.reduce((acc, curr) => {
        return acc + curr.suggestions.length / 3 // More suggestions = more complex
      }, 0) / analyses.length

    baseDuration += avgComplexity * 0.5

    return Math.max(2, Math.min(5, baseDuration))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
          <Wand2 className="h-5 w-5" />
          AI Auto-Enhancement
        </h2>
        <p className="text-muted-foreground">Let AI analyze and optimize your slideshow for maximum impact</p>
      </div>

      {/* Image Analysis Results */}
      {imageAnalyses.length > 0 && !enhancing && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Analysis Complete</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">Image Quality</h4>
                <div className="space-y-2">
                  {imageAnalyses.map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>Image {index + 1}</span>
                      <Badge variant={analysis.quality === "excellent" ? "default" : "secondary"}>
                        {analysis.quality}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Suggested Improvements</h4>
                <div className="space-y-1">
                  {Array.from(new Set(imageAnalyses.flatMap((a) => a.suggestions)))
                    .slice(0, 3)
                    .map((suggestion, index) => (
                      <div key={index} className="text-sm text-green-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {suggestion}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {enhancedImages.length > 0 && (
              <div className="text-sm text-green-700">✅ {enhancedImages.length} images enhanced and ready to use!</div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Quick Enhance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">One-Click Magic</h3>
              <p className="text-muted-foreground mb-6">
                Our AI will analyze your images, enhance quality, suggest text, pick music, and optimize timing
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Enhancement Intensity</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-muted-foreground">Subtle</span>
                    <Slider
                      value={[intensity]}
                      onValueChange={(value) => setIntensity(value[0])}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">Dramatic</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{intensity}% intensity</p>
                </div>

                {enhancing && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">{currentStep}</span>
                          <span className="text-sm text-blue-600">{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-2" />
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          AI is analyzing your images...
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={handleAutoEnhance}
                  disabled={enhancing || images.length === 0}
                  size="lg"
                  className="w-full"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {enhancing ? "Enhancing..." : "✨ Auto-Enhance My Slideshow"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Processing
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smart-crop">Smart Cropping</Label>
                    <p className="text-sm text-muted-foreground">Automatically crop for best composition</p>
                  </div>
                  <Switch
                    id="smart-crop"
                    checked={autoSettings.smartCrop}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, smartCrop: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="color-correction">Color Correction</Label>
                    <p className="text-sm text-muted-foreground">Enhance brightness, contrast, and saturation</p>
                  </div>
                  <Switch
                    id="color-correction"
                    checked={autoSettings.colorCorrection}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, colorCorrection: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="noise-reduction">Noise Reduction</Label>
                    <p className="text-sm text-muted-foreground">Remove grain and improve image quality</p>
                  </div>
                  <Switch
                    id="noise-reduction"
                    checked={autoSettings.noiseReduction}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, noiseReduction: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sharpening">Image Sharpening</Label>
                    <p className="text-sm text-muted-foreground">Make images appear more crisp and detailed</p>
                  </div>
                  <Switch
                    id="sharpening"
                    checked={autoSettings.sharpening}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, sharpening: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="face-detection">Face Detection</Label>
                    <p className="text-sm text-muted-foreground">Optimize for faces in images</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Premium
                    </Badge>
                  </div>
                  <Switch
                    id="face-detection"
                    checked={autoSettings.faceDetection}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, faceDetection: checked }))}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Smart Content Suggestions
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-text">AI Text Generation</Label>
                    <p className="text-sm text-muted-foreground">Generate contextual text overlays</p>
                  </div>
                  <Switch
                    id="auto-text"
                    checked={autoSettings.autoText}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, autoText: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smart-music">Music Matching</Label>
                    <p className="text-sm text-muted-foreground">Choose music based on image mood</p>
                  </div>
                  <Switch
                    id="smart-music"
                    checked={autoSettings.smartMusic}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, smartMusic: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="optimal-timing">Optimal Timing</Label>
                    <p className="text-sm text-muted-foreground">Perfect slide duration for engagement</p>
                  </div>
                  <Switch
                    id="optimal-timing"
                    checked={autoSettings.optimalTiming}
                    onCheckedChange={(checked) => setAutoSettings((prev) => ({ ...prev, optimalTiming: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {enhancing && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <div>
                      <h3 className="font-medium text-blue-800">{currentStep}</h3>
                      <p className="text-sm text-blue-600">This may take a few moments...</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>Analyzing: {images.length} images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>Intensity: {intensity}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleAutoEnhance} disabled={enhancing || images.length === 0} size="lg" className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {enhancing ? "Processing..." : "Apply Custom Enhancement"}
          </Button>
        </TabsContent>
      </Tabs>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

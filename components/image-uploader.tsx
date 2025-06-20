"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, MoveLeft, MoveRight, ImageIcon, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

interface ImageUploaderProps {
  images: File[]
  setImages: (images: File[]) => void
}

export function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFiles = async (files: File[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images.",
        variant: "destructive",
      })
      return
    }

    const validFiles = files.filter((file) => file.type.startsWith("image/"))

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Only image files are allowed.",
        variant: "destructive",
      })
    }

    if (validFiles.length === 0) return

    setUploading(true)

    try {
      // For now, just add the files directly without uploading to storage
      // We'll implement storage upload later
      const newImages = [...images, ...validFiles]
      setImages(newImages)

      toast({
        title: "Images added successfully",
        description: `${validFiles.length} image(s) added to your slideshow.`,
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error adding your images.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const moveImage = (index: number, direction: "left" | "right") => {
    if ((direction === "left" && index === 0) || (direction === "right" && index === images.length - 1)) {
      return
    }

    const newImages = [...images]
    const newIndex = direction === "left" ? index - 1 : index + 1

    // Swap images
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]

    setImages(newImages)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Images</h2>
        <p className="text-muted-foreground">Upload at least 2 images for your before & after slideshow</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">{uploading ? "Processing images..." : "Drag and drop your images here"}</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {uploading ? "Please wait while we process your files" : "Or click the button below to browse your files"}
          </p>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />

          {/* Visible button */}
          <Button onClick={handleButtonClick} disabled={uploading} className="min-w-[140px]">
            <ImageIcon className="mr-2 h-4 w-4" />
            {uploading ? "Processing..." : "Select Images"}
          </Button>

          <p className="text-xs text-muted-foreground mt-3">Supports: JPG, PNG, GIF, WebP (Max 10MB per image)</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Selected Images ({images.length})</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click()
                }
              }}
              disabled={uploading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add More
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Drag and drop to reorder. The first image will be the "before" image.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((file, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Selected image ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => moveImage(index, "left")}
                      disabled={index === 0}
                    >
                      <MoveLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => moveImage(index, "right")}
                      disabled={index === images.length - 1}
                    >
                      <MoveRight className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => removeImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index === 0 ? "Before" : index === 1 ? "After" : `Image ${index + 1}`}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick test buttons for development */}
      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground mb-3">Quick test (for development):</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Create mock files for testing
              const mockFiles = [
                new File([""], "before.jpg", { type: "image/jpeg" }),
                new File([""], "after.jpg", { type: "image/jpeg" }),
              ]
              setImages([...images, ...mockFiles])
              toast({
                title: "Test images added",
                description: "Added 2 test images for development.",
              })
            }}
          >
            Add Test Images
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setImages([])
              toast({
                title: "Images cleared",
                description: "All images have been removed.",
              })
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}

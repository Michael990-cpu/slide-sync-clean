"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2 } from "lucide-react"

interface TextEditorProps {
  images: File[]
  textOverlays: any[]
  setTextOverlays: (overlays: any[]) => void
}

export function TextEditor({ images, textOverlays, setTextOverlays }: TextEditorProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const addTextOverlay = () => {
    const newOverlay = {
      imageIndex: activeImageIndex,
      text: "Your text here",
      font: "Inter",
      size: 24,
      color: "#ffffff",
      position: "center",
      x: 50,
      y: 50,
    }

    setTextOverlays([...textOverlays, newOverlay])
  }

  const updateTextOverlay = (index: number, field: string, value: any) => {
    const updatedOverlays = [...textOverlays]
    updatedOverlays[index] = { ...updatedOverlays[index], [field]: value }
    setTextOverlays(updatedOverlays)
  }

  const removeTextOverlay = (index: number) => {
    const updatedOverlays = [...textOverlays]
    updatedOverlays.splice(index, 1)
    setTextOverlays(updatedOverlays)
  }

  const getImageOverlays = () => {
    return textOverlays.filter((overlay) => overlay.imageIndex === activeImageIndex)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Add Text & Captions</h2>
        <p className="text-muted-foreground">Add text overlays to your images</p>
      </div>

      {images.length > 0 ? (
        <Tabs
          defaultValue="0"
          value={activeImageIndex.toString()}
          onValueChange={(value) => setActiveImageIndex(Number.parseInt(value))}
          className="w-full"
        >
          <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap">
            {images.map((_, index) => (
              <TabsTrigger key={index} value={index.toString()}>
                {index === 0 ? "Before" : index === 1 ? "After" : `Image ${index + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>

          {images.map((file, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-0">
              <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                <div className="relative bg-muted rounded-md overflow-hidden">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    className="w-full object-contain max-h-[400px]"
                  />

                  {/* Text overlays preview */}
                  {textOverlays
                    .filter((overlay) => overlay.imageIndex === index)
                    .map((overlay, i) => (
                      <div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${overlay.x}%`,
                          top: `${overlay.y}%`,
                          transform: "translate(-50%, -50%)",
                          color: overlay.color,
                          fontSize: `${overlay.size}px`,
                          fontFamily: overlay.font,
                        }}
                      >
                        {overlay.text}
                      </div>
                    ))}
                </div>

                <div className="space-y-4">
                  <Button onClick={addTextOverlay} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Text
                  </Button>

                  {getImageOverlays().length === 0 ? (
                    <div className="text-center p-6 border rounded-md">
                      <p className="text-muted-foreground">
                        No text overlays added yet. Click "Add Text" to create one.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getImageOverlays().map((overlay, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Text #{i + 1}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTextOverlay(textOverlays.indexOf(overlay))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`text-${i}`}>Text</Label>
                                <Input
                                  id={`text-${i}`}
                                  value={overlay.text}
                                  onChange={(e) =>
                                    updateTextOverlay(textOverlays.indexOf(overlay), "text", e.target.value)
                                  }
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`font-${i}`}>Font</Label>
                                  <Select
                                    value={overlay.font}
                                    onValueChange={(value) =>
                                      updateTextOverlay(textOverlays.indexOf(overlay), "font", value)
                                    }
                                  >
                                    <SelectTrigger id={`font-${i}`}>
                                      <SelectValue placeholder="Select font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Inter">Inter</SelectItem>
                                      <SelectItem value="Arial">Arial</SelectItem>
                                      <SelectItem value="Georgia">Georgia</SelectItem>
                                      <SelectItem value="Verdana">Verdana</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`color-${i}`}>Color</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id={`color-${i}`}
                                      type="color"
                                      value={overlay.color}
                                      onChange={(e) =>
                                        updateTextOverlay(textOverlays.indexOf(overlay), "color", e.target.value)
                                      }
                                      className="w-12 p-1 h-10"
                                    />
                                    <Input
                                      value={overlay.color}
                                      onChange={(e) =>
                                        updateTextOverlay(textOverlays.indexOf(overlay), "color", e.target.value)
                                      }
                                      className="flex-1"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`size-${i}`}>Size: {overlay.size}px</Label>
                                <Slider
                                  id={`size-${i}`}
                                  min={12}
                                  max={72}
                                  step={1}
                                  value={[overlay.size]}
                                  onValueChange={(value) =>
                                    updateTextOverlay(textOverlays.indexOf(overlay), "size", value[0])
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Position</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`x-${i}`} className="text-xs">
                                      X: {overlay.x}%
                                    </Label>
                                    <Slider
                                      id={`x-${i}`}
                                      min={0}
                                      max={100}
                                      step={1}
                                      value={[overlay.x]}
                                      onValueChange={(value) =>
                                        updateTextOverlay(textOverlays.indexOf(overlay), "x", value[0])
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`y-${i}`} className="text-xs">
                                      Y: {overlay.y}%
                                    </Label>
                                    <Slider
                                      id={`y-${i}`}
                                      min={0}
                                      max={100}
                                      step={1}
                                      value={[overlay.y]}
                                      onValueChange={(value) =>
                                        updateTextOverlay(textOverlays.indexOf(overlay), "y", value[0])
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">Please upload images first before adding text overlays.</p>
        </div>
      )}
    </div>
  )
}

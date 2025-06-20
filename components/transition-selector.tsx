"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface TransitionSelectorProps {
  transition: string
  setTransition: (transition: string) => void
}

export function TransitionSelector({ transition, setTransition }: TransitionSelectorProps) {
  const [duration, setDuration] = useState(1000)

  const transitions = [
    {
      id: "fade",
      name: "Fade",
      description: "Smooth fade between images",
      premium: false,
    },
    {
      id: "slide-left",
      name: "Slide Left",
      description: "Slide from right to left",
      premium: false,
    },
    {
      id: "slide-right",
      name: "Slide Right",
      description: "Slide from left to right",
      premium: false,
    },
    {
      id: "swipe",
      name: "Swipe",
      description: "Swipe effect revealing the next image",
      premium: false,
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Zoom in/out between images",
      premium: true,
    },
    {
      id: "spin",
      name: "Spin",
      description: "Rotating transition effect",
      premium: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Choose Transition</h2>
        <p className="text-muted-foreground">Select how your images will transition from one to another</p>
      </div>

      <RadioGroup value={transition} onValueChange={setTransition} className="grid gap-4 md:grid-cols-2">
        {transitions.map((item) => (
          <div key={item.id}>
            <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" disabled={item.premium} />
            <Label
              htmlFor={item.id}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div className="mb-3 w-full aspect-video bg-muted rounded flex items-center justify-center">
                <span className="text-sm">{item.name} Preview</span>
              </div>
              <div className="w-full text-left">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.premium && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-2 bg-primary/10 text-primary">
                    Premium
                  </span>
                )}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Transition Duration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adjust how long each transition takes (in milliseconds)
              </p>
              <div className="flex items-center gap-4">
                <Slider
                  value={[duration]}
                  min={500}
                  max={3000}
                  step={100}
                  onValueChange={(value) => setDuration(value[0])}
                  className="flex-1"
                />
                <span className="w-16 text-right">{duration}ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

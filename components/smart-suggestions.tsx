"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Palette, Music, Clock, Zap, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface SmartSuggestionsProps {
  enhancements: any
  onApplySuggestion: (type: string, suggestion: any) => void
}

export function SmartSuggestions({ enhancements, onApplySuggestion }: SmartSuggestionsProps) {
  const { toast } = useToast()

  if (!enhancements) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Use AI Enhancement to get smart suggestions</p>
        </CardContent>
      </Card>
    )
  }

  const handleApplySuggestion = (type: string, suggestion: any) => {
    onApplySuggestion(type, suggestion)
    toast({
      title: "Suggestion Applied! ✨",
      description: `${type} suggestion has been applied to your slideshow.`,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mood Analysis */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Detected Mood</span>
              <Badge variant="secondary" className="capitalize">
                {enhancements.overallMood}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Your images have a {enhancements.overallMood} mood. We've optimized suggestions accordingly.
            </p>
          </div>

          {/* Text Suggestions */}
          {enhancements.suggestedTexts?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Text Suggestions
              </h4>
              <div className="space-y-2">
                {enhancements.suggestedTexts.map((text: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium" style={{ color: text.color }}>
                        {text.text}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {text.position} • {text.style} style
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleApplySuggestion("text", text)}>
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music Suggestion */}
          {enhancements.suggestedMusic && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Music className="h-4 w-4" />
                Music Suggestion
              </h4>
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium capitalize">{enhancements.suggestedMusic} Music</p>
                  <p className="text-xs text-muted-foreground">
                    Perfect match for your {enhancements.overallMood} mood
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplySuggestion("music", enhancements.suggestedMusic)}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}

          {/* Timing Suggestion */}
          {enhancements.optimalDuration && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timing Optimization
              </h4>
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">{enhancements.optimalDuration}s per slide</p>
                  <p className="text-xs text-muted-foreground">Optimized for maximum engagement</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplySuggestion("timing", enhancements.optimalDuration)}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}

          {/* Improvements Applied */}
          {enhancements.improvements?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Applied Improvements
              </h4>
              <div className="space-y-1">
                {enhancements.improvements.slice(0, 3).map((improvement: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {improvement}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

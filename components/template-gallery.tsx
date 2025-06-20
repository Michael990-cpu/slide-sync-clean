"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Crown, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Template {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  transition: string
  textStyle: any
  musicGenre: string
  premium: boolean
  popular: boolean
  tags: string[]
}

export function TemplateGallery({ onSelectTemplate }: { onSelectTemplate: (template: Template) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  const templates: Template[] = [
    {
      id: "fitness-transformation",
      name: "Fitness Transformation",
      category: "fitness",
      description: "Perfect for weight loss and muscle gain journeys",
      thumbnail: "/placeholder.svg?height=200&width=300",
      transition: "slide-left",
      textStyle: { font: "Arial", size: 32, color: "#ffffff" },
      musicGenre: "motivational",
      premium: false,
      popular: true,
      tags: ["fitness", "weight loss", "muscle gain", "transformation"],
    },
    {
      id: "beauty-makeover",
      name: "Beauty Makeover",
      category: "beauty",
      description: "Showcase stunning beauty transformations",
      thumbnail: "/placeholder.svg?height=200&width=300",
      transition: "fade",
      textStyle: { font: "Georgia", size: 28, color: "#ff69b4" },
      musicGenre: "elegant",
      premium: false,
      popular: true,
      tags: ["beauty", "makeup", "hair", "skincare"],
    },
    {
      id: "home-renovation",
      name: "Home Renovation",
      category: "home",
      description: "Perfect for room makeovers and renovations",
      thumbnail: "/placeholder.svg?height=200&width=300",
      transition: "swipe",
      textStyle: { font: "Inter", size: 30, color: "#2563eb" },
      musicGenre: "upbeat",
      premium: false,
      popular: false,
      tags: ["home", "renovation", "interior", "design"],
    },
    {
      id: "business-growth",
      name: "Business Growth",
      category: "business",
      description: "Show your business journey and achievements",
      thumbnail: "/placeholder.svg?height=200&width=300",
      transition: "zoom",
      textStyle: { font: "Inter", size: 34, color: "#059669" },
      musicGenre: "corporate",
      premium: true,
      popular: false,
      tags: ["business", "growth", "success", "corporate"],
    },
    {
      id: "art-creation",
      name: "Art Creation Process",
      category: "creative",
      description: "Perfect for showing artistic process and results",
      thumbnail: "/placeholder.svg?height=200&width=300",
      transition: "spin",
      textStyle: { font: "Georgia", size: 26, color: "#7c3aed" },
      musicGenre: "creative",
      premium: true,
      popular: true,
      tags: ["art", "creative", "painting", "drawing"],
    },
    {
      id: "food-recipe",
      name: "Recipe Creation",
      category: "food",
      description: "Show cooking process from ingredients to final dish",
      thumbnail: "/placeholder.svg?height=200&width=300",
      transition: "slide-right",
      textStyle: { font: "Verdana", size: 24, color: "#ea580c" },
      musicGenre: "cheerful",
      premium: false,
      popular: false,
      tags: ["food", "cooking", "recipe", "kitchen"],
    },
  ]

  const categories = [
    { id: "all", name: "All Templates", count: templates.length },
    { id: "fitness", name: "Fitness", count: templates.filter((t) => t.category === "fitness").length },
    { id: "beauty", name: "Beauty", count: templates.filter((t) => t.category === "beauty").length },
    { id: "home", name: "Home & Design", count: templates.filter((t) => t.category === "home").length },
    { id: "business", name: "Business", count: templates.filter((t) => t.category === "business").length },
    { id: "creative", name: "Creative", count: templates.filter((t) => t.category === "creative").length },
    { id: "food", name: "Food", count: templates.filter((t) => t.category === "food").length },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSelectTemplate = (template: Template) => {
    if (template.premium) {
      toast({
        title: "Premium Template",
        description: "This template requires a premium subscription. Upgrade to unlock!",
        variant: "destructive",
      })
      return
    }

    onSelectTemplate(template)
    toast({
      title: "Template Applied! 🎨",
      description: `${template.name} template has been applied to your slideshow.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">Get started quickly with professionally designed templates</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          {/* Popular Templates */}
          {selectedCategory === "all" && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Popular Templates
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates
                  .filter((t) => t.popular)
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} onSelect={handleSelectTemplate} />
                  ))}
              </div>
            </div>
          )}

          {/* All Templates */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {selectedCategory === "all" ? "All Templates" : categories.find((c) => c.id === selectedCategory)?.name}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} onSelect={handleSelectTemplate} />
              ))}
            </div>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found matching your search.</p>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
                Clear Search
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TemplateCard({ template, onSelect }: { template: Template; onSelect: (template: Template) => void }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={template.thumbnail || "/placeholder.svg"}
            alt={template.name}
            className="w-full aspect-video object-cover rounded-t-lg"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
            <Button size="sm" onClick={() => onSelect(template)}>
              <Play className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {template.popular && (
              <Badge className="bg-yellow-500 text-yellow-900">
                <Zap className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            {template.premium && (
              <Badge className="bg-purple-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold mb-1">{template.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{template.transition} transition</span>
            <span>{template.musicGenre} music</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, Upload, Volume2, VolumeX, Music, Search, ExternalLink, LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface MusicSelectorProps {
  selectedMusic: string | null
  setSelectedMusic: (music: string | null) => void
}

interface StreamingTrack {
  id: string
  title: string
  artist: string
  duration: string
  platform: "spotify" | "audiomack" | "apple"
  url: string
  preview_url?: string
}

export function MusicSelector({ selectedMusic, setSelectedMusic }: MusicSelectorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [uploadedMusic, setUploadedMusic] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<StreamingTrack[]>([])
  const [searching, setSearching] = useState(false)
  const [streamingUrl, setStreamingUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const musicLibrary = [
    {
      id: "upbeat",
      name: "Upbeat Inspiration",
      duration: "1:30",
      premium: false,
    },
    {
      id: "cinematic",
      name: "Cinematic Reveal",
      duration: "2:15",
      premium: false,
    },
    {
      id: "emotional",
      name: "Emotional Journey",
      duration: "1:45",
      premium: false,
    },
    {
      id: "corporate",
      name: "Corporate Success",
      duration: "2:00",
      premium: false,
    },
    {
      id: "dramatic",
      name: "Dramatic Transformation",
      duration: "2:30",
      premium: true,
    },
    {
      id: "energetic",
      name: "Energetic Workout",
      duration: "1:50",
      premium: true,
    },
  ]

  // Mock search function - in real app, this would connect to streaming APIs
  const searchStreamingMusic = async (query: string) => {
    if (!query.trim()) return

    setSearching(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock results
    const mockResults: StreamingTrack[] = [
      {
        id: "spotify-1",
        title: "Uplifting Journey",
        artist: "Audio Artist",
        duration: "2:45",
        platform: "spotify",
        url: "https://open.spotify.com/track/example",
        preview_url: "https://example.com/preview.mp3",
      },
      {
        id: "audiomack-1",
        title: "Motivational Beat",
        artist: "Beat Maker",
        duration: "3:12",
        platform: "audiomack",
        url: "https://audiomack.com/song/example",
      },
      {
        id: "apple-1",
        title: "Inspiring Melody",
        artist: "Music Creator",
        duration: "2:58",
        platform: "apple",
        url: "https://music.apple.com/song/example",
      },
    ]

    setSearchResults(mockResults)
    setSearching(false)

    toast({
      title: "Search completed",
      description: `Found ${mockResults.length} tracks matching "${query}"`,
    })
  }

  const handleStreamingUrlImport = () => {
    if (!streamingUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid streaming URL",
        variant: "destructive",
      })
      return
    }

    // Detect platform from URL
    let platform: "spotify" | "audiomack" | "apple" | "unknown" = "unknown"
    if (streamingUrl.includes("spotify.com")) platform = "spotify"
    else if (streamingUrl.includes("audiomack.com")) platform = "audiomack"
    else if (streamingUrl.includes("music.apple.com")) platform = "apple"

    if (platform === "unknown") {
      toast({
        title: "Unsupported platform",
        description: "Please use Spotify, Audiomack, or Apple Music URLs",
        variant: "destructive",
      })
      return
    }

    setSelectedMusic(`streaming-${platform}-${Date.now()}`)
    toast({
      title: "Music imported",
      description: `Successfully imported track from ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    })
  }

  const togglePlay = (musicId: string) => {
    if (selectedMusic === musicId && isPlaying) {
      setIsPlaying(false)
    } else {
      setSelectedMusic(musicId)
      setIsPlaying(true)
      toast({
        title: "Music selected",
        description: `Now playing: ${musicLibrary.find((m) => m.id === musicId)?.name || "Selected track"}`,
      })
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      setUploading(true)

      setTimeout(() => {
        setUploadedMusic(file)
        setSelectedMusic(`uploaded-${file.name}`)
        setUploading(false)
        toast({
          title: "Music uploaded successfully",
          description: `${file.name} has been added to your slideshow.`,
        })
      }, 1000)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "spotify":
        return "🎵"
      case "audiomack":
        return "🎧"
      case "apple":
        return "🍎"
      default:
        return "🎶"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Add Music</h2>
        <p className="text-muted-foreground">Choose background music for your slideshow</p>
      </div>

      <Tabs defaultValue="library">
        <TabsList className="mb-4 grid grid-cols-4">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="streaming">Streaming</TabsTrigger>
          <TabsTrigger value="import">Import URL</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-0">
          <div className="space-y-4">
            {musicLibrary.map((music) => (
              <Card key={music.id} className={selectedMusic === music.id ? "border-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant={selectedMusic === music.id ? "default" : "outline"}
                        onClick={() => togglePlay(music.id)}
                        disabled={music.premium}
                      >
                        {selectedMusic === music.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <p className="font-medium">{music.name}</p>
                        <p className="text-sm text-muted-foreground">{music.duration}</p>
                      </div>
                    </div>
                    {music.premium && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                        Premium
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streaming" className="mt-0">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Search Streaming Platforms</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Search for music on Spotify, Audiomack, Apple Music..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchStreamingMusic(searchQuery)}
                  />
                  <Button onClick={() => searchStreamingMusic(searchQuery)} disabled={searching || !searchQuery.trim()}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searching && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Searching...</p>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Search Results</h4>
                    {searchResults.map((track) => (
                      <Card key={track.id} className={selectedMusic === track.id ? "border-primary" : ""}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="icon"
                                variant={selectedMusic === track.id ? "default" : "outline"}
                                onClick={() => {
                                  setSelectedMusic(track.id)
                                  toast({
                                    title: "Track selected",
                                    description: `${track.title} by ${track.artist}`,
                                  })
                                }}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <div>
                                <p className="font-medium flex items-center gap-2">
                                  <span>{getPlatformIcon(track.platform)}</span>
                                  {track.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {track.artist} • {track.duration}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => window.open(track.url, "_blank")}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Import from Streaming URL</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste a link from Spotify, Audiomack, or Apple Music
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="streaming-url">Streaming URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="streaming-url"
                      placeholder="https://open.spotify.com/track/..."
                      value={streamingUrl}
                      onChange={(e) => setStreamingUrl(e.target.value)}
                    />
                    <Button onClick={handleStreamingUrlImport} disabled={!streamingUrl.trim()}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Supported platforms:</strong>
                  </p>
                  <p>🎵 Spotify: open.spotify.com/track/...</p>
                  <p>🎧 Audiomack: audiomack.com/song/...</p>
                  <p>🍎 Apple Music: music.apple.com/...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Music className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="font-medium">Upload your own music</h3>
                <p className="text-muted-foreground text-sm">MP3, WAV, or other audio files (max 10MB)</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />

                <Button onClick={handleFileUpload} disabled={uploading} className="min-w-[140px]">
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Select Audio File"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Make sure you have the rights to use any music you upload
                </p>

                {uploadedMusic && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Music className="h-4 w-4" />
                        <div className="text-left">
                          <p className="font-medium text-sm">{uploadedMusic.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedMusic.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setUploadedMusic(null)
                          setSelectedMusic(null)
                          toast({
                            title: "Music removed",
                            description: "Uploaded music has been removed.",
                          })
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-medium">Audio Settings</h3>

            <div className="flex items-center gap-4">
              <Button size="icon" variant="outline" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <div className="flex-1">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setVolume(value[0])
                    if (value[0] === 0) {
                      setIsMuted(true)
                    } else {
                      setIsMuted(false)
                    }
                  }}
                />
              </div>

              <span className="w-10 text-right text-sm">{isMuted ? 0 : volume}%</span>
            </div>

            {selectedMusic && (
              <div className="text-sm text-muted-foreground">
                Selected:{" "}
                {selectedMusic.startsWith("uploaded-")
                  ? uploadedMusic?.name
                  : selectedMusic.startsWith("streaming-")
                    ? "Streaming track"
                    : musicLibrary.find((m) => m.id === selectedMusic)?.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

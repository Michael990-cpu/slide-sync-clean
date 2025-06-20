"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, XCircle, Copy, ExternalLink } from "lucide-react"

export default function DebugPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const { toast } = useToast()

  const addResult = (test: string, result: any, status: "success" | "error" | "info" = "info") => {
    setResults((prev) => [...prev, { test, result, status, timestamp: new Date().toISOString() }])
  }

  const runGoogleOAuthDiagnostics = async () => {
    setTesting(true)
    setResults([])

    try {
      // Test 1: Basic Supabase connection
      addResult("Supabase URL", supabase.supabaseUrl, "info")
      addResult(
        "Supabase Key",
        supabase.supabaseKey ? "Present" : "Missing",
        supabase.supabaseKey ? "success" : "error",
      )

      // Test 2: Current domain info
      const currentDomain = window.location.origin
      addResult("Current Domain", currentDomain, "info")
      addResult("Current URL", window.location.href, "info")

      // Test 3: Expected redirect URLs
      const expectedRedirectUrls = [
        `${currentDomain}/auth/callback`,
        `${supabase.supabaseUrl}/auth/v1/callback`,
        "http://localhost:3000/auth/callback", // for local development
      ]
      addResult("Expected Redirect URLs", expectedRedirectUrls, "info")

      // Test 4: Auth settings from Supabase
      try {
        const settingsResponse = await fetch(`${supabase.supabaseUrl}/auth/v1/settings`, {
          headers: {
            apikey: supabase.supabaseKey,
            Authorization: `Bearer ${supabase.supabaseKey}`,
          },
        })

        if (settingsResponse.ok) {
          const settings = await settingsResponse.json()
          addResult("Auth Settings", settings, "success")

          // Check Google provider configuration
          const googleConfig = settings.external?.google
          if (googleConfig) {
            addResult("Google OAuth Config", googleConfig, "success")
          } else {
            addResult("Google OAuth Config", "Not found in settings", "error")
          }
        } else {
          addResult("Auth Settings", `HTTP ${settingsResponse.status}`, "error")
        }
      } catch (error) {
        addResult("Auth Settings", { error: error.message }, "error")
      }

      // Test 5: Test OAuth URL generation
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            skipBrowserRedirect: true,
            redirectTo: `${currentDomain}/auth/callback`,
          },
        })

        if (data?.url) {
          addResult("Generated OAuth URL", data.url, "success")

          // Parse the OAuth URL to check parameters
          const url = new URL(data.url)
          const params = Object.fromEntries(url.searchParams.entries())
          addResult("OAuth URL Parameters", params, "info")
        } else {
          addResult("Generated OAuth URL", { error }, "error")
        }
      } catch (error) {
        addResult("OAuth URL Generation", { error: error.message }, "error")
      }
    } catch (error) {
      addResult("Test Error", error, "error")
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Configuration details copied successfully.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Google OAuth Configuration Fix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Fix Instructions */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-orange-800 mb-4">🚨 Quick Fix for "Invalid Request" Error</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">1. Check Google Cloud Console:</h4>
                  <ul className="list-disc list-inside space-y-1 text-orange-700">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        className="underline"
                        rel="noreferrer"
                      >
                        Google Cloud Console
                      </a>
                    </li>
                    <li>Select your project</li>
                    <li>Find your OAuth 2.0 Client ID</li>
                    <li>Click "Edit" on your OAuth client</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Add These Authorized Redirect URIs:</h4>
                  <div className="bg-white p-3 rounded border space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 p-1 rounded">
                        https://qgrgitqodfoharf wffnx.supabase.co/auth/v1/callback
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("https://qgrgitqodfoharf wffnx.supabase.co/auth/v1/callback")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 p-1 rounded">
                        {window.location.origin}/auth/callback
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`${window.location.origin}/auth/callback`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 p-1 rounded">
                        http://localhost:3000/auth/callback
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("http://localhost:3000/auth/callback")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. Add Authorized JavaScript Origins:</h4>
                  <div className="bg-white p-3 rounded border space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 p-1 rounded">{window.location.origin}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(window.location.origin)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 p-1 rounded">http://localhost:3000</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard("http://localhost:3000")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-100 p-3 rounded">
                  <p className="font-medium text-orange-800">⚠️ Important:</p>
                  <p className="text-orange-700">
                    After making changes in Google Cloud Console, it can take 5-10 minutes to propagate. Wait before
                    testing again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Configuration */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-4">🔧 Supabase Configuration</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">1. In Supabase Dashboard:</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Go to Authentication → Providers</li>
                    <li>Enable Google provider</li>
                    <li>Add your Google Client ID and Client Secret</li>
                    <li>Make sure "Enable sign up" is checked</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Site URL Configuration:</h4>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-blue-700 mb-2">Set your Site URL to:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 p-1 rounded">{window.location.origin}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(window.location.origin)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. Redirect URLs:</h4>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-blue-700 mb-2">Add these redirect URLs:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-gray-100 p-1 rounded">
                          {window.location.origin}/auth/callback
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${window.location.origin}/auth/callback`)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-gray-100 p-1 rounded">
                          http://localhost:3000/auth/callback
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard("http://localhost:3000/auth/callback")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Button */}
          <div className="flex gap-4">
            <Button onClick={runGoogleOAuthDiagnostics} disabled={testing} className="flex-1">
              {testing ? "Running Diagnostics..." : "🔍 Run OAuth Diagnostics"}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("https://console.cloud.google.com/apis/credentials", "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Google Console
            </Button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">🔍 Diagnostic Results:</h3>
              {results.map((result, index) => (
                <Card
                  key={index}
                  className={
                    result.status === "error" ? "border-red-200" : result.status === "success" ? "border-green-200" : ""
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(result.status)}
                      <h4 className="font-medium">{result.test}</h4>
                    </div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                    <p className="text-xs text-muted-foreground mt-1">{result.timestamp}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Mobile Specific Issues */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-purple-800 mb-4">📱 Mobile-Specific Issues</h3>
              <div className="space-y-3 text-sm text-purple-700">
                <div>
                  <h4 className="font-medium">Common mobile OAuth issues:</h4>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Mobile browsers may have stricter security policies</li>
                    <li>Some mobile browsers block third-party cookies</li>
                    <li>iOS Safari has additional restrictions on redirects</li>
                    <li>Make sure your domain is properly configured in Google Console</li>
                  </ul>
                </div>
                <div className="bg-purple-100 p-3 rounded">
                  <p className="font-medium">💡 Quick Test:</p>
                  <p>Try the OAuth flow on desktop first to verify the configuration works, then test on mobile.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

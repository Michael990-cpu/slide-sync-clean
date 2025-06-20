"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { signUp } from "@/lib/auth"
import Link from "next/link"
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { signInWithGoogle, isGoogleOAuthReady } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email || !password || !fullName) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await signUp(email, password, fullName)

      if (signUpError) {
        setError(signUpError.message || "Failed to create account")
        toast({
          title: "Error creating account",
          description: signUpError.message || "Please try again",
          variant: "destructive",
        })
      } else if (data?.user) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
        router.push("/login?message=Please check your email to verify your account")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch (error) {
      setError("Network error. Please check your connection.")
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError("")

    try {
      console.log("🎯 Google signup button clicked")

      await signInWithGoogle()

      // If we get here without error, the redirect should have happened
      toast({
        title: "Redirecting to Google",
        description: "Please wait while we redirect you to Google...",
      })

      // Wait a bit to see if redirect happens
      setTimeout(() => {
        if (googleLoading) {
          toast({
            title: "Redirect issue",
            description: "If you weren't redirected, please check the debug page for details.",
            variant: "destructive",
          })
          setGoogleLoading(false)
        }
      }, 5000)
    } catch (error: any) {
      console.error("🔥 Google signup error:", error)

      setError(`Google authentication failed: ${error.message}`)
      toast({
        title: "Google signup failed",
        description: error.message || "Please try again or use email signup.",
        variant: "destructive",
      })
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl mb-2">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center">
              S
            </div>
            <span>SlideSync</span>
          </div>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start creating amazing slideshows today</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* Google OAuth Status */}
          <div className="mb-4 p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isGoogleOAuthReady ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm font-medium">Google OAuth: {isGoogleOAuthReady ? "Ready" : "Not Ready"}</span>
              </div>
              <Link href="/debug">
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Debug
                </Button>
              </Link>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
              disabled={loading || googleLoading || !isGoogleOAuthReady}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {googleLoading
                ? "Connecting to Google..."
                : !isGoogleOAuthReady
                  ? "Google OAuth (Not Ready)"
                  : "Continue with Google"}
            </Button>
          </div>

          <Separator className="my-4" />

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading || googleLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || googleLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading || googleLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

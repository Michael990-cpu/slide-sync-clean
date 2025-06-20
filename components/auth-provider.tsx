"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  isGoogleOAuthReady: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  isGoogleOAuthReady: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGoogleOAuthReady, setIsGoogleOAuthReady] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Check if Google OAuth is ready
    checkGoogleOAuthStatus()

    return () => subscription.unsubscribe()
  }, [])

  const checkGoogleOAuthStatus = async () => {
    try {
      // Check auth settings to see if Google is enabled
      const response = await fetch(`${supabase.supabaseUrl}/auth/v1/settings`, {
        headers: {
          apikey: supabase.supabaseKey,
          Authorization: `Bearer ${supabase.supabaseKey}`,
        },
      })

      if (response.ok) {
        const settings = await response.json()
        console.log("Auth settings:", settings)

        // Check if Google is in the external providers
        const hasGoogle =
          settings.external?.google || (settings.external_providers && settings.external_providers.includes("google"))

        console.log("Google OAuth available:", hasGoogle)
        setIsGoogleOAuthReady(hasGoogle)
      } else {
        console.log("Could not fetch auth settings")
        setIsGoogleOAuthReady(false)
      }
    } catch (error) {
      console.log("Error checking Google OAuth status:", error)
      setIsGoogleOAuthReady(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    try {
      console.log("🚀 Starting Google OAuth flow...")
      console.log("Current URL:", window.location.origin)
      console.log("Redirect URL:", `${window.location.origin}/auth/callback`)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("📊 Google OAuth response:", { data, error })

      if (error) {
        console.error("❌ Google OAuth error:", error)
        throw new Error(`Google OAuth failed: ${error.message}`)
      }

      if (data?.url) {
        console.log("🔗 Redirecting to:", data.url)
        // The redirect should happen automatically, but let's log it
      } else {
        console.log("⚠️ No redirect URL returned")
      }
    } catch (error: any) {
      console.error("💥 Google sign in failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle, isGoogleOAuthReady }}>
      {children}
    </AuthContext.Provider>
  )
}

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://qgrgitqodfoharf wffnx.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncmdpdHFvZGZvaGFyZndmZm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzE5NTgsImV4cCI6MjA2NTY0Nzk1OH0.FaHfV-gS1Oc7bffazZ6yGu3rl4giAAq9Dxz3L5rvwg4"

// Fix the URL - remove the space in the middle
const correctedUrl = supabaseUrl.replace(/\s+/g, "")

console.log("Supabase URL:", correctedUrl)
console.log("Supabase Key:", supabaseAnonKey ? "Present" : "Missing")

export const supabase = createClient(correctedUrl, supabaseAnonKey)

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  console.log("Supabase connection test:", { data: !!data, error })
})

// Types for our database
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  subscription_tier: "free" | "premium"
  created_at: string
}

export interface Slideshow {
  id: string
  user_id: string
  title: string
  description?: string
  images: string[]
  transition: string
  text_overlays: any[]
  music?: string
  settings: any
  created_at: string
  updated_at: string
}

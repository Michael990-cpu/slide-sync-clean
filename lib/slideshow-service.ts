import { supabase } from "./supabase"
import type { Slideshow } from "./supabase"

export const createSlideshow = async (slideshow: Omit<Slideshow, "id" | "created_at" | "updated_at">) => {
  try {
    const { data, error } = await supabase.from("slideshows").insert([slideshow]).select().single()

    if (error) {
      console.error("Create slideshow error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Slideshow service error:", error)
    throw error
  }
}

export const updateSlideshow = async (id: string, updates: Partial<Slideshow>) => {
  try {
    const { data, error } = await supabase
      .from("slideshows")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Update slideshow error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Slideshow service error:", error)
    throw error
  }
}

export const getSlideshow = async (id: string) => {
  try {
    const { data, error } = await supabase.from("slideshows").select("*").eq("id", id).single()

    if (error) {
      console.error("Get slideshow error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Slideshow service error:", error)
    throw error
  }
}

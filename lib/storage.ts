import { supabase } from "./supabase"

export const uploadImage = async (file: File, userId: string) => {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("slideshow-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      throw error
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("slideshow-images").getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error("Storage error:", error)
    throw error
  }
}

export const deleteImage = async (filePath: string) => {
  try {
    const { error } = await supabase.storage.from("slideshow-images").remove([filePath])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Delete error:", error)
    throw error
  }
}

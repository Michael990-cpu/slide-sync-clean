import { supabase } from "./supabase"

export const signUp = async (email: string, password: string, fullName?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      console.error("Supabase signUp error:", error)
    }

    return { data, error }
  } catch (err) {
    console.error("Network or other error:", err)
    return {
      data: null,
      error: {
        message: "Network error. Please check your connection and try again.",
        name: "NetworkError",
      },
    }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Supabase signIn error:", error)
    }

    return { data, error }
  } catch (err) {
    console.error("Network or other error:", err)
    return {
      data: null,
      error: {
        message: "Network error. Please check your connection and try again.",
        name: "NetworkError",
      },
    }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (err) {
    console.error("Sign out error:", err)
    return { error: { message: "Error signing out" } }
  }
}

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (err) {
    console.error("Get user error:", err)
    return null
  }
}

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    return { data, error }
  } catch (err) {
    console.error("Google sign in error:", err)
    return {
      data: null,
      error: {
        message: "Error with Google sign in. Please try again.",
        name: "GoogleSignInError",
      },
    }
  }
}

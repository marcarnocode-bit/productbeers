import { supabase } from "./supabase"

export type UploadResult = {
  url: string
  path: string
  error?: string
}

export async function uploadFile(
  file: File,
  bucket: "event-images" | "resource-files" | "user-avatars",
  folder?: string,
): Promise<UploadResult> {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return { url: "", path: "", error: "Usuario no autenticado" }
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : `${user.id}/${fileName}`

    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Upload error:", error)
      return { url: "", path: "", error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path,
      error: undefined,
    }
  } catch (error: any) {
    console.error("Upload error:", error)
    return { url: "", path: "", error: error.message || "Error al subir archivo" }
  }
}

export async function deleteFile(bucket: string, path: string): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Delete error:", error)
      return { error: error.message }
    }

    return {}
  } catch (error: any) {
    console.error("Delete error:", error)
    return { error: error.message || "Error al eliminar archivo" }
  }
}

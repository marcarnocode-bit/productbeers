"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { User, Plus, X, AlertCircle, CheckCircle } from 'lucide-react'
import { Profile } from "@/types/database"

type ProfileForm = {
  bio: string
  company: string
  position: string
  skills: string[]
  interests: string[]
  linkedin_url: string
  twitter_url: string
  website_url: string
  is_public: boolean
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mb-8" />
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PerfilPage() {
  const { loading, user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [form, setForm] = useState<ProfileForm>({
    bio: "",
    company: "",
    position: "",
    skills: [],
    interests: [],
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
    is_public: false,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?redirect=/perfil")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setProfile(data)
        setForm({
          bio: data.bio || "",
          company: data.company || "",
          position: data.position || "",
          skills: data.skills || [],
          interests: data.interests || [],
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
          website_url: data.website_url || "",
          is_public: data.is_public,
        })
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingProfile(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión para actualizar tu perfil.")
      }

      const payload = {
        user_id: user.id,
        bio: form.bio.trim() || null,
        company: form.company.trim() || null,
        position: form.position.trim() || null,
        skills: form.skills.length > 0 ? form.skills : null,
        interests: form.interests.length > 0 ? form.interests : null,
        linkedin_url: form.linkedin_url.trim() || null,
        twitter_url: form.twitter_url.trim() || null,
        website_url: form.website_url.trim() || null,
        is_public: form.is_public,
        updated_at: new Date().toISOString(),
      }

      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", profile.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase
          .from("profiles")
          .insert(payload)

        if (error) throw error
      }

      setSuccess("Perfil actualizado exitosamente.")
      await fetchProfile()
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar el perfil.")
    } finally {
      setSaving(false)
    }
  }

  function addSkill() {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(f => ({ ...f, skills: [...f.skills, newSkill.trim()] }))
      setNewSkill("")
    }
  }

  function removeSkill(skill: string) {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))
  }

  function addInterest() {
    if (newInterest.trim() && !form.interests.includes(newInterest.trim())) {
      setForm(f => ({ ...f, interests: [...f.interests, newInterest.trim()] }))
      setNewInterest("")
    }
  }

  function removeInterest(interest: string) {
    setForm(f => ({ ...f, interests: f.interests.filter(i => i !== interest) }))
  }

  if (loading || loadingProfile) return <ProfileSkeleton />

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Inicia sesión</h1>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para ver tu perfil.
          </p>
          <Button onClick={() => router.push("/auth/signin?redirect=/perfil")} className="btn-primary">
            Iniciar sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">
            Configura tu información personal y profesional
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="form-status">
              <div id="form-status" className="sr-only" aria-live="polite" aria-atomic="true">
                {error || success || ""}
              </div>

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3" role="alert">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    placeholder="Cuéntanos sobre ti, tu experiencia y tus intereses..."
                  />
                </div>

                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Ej: Tech Solutions Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={form.position}
                    onChange={(e) => setForm(f => ({ ...f, position: e.target.value }))}
                    placeholder="Ej: Desarrollador Frontend"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <Label>Habilidades</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Añadir habilidad..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <Label>Intereses</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Añadir interés..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                  />
                  <Button type="button" onClick={addInterest} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/in/tu-perfil"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_url">Twitter</Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={form.twitter_url}
                    onChange={(e) => setForm(f => ({ ...f, twitter_url: e.target.value }))}
                    placeholder="https://twitter.com/tu-usuario"
                  />
                </div>

                <div>
                  <Label htmlFor="website_url">Sitio web</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={form.website_url}
                    onChange={(e) => setForm(f => ({ ...f, website_url: e.target.value }))}
                    placeholder="https://tu-sitio.com"
                  />
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_public"
                  checked={form.is_public}
                  onCheckedChange={(checked) => setForm(f => ({ ...f, is_public: !!checked }))}
                />
                <Label htmlFor="is_public">Hacer mi perfil público</Label>
                <p className="text-sm text-gray-500">
                  Tu perfil aparecerá en la página de comunidad
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-4 pt-6">
                <Button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

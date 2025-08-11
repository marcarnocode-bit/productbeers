"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, AlertCircle, Bold, Italic, Underline, LinkIcon, List, Edit, Trash2 } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import type { UploadResult } from "@/lib/storage"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type EventRow = {
  id: string
  title: string
}

type ResourceForm = {
  title: string
  description: string | null // almacenaremos HTML
  url: string | null
  file_path: string | null
  resource_type: "document" | "video" | "link" | "template" | "article"
  event_id: string | null
}

type ResourceInsert = ResourceForm & {
  created_by: string
}

type Resource = {
  id: string
  title: string
  description: string | null
  url: string | null
  file_path: string | null
  resource_type: "document" | "video" | "link" | "template" | "article"
  event_id: string | null
  created_by: string
  created_at: string
  events?: { title: string }
}

// Sanea caracteres BiDi de control que pueden invertir dirección
function stripBidiControls(s: string) {
  // LRM, RLM, RLE, RLO, LRE, PDF, LRI, RLI, FSI, PDI, etc.
  return s.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
}

function sanitizeHtml(html: string) {
  const cleanedText = stripBidiControls(html)
  const parser = new DOMParser()
  const doc = parser.parseFromString(cleanedText, "text/html")

  // Eliminar dir y direction de style para evitar forzar RTL/LTR
  doc.querySelectorAll("[dir]").forEach((el) => el.removeAttribute("dir"))
  doc.querySelectorAll("[style]").forEach((el) => {
    const style = el.getAttribute("style") || ""
    if (/direction\s*:/.test(style)) {
      const newStyle = style.replace(/direction\s*:\s*(rtl|ltr)\s*;?/gi, "").trim()
      if (newStyle) el.setAttribute("style", newStyle)
      else el.removeAttribute("style")
    }
  })
  return doc.body.innerHTML
}

function wrapSelectionWithTag(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after: string,
) {
  const start = Math.min(selectionStart, selectionEnd)
  const end = Math.max(selectionStart, selectionEnd)
  const selected = value.slice(start, end)
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end)
  const newCursor = start + before.length + selected.length + after.length
  return { newValue, newCursor }
}

function wrapSelectionAsList(value: string, selectionStart: number, selectionEnd: number) {
  const start = Math.min(selectionStart, selectionEnd)
  const end = Math.max(selectionStart, selectionEnd)
  const selected = value.slice(start, end)
  const lines = selected.split(/\r?\n/)
  const items = lines.map((l) => `<li>${l || ""}</li>`).join("")
  const html = `<ul>${items}</ul>`
  const newValue = value.slice(0, start) + html + value.slice(end)
  const newCursor = start + html.length
  return { newValue, newCursor }
}

export default function RecursosDashboardPage() {
  const { loading, user, isOrganizer, isAdmin } = useAuth()
  const router = useRouter()

  const [events, setEvents] = useState<EventRow[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<ResourceForm>({
    title: "",
    description: "",
    url: "",
    file_path: "",
    resource_type: "article",
    event_id: null,
  })

  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [editForm, setEditForm] = useState<ResourceForm>({
    title: "",
    description: "",
    url: "",
    file_path: "",
    resource_type: "article",
    event_id: null,
  })
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Editor (textarea) refs y estado
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)
  const editorValue = useMemo(() => form.description ?? "", [form.description])
  const editEditorValue = useMemo(() => editForm.description ?? "", [editForm.description])

  useEffect(() => {
    if (!loading && (!user || (!isOrganizer && !isAdmin))) {
      router.replace("/auth/signin?redirect=/dashboard/recursos")
    }
  }, [loading, user, isOrganizer, isAdmin, router])

  useEffect(() => {
    fetchInitial()
  }, [])

  async function fetchInitial() {
    const [{ data: ev }, { data: rc }] = await Promise.all([
      supabase.from("events").select("id, title").order("start_date"),
      supabase.from("resources").select("*, events(title)").order("created_at", { ascending: false }),
    ])
    setEvents(ev || [])
    setResources(rc || [])
  }

  const resourceTypes = [
    { value: "article", label: "Artículo" },
    { value: "document", label: "Documento" },
    { value: "video", label: "Video" },
    { value: "link", label: "Enlace" },
    { value: "template", label: "Plantilla" },
  ] as const

  function applyFormat(type: "bold" | "italic" | "underline" | "link" | "list", isEdit = false) {
    const el = isEdit ? editTextareaRef.current : textareaRef.current
    if (!el) return

    const { selectionStart, selectionEnd, value } = el
    let result = { newValue: value, newCursor: selectionEnd }

    if (type === "bold") {
      result = wrapSelectionWithTag(value, selectionStart, selectionEnd, "<strong>", "</strong>")
    } else if (type === "italic") {
      result = wrapSelectionWithTag(value, selectionStart, selectionEnd, "<em>", "</em>")
    } else if (type === "underline") {
      result = wrapSelectionWithTag(value, selectionStart, selectionEnd, "<u>", "</u>")
    } else if (type === "link") {
      const url = window.prompt("Introduce la URL")
      if (!url) return
      result = wrapSelectionWithTag(
        value,
        selectionStart,
        selectionEnd,
        `<a href="${url}" target="_blank" rel="noopener noreferrer">`,
        "</a>",
      )
    } else if (type === "list") {
      result = wrapSelectionAsList(value, selectionStart, selectionEnd)
    }

    const sanitized = sanitizeHtml(result.newValue)
    if (isEdit) {
      setEditForm((f) => ({ ...f, description: sanitized }))
    } else {
      setForm((f) => ({ ...f, description: sanitized }))
    }

    requestAnimationFrame(() => {
      const targetRef = isEdit ? editTextareaRef.current : textareaRef.current
      if (targetRef) {
        targetRef.focus()
        targetRef.selectionStart = targetRef.selectionEnd = Math.min(sanitized.length, result.newCursor)
      }
    })
  }

  function onTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>, isEdit = false) {
    const val = stripBidiControls(e.target.value)
    if (isEdit) {
      setEditForm((f) => ({ ...f, description: val }))
    } else {
      setForm((f) => ({ ...f, description: val }))
    }
  }

  function onTextareaPaste(e: React.ClipboardEvent<HTMLTextAreaElement>, isEdit = false) {
    // pegar como texto plano + saneado
    e.preventDefault()
    const text = e.clipboardData?.getData("text/plain") || ""
    const sanitized = stripBidiControls(text)
    const el = isEdit ? editTextareaRef.current : textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const currentDescription = isEdit ? editForm.description : form.description
    const newVal = (currentDescription ?? "").slice(0, start) + sanitized + (currentDescription ?? "").slice(end)

    if (isEdit) {
      setEditForm((f) => ({ ...f, description: newVal }))
    } else {
      setForm((f) => ({ ...f, description: newVal }))
    }

    requestAnimationFrame(() => {
      const targetRef = isEdit ? editTextareaRef.current : textareaRef.current
      if (targetRef) {
        const pos = start + sanitized.length
        targetRef.selectionStart = targetRef.selectionEnd = pos
      }
    })
  }

  async function createResource(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (!user) throw new Error("Debes iniciar sesión para crear recursos.")

      // Sanea antes de guardar como HTML
      const html = sanitizeHtml((form.description ?? "").trim())

      const payload: ResourceInsert = {
        ...form,
        title: form.title.trim(),
        description: html || null,
        url: form.url?.trim() || null,
        file_path: form.file_path?.trim() || null,
        created_by: user.id,
      }

      const { error } = await supabase.from("resources").insert(payload)
      if (error) throw error

      setCreating(false)
      setForm({
        title: "",
        description: "",
        url: "",
        file_path: "",
        resource_type: "article",
        event_id: null,
      })
      await fetchInitial()
    } catch (err: any) {
      setError(err.message || "No se pudo crear el recurso.")
    } finally {
      setSaving(false)
    }
  }

  function startEdit(resource: Resource) {
    setEditingResource(resource)
    setEditForm({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      file_path: resource.file_path,
      resource_type: resource.resource_type,
      event_id: resource.event_id,
    })
    setError(null)
  }

  async function updateResource(e: React.FormEvent) {
    e.preventDefault()
    if (!editingResource) return

    setError(null)
    setSaving(true)
    try {
      const html = sanitizeHtml((editForm.description ?? "").trim())

      const payload = {
        title: editForm.title.trim(),
        description: html || null,
        url: editForm.url?.trim() || null,
        file_path: editForm.file_path?.trim() || null,
        resource_type: editForm.resource_type,
        event_id: editForm.event_id,
      }

      const { error } = await supabase.from("resources").update(payload).eq("id", editingResource.id)

      if (error) throw error

      setEditingResource(null)
      await fetchInitial()
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar el recurso.")
    } finally {
      setSaving(false)
    }
  }

  async function deleteResource() {
    if (!deletingResource) return

    setDeleting(true)
    try {
      const { error } = await supabase.from("resources").delete().eq("id", deletingResource.id)

      if (error) throw error

      setDeletingResource(null)
      await fetchInitial()
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el recurso.")
    } finally {
      setDeleting(false)
    }
  }

  const handleImageUpload = (result: UploadResult, isEdit = false) => {
    if (result.error) {
      setError(result.error)
    } else {
      if (isEdit) {
        setEditForm((f) => ({ ...f, file_path: result.url }))
      } else {
        setForm((f) => ({ ...f, file_path: result.url }))
      }
      setError(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recursos</h1>
          <p className="text-gray-600">Gestiona los recursos que aparecerán en la biblioteca pública.</p>
        </div>
        <Button className="btn-primary" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo recurso
        </Button>
      </div>

      {creating && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Recurso</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={createResource} aria-describedby="resource-status">
              <div id="resource-status" className="sr-only" aria-live="polite" aria-atomic="true">
                {error || ""}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={form.resource_type}
                    onValueChange={(v: any) => setForm((f) => ({ ...f, resource_type: v }))}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Artículo</SelectItem>
                      <SelectItem value="document">Documento</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="link">Enlace</SelectItem>
                      <SelectItem value="template">Plantilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="url">URL (enlace / vídeo / artículo)</Label>
                  <Input
                    id="url"
                    placeholder="https://..."
                    value={form.url ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  />
                </div>
                <div>
                  <FileUpload
                    label="Imagen del recurso (opcional)"
                    bucket="resource-files"
                    currentUrl={form.file_path || undefined}
                    onUpload={(result) => handleImageUpload(result, false)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <Label>Descripción (editor rápido)</Label>
                <div className="flex flex-wrap items-center gap-2 rounded-md border bg-white p-2">
                  <button
                    type="button"
                    onClick={() => applyFormat("bold", false)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Negrita"
                    title="Negrita"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("italic", false)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Cursiva"
                    title="Cursiva"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("underline", false)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Subrayado"
                    title="Subrayado"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("link", false)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Insertar enlace"
                    title="Insertar enlace"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("list", false)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Lista"
                    title="Lista"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
                  dir="ltr"
                  lang="es"
                  className="mt-2 min-h-40 w-full rounded-md border bg-white p-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
                  placeholder="Escribe aquí... Puedes seleccionar texto y aplicar formato con la barra superior. Se guardará como HTML básico."
                  value={editorValue || ""}
                  onChange={(e) => onTextareaChange(e, false)}
                  onPaste={(e) => onTextareaPaste(e, false)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Consejo: selecciona texto y usa los botones para dar formato. Se guardará como HTML.
                </p>
              </div>

              {error && (
                <p
                  className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button type="button" className="btn-ghost" onClick={() => setCreating(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : "Crear"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-gray-600">Aún no hay recursos.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((r) => (
                <div key={r.id} className="rounded-lg border p-4 bg-white">
                  {r.file_path && (
                    <div className="mb-2 h-28 w-full overflow-hidden rounded-md">
                      <img
                        src={r.file_path || "/placeholder.svg?height=200&width=400&query=resource-image"}
                        alt={r.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">{r.title}</div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border">{r.resource_type}</span>
                  </div>
                  {r.description && (
                    <div
                      dir="ltr"
                      className="prose prose-sm max-w-none text-gray-700 line-clamp-5"
                      dangerouslySetInnerHTML={{ __html: r.description }}
                    />
                  )}
                  {r.events?.title && <p className="text-xs text-gray-500 mt-2">Evento: {r.events.title}</p>}

                  <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" variant="outline" onClick={() => startEdit(r)} className="h-8 px-2">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingResource(r)}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Recurso</DialogTitle>
            <DialogDescription>Modifica los detalles del recurso seleccionado.</DialogDescription>
          </DialogHeader>

          {editingResource && (
            <form className="grid gap-4" onSubmit={updateResource}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-type">Tipo</Label>
                  <Select
                    value={editForm.resource_type}
                    onValueChange={(v: any) => setEditForm((f) => ({ ...f, resource_type: v }))}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Artículo</SelectItem>
                      <SelectItem value="document">Documento</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="link">Enlace</SelectItem>
                      <SelectItem value="template">Plantilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-url">URL (enlace / vídeo / artículo)</Label>
                  <Input
                    id="edit-url"
                    placeholder="https://..."
                    value={editForm.url ?? ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, url: e.target.value }))}
                  />
                </div>
                <div>
                  <FileUpload
                    label="Imagen del recurso (opcional)"
                    bucket="resource-files"
                    currentUrl={editForm.file_path || undefined}
                    onUpload={(result) => handleImageUpload(result, true)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <Label>Descripción (editor rápido)</Label>
                <div className="flex flex-wrap items-center gap-2 rounded-md border bg-white p-2">
                  <button
                    type="button"
                    onClick={() => applyFormat("bold", true)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Negrita"
                    title="Negrita"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("italic", true)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Cursiva"
                    title="Cursiva"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("underline", true)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Subrayado"
                    title="Subrayado"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("link", true)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Insertar enlace"
                    title="Insertar enlace"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("list", true)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                    aria-label="Lista"
                    title="Lista"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  ref={editTextareaRef}
                  dir="ltr"
                  lang="es"
                  className="mt-2 min-h-40 w-full rounded-md border bg-white p-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
                  placeholder="Escribe aquí... Puedes seleccionar texto y aplicar formato con la barra superior. Se guardará como HTML básico."
                  value={editEditorValue || ""}
                  onChange={(e) => onTextareaChange(e, true)}
                  onPaste={(e) => onTextareaPaste(e, true)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Consejo: selecciona texto y usa los botones para dar formato. Se guardará como HTML.
                </p>
              </div>

              {error && (
                <p
                  className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingResource(null)} disabled={saving}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Actualizar"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingResource} onOpenChange={() => setDeletingResource(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar recurso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El recurso "{deletingResource?.title}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteResource} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

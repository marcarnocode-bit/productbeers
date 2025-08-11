"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { uploadFile, type UploadResult } from "@/lib/storage"

interface FileUploadProps {
  label: string
  accept?: string
  bucket: "event-images" | "resource-files" | "user-avatars"
  folder?: string
  currentUrl?: string
  onUpload: (result: UploadResult) => void
  disabled?: boolean
  className?: string
}

export function FileUpload({
  label,
  accept = "image/*",
  bucket,
  folder,
  currentUrl,
  onUpload,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    if (accept === "image/*" && !file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo debe ser menor a 5MB")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const result = await uploadFile(file, bucket, folder)
      onUpload(result)

      if (result.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || "Error al subir archivo")
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const clearFile = () => {
    onUpload({ url: "", path: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setError(null)
  }

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700 mb-2 block">{label}</Label>

      {currentUrl ? (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={currentUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              onClick={clearFile}
              disabled={disabled || uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Cambiar imagen
          </Button>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragOver ? "border-brand-primary bg-brand-primary/5" : "border-gray-300 hover:border-gray-400"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm text-gray-600">Subiendo archivo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Arrastra una imagen aquí o{" "}
                <span className="text-brand-primary font-medium">haz clic para seleccionar</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2 mt-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  )
}

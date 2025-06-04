"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileUp, File, X, Loader2, CheckCircle2, Brain, Lightbulb } from "lucide-react"

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setProgress(0)
    setIsUploading(false)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)

    // Simular carga
    let currentProgress = 0
    const uploadInterval = setInterval(() => {
      currentProgress += 20
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(uploadInterval)
        setIsUploading(false)
        setIsAnalyzing(true)

        // Simular análisis con IA
        setTimeout(() => {
          setIsAnalyzing(false)
          setAnalysisComplete(true)
        }, 3000)
      }
    }, 300)
  }

  const handleGenerateContent = (type: "quiz" | "flashcards") => {
    if (type === "quiz") {
      router.push("/dashboard/preview?type=quiz")
    } else {
      router.push("/dashboard/preview?type=flashcards")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subir material de estudio</h1>
        <p className="text-gray-600">
          Sube tus apuntes, libros o material de estudio para generar cuestionarios y flashcards automáticamente.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                Subir archivo
              </CardTitle>
              <CardDescription>
                Arrastra y suelta un archivo o haz clic para seleccionarlo. Formatos soportados: PDF, JPG, PNG, DOCX.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="rounded-full bg-gray-100 p-4">
                      <FileUp className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Arrastra y suelta tu archivo aquí o{" "}
                        <label className="text-blue-600 cursor-pointer hover:underline">
                          búscalo en tu dispositivo
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Máximo 25MB por archivo</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <File className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      disabled={isUploading || isAnalyzing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {(isUploading || isAnalyzing) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isAnalyzing && <Brain className="h-4 w-4 text-blue-600" />}
                          {isUploading ? "Subiendo archivo..." : "Analizando contenido con IA..."}
                        </span>
                        <span>{isUploading ? `${progress}%` : "Procesando..."}</span>
                      </div>
                      <Progress value={isUploading ? progress : 100} className="h-2" />
                      {isAnalyzing && (
                        <p className="text-xs text-gray-500">
                          Estamos extrayendo conceptos clave y generando preguntas relevantes...
                        </p>
                      )}
                    </div>
                  )}

                  {analysisComplete && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">¡Análisis completado!</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Button onClick={() => handleGenerateContent("quiz")} className="flex items-center gap-2">
                          <FileUp className="h-4 w-4" />
                          Generar cuestionario
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleGenerateContent("flashcards")}
                          className="flex items-center gap-2"
                        >
                          <FileUp className="h-4 w-4" />
                          Crear flashcards
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {file && !analysisComplete && (
              <CardFooter>
                <Button onClick={handleUpload} disabled={isUploading || isAnalyzing} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analizando...
                    </>
                  ) : (
                    "Subir y analizar"
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>

          {analysisComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Conceptos extraídos
                </CardTitle>
                <CardDescription>Hemos identificado los siguientes temas principales en tu material</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Fotosíntesis</Badge>
                  <Badge variant="secondary">Respiración celular</Badge>
                  <Badge variant="secondary">Mitocondria</Badge>
                  <Badge variant="secondary">Cloroplastos</Badge>
                  <Badge variant="secondary">ATP</Badge>
                  <Badge variant="secondary">Glucosa</Badge>
                  <Badge variant="secondary">Enzimas</Badge>
                  <Badge variant="secondary">Metabolismo</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consejos para mejores resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="rounded-full bg-blue-100 p-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm">Asegúrate de que el texto sea claro y legible</p>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full bg-blue-100 p-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm">Los PDFs con texto seleccionable funcionan mejor</p>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full bg-blue-100 p-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm">Enfócate en un solo tema por archivo</p>
              </div>
              <div className="flex gap-3">
                <div className="rounded-full bg-blue-100 p-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm">Divide libros largos por capítulos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formatos soportados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-red-600" />
                <span className="text-sm">PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-blue-600" />
                <span className="text-sm">DOCX</span>
              </div>
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-green-600" />
                <span className="text-sm">JPG, PNG</span>
              </div>
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-purple-600" />
                <span className="text-sm">TXT</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

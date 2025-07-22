"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileUp, File, X, Loader2, CheckCircle2, Brain, Lightbulb } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const API_URL = "http://localhost:8000/api/v1";

interface AnalysisInitiatedResponse {
  message: string;
  subtopic_id: number;
  filename: string;
}

interface Subtopic {
  id: number;
  title: string;
  description: string;
}

interface AnalysisResult {
  subtopics: Subtopic[];
}

export default function UploadPage() {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [subtopics, setSubtopics] = useState<Subtopic[]>([])
  const [error, setError] = useState<string | null>(null)
  const [analysisTrackingId, setAnalysisTrackingId] = useState<number | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState<"not_started" | "initiated" | "completed">("not_started")
  const [analysisTime, setAnalysisTime] = useState(0)
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null)
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
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
        setError(null)
      } else {
        setError('Solo se permiten archivos PDF')
      }
    }
  } 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Solo se permiten archivos PDF')
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setProgress(0)
    setIsUploading(false)
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setSubtopics([])
    setError(null)
    setAnalysisTime(0)
    setAnalysisStartTime(null)
  }

  // Timer para mostrar el tiempo de análisis
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isAnalyzing && analysisStartTime) {
      interval = setInterval(() => {
        setAnalysisTime(Math.floor((Date.now() - analysisStartTime) / 1000))
      }, 1000)
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isAnalyzing, analysisStartTime])

  const handleUpload = async () => {
    if (!file || !workspaceId) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/workspaces/${workspaceId}/upload-document/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Error al procesar el documento')
      }

      const result: AnalysisInitiatedResponse = await response.json()
      setAnalysisTrackingId(result.subtopic_id)
      setAnalysisStatus("initiated")
      setProgress(100) // Upload complete
      setIsUploading(false)
      setIsAnalyzing(true)
      setAnalysisStartTime(Date.now())
      setAnalysisTime(0)

      // Implementar polling real para verificar el estado del análisis
      if (token) {
        await pollAnalysisStatus(result.subtopic_id, token)
      }

    } catch (err: any) {
      setError(err.message || 'Error al procesar el documento')
      setAnalysisStatus("not_started")
    } finally {
      setIsUploading(false)
    }
  }

  const pollAnalysisStatus = async (subtopicId: number, token: string) => {
    const maxAttempts = 60 // Máximo 5 minutos (60 * 5 segundos)
    let attempts = 0

    const checkStatus = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/analysis/${subtopicId}/status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Error al verificar el estado del análisis')
        }

        const statusData = await response.json()
        
        if (statusData.status === 'COMPLETED') {
          // Análisis completado exitosamente
          setIsAnalyzing(false)
          setAnalysisComplete(true)
          setAnalysisStatus("completed")
          setSubtopics([
            { id: subtopicId, title: statusData.message || `Topic from ${file?.name}`, description: "Generated from uploaded document" }
          ])
          return
        } else if (statusData.status === 'FAILED') {
          // Análisis falló
          setIsAnalyzing(false)
          setError('El análisis del documento falló. Por favor, intenta de nuevo.')
          setAnalysisStatus("not_started")
          return
        } else if (statusData.status === 'PROCESSING') {
          // Análisis aún en progreso, continuar polling
          attempts++
          if (attempts >= maxAttempts) {
            setIsAnalyzing(false)
            setError('El análisis está tomando más tiempo del esperado. Por favor, verifica más tarde.')
            setAnalysisStatus("not_started")
            return
          }
          
          // Esperar 5 segundos antes del siguiente intento
          setTimeout(checkStatus, 5000)
        }
      } catch (error) {
        console.error('Error polling analysis status:', error)
        attempts++
        if (attempts >= maxAttempts) {
          setIsAnalyzing(false)
          setError('Error al verificar el estado del análisis. Por favor, intenta de nuevo.')
          setAnalysisStatus("not_started")
          return
        }
        
        // En caso de error, esperar 5 segundos antes del siguiente intento
        setTimeout(checkStatus, 5000)
      }
    }

    // Iniciar el polling
    checkStatus()
  }

  const handleGenerateContent = (type: "quiz" | "flashcards") => {
    if (type === "quiz") {
      router.push(`/dashboard/${workspaceId}/quizzes`)
    } else {
      router.push(`/dashboard/${workspaceId}/flashcards`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight mb-1">Subir material de estudio</h1>
        <p className="text-lg text-gray-500 font-medium">
          Sube tus apuntes en formato PDF para generar cuestionarios y flashcards automáticamente.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border-2 border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-2 border-blue-100 rounded-3xl shadow-sm">
            <CardHeader>
              <div className="flex flex-col items-center gap-2 pt-4 pb-2">
                <div className="flex items-center justify-center rounded-full w-20 h-20 mb-2 bg-blue-100">
                  <FileUp className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-extrabold text-blue-700 uppercase tracking-wide text-center">
                  Subir archivo
                </CardTitle>
                <CardDescription className="text-center text-gray-500 text-base font-medium">
                  Arrastra y suelta un archivo PDF o haz clic para seleccionarlo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-blue-200 hover:border-blue-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="rounded-full bg-blue-100 p-6">
                      <FileUp className="h-10 w-10 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-700">
                        Arrastra y suelta tu archivo PDF aquí o{" "}
                        <label className="text-blue-600 cursor-pointer hover:underline">
                          búscalo en tu dispositivo
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Solo se permiten archivos PDF</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl border-2 border-blue-100 p-4">
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
                          {isAnalyzing && <Brain className="h-4 w-4 text-blue-600 animate-pulse" />}
                          {isUploading ? "Subiendo archivo..." : "Analizando contenido con IA..."}
                        </span>
                        <span className="text-blue-600 font-medium">
                          {isUploading ? `${progress}%` : `${analysisTime}s`}
                        </span>
                      </div>
                      <Progress value={isUploading ? progress : 100} className="h-2" />
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600 font-medium">
                            Procesando documento con inteligencia artificial...
                          </p>
                          <div className="text-xs text-gray-400 space-y-1">
                            <p>• Extrayendo conceptos clave del documento</p>
                            <p>• Generando preguntas de comprensión</p>
                            <p>• Creando flashcards para memorización</p>
                            <p>• Optimizando contenido para tu aprendizaje</p>
                          </div>
                          <p className="text-xs text-blue-500 font-medium mt-2">
                            ⏱️ Tiempo estimado: 2-5 minutos
                          </p>
                        </div>
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
                        <Button onClick={() => handleGenerateContent("quiz")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold text-base shadow-md">
                          <FileUp className="h-4 w-4" />
                          Generar cuestionario
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleGenerateContent("flashcards")}
                          className="flex items-center gap-2 border-blue-200 rounded-xl py-3 font-bold text-base"
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
                <Button onClick={handleUpload} disabled={isUploading || isAnalyzing} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold text-base shadow-md">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo archivo...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-pulse" />
                      Analizando con IA ({analysisTime}s)
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Subir y analizar con IA
                    </>
                  )}
                </Button>
                {isAnalyzing && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    ⏱️ El análisis puede tomar entre 2-5 minutos dependiendo del tamaño del documento
                  </p>
                )}
              </CardFooter>
            )}
          </Card>

          {analysisComplete && (
            <Card className="border-2 border-blue-100 rounded-3xl shadow-sm">
              <CardHeader>
                <div className="flex flex-col items-center gap-2 pt-4 pb-2">
                  <div className="flex items-center justify-center rounded-full w-16 h-16 mb-2 bg-yellow-100">
                    <Lightbulb className="h-8 w-8 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg font-extrabold text-yellow-700 uppercase tracking-wide text-center">
                    Subtópicos identificados
                  </CardTitle>
                  <CardDescription className="text-center text-gray-500 text-base font-medium">
                    Hemos identificado los siguientes subtópicos en tu material
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {subtopics.map((subtopic) => (
                    <Badge key={subtopic.id} variant="secondary">
                      {subtopic.title}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card className="border-2 border-blue-100 rounded-3xl shadow-sm">
            <CardHeader>
              <div className="flex flex-col items-center gap-2 pt-4 pb-2">
                <div className="flex items-center justify-center rounded-full w-14 h-14 mb-2 bg-blue-100">
                  <CheckCircle2 className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-extrabold text-blue-700 uppercase tracking-wide text-center">
                  Consejos para mejores resultados
                </CardTitle>
              </div>
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

          <Card className="border-2 border-blue-100 rounded-3xl shadow-sm">
            <CardHeader>
              <div className="flex flex-col items-center gap-2 pt-4 pb-2">
                <div className="flex items-center justify-center rounded-full w-14 h-14 mb-2 bg-red-100">
                  <File className="h-7 w-7 text-red-600" />
                </div>
                <CardTitle className="text-lg font-extrabold text-red-600 uppercase tracking-wide text-center">
                  Formato soportado
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-red-600" />
                <span className="text-sm">PDF</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

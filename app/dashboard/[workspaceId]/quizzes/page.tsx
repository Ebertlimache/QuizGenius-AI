"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";

export default function QuizzesIndexPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  const [subtopics, setSubtopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubtopics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch(`http://localhost:8000/api/v1/workspaces/${workspaceId}/subtopics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudieron cargar los subtemas");
        const data = await res.json();
        setSubtopics(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar los subtemas");
      } finally {
        setLoading(false);
      }
    };
    fetchSubtopics();
  }, [workspaceId, router]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center rounded-full w-20 h-20 mb-2 bg-green-100">
          <FileQuestion className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-green-700 mb-1 uppercase tracking-wide text-center">Selecciona un subtópico</h2>
        <p className="text-gray-500 max-w-md text-center text-base font-medium">
          Para ver los cuestionarios, selecciona un subtópico:
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {loading ? (
          <span className="text-gray-400">Cargando...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          subtopics.map((sub: any, idx: number) => {
            // Colores cíclicos para icono y fondo, empezando en verde
            const colorSets = [
              { icon: 'text-green-600', bg: 'bg-green-100' },
              { icon: 'text-blue-600', bg: 'bg-blue-100' },
              { icon: 'text-purple-600', bg: 'bg-purple-100' },
              { icon: 'text-yellow-600', bg: 'bg-yellow-100' },
              { icon: 'text-pink-600', bg: 'bg-pink-100' },
              { icon: 'text-orange-600', bg: 'bg-orange-100' },
            ];
            const color = colorSets[idx % colorSets.length];
            return (
              <Link
                key={sub.subtopic_id}
                href={`/dashboard/${workspaceId}/quizzes/${sub.subtopic_id}`}
                className={
                  `flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-green-100 bg-white shadow-sm hover:shadow-lg transition-all min-h-[180px] group hover:scale-[1.025]`
                }
              >
                <div className={`flex items-center justify-center rounded-full w-16 h-16 mb-3 ${color.bg}`}>
                  <FileQuestion className={`h-8 w-8 ${color.icon} transition-all group-hover:scale-110`} />
                </div>
                <span className="text-lg font-bold text-green-700 text-center mb-1 truncate w-full">{sub.subtopic_title}</span>
              </Link>
            );
          })
        )}
      </div>
      <p className="text-xs text-gray-400 mt-8 text-center">WorkspaceId: {workspaceId}</p>
    </div>
  );
} 
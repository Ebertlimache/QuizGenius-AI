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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <FileQuestion className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Selecciona un subtópico</h2>
      <p className="text-gray-500 max-w-md mb-6">
        Para ver los cuestionarios, selecciona un subtópico:
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {loading ? (
          <span className="text-gray-400">Cargando...</span>
        ) : error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          subtopics.map((sub: any) => (
            <Link
              key={sub.subtopic_id}
              href={`/dashboard/${workspaceId}/quizzes/${sub.subtopic_id}`}
              className="block w-full py-3 px-4 rounded-lg bg-white hover:bg-blue-50 border border-gray-200 text-gray-800 font-medium shadow-sm transition-all text-left text-base"
            >
              {sub.subtopic_title}
            </Link>
          ))
        )}
      </div>
      <p className="text-xs text-gray-400 mt-6">WorkspaceId: {workspaceId}</p>
    </div>
  );
} 
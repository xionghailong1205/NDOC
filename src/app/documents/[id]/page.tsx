"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { Document } from "@/types";

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Document not found");
          throw new Error("Failed to fetch document");
        }
        const data = await res.json();
        setDoc(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete document");
      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to documents
          </Link>
        </div>
      </div>
    );
  }

  if (!doc) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
            ← Back to Documents
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/documents/${id}/edit`}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{doc.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {doc.categoryName && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {doc.categoryName}
                </span>
              )}
              <span>Created {formatDate(doc.createdAt)}</span>
              {doc.updatedAt !== doc.createdAt && (
                <span>Updated {formatDate(doc.updatedAt)}</span>
              )}
            </div>

            {doc.tags && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-6">
            {doc.content ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {doc.content}
                </pre>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">No content yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button.jsx";
import { FileText, BookOpen, Upload, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../providers/AuthProvider";

export default function ResourcesPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false); // Cloudinary upload
  const [saving, setSaving] = useState(false);       // Firestore write
  const { user } = useAuthContext();

  // Listing state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const goToFreeNotes = () => router.push("/resources?tab=notes");
  const goToBooks = () => router.push("/resources?tab=books");
  const goToUpload = () => fileInputRef.current?.click();

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setStatus("Please select a PDF file (.pdf)");
      e.target.value = "";
      return;
    }
    setStatus("");
    setFile(f);
  };

  // Load list from our GET API
  const loadList = async () => {
    try {
      setLoading(true);
      setLoadError("");
      const res = await fetch(`/api/resources?limit=50`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load resources");
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch (e) {
      setLoadError(e?.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const onDelete = async (item) => {
    if (!confirm(`Delete ${item.title || item.id}?`)) return;
    try {
      const res = await fetch(`/api/resources`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: item.id, url: item.url })
      });
      const json = await res.json();
      if (!res.ok || json?.success !== true) throw new Error(json?.error || 'Delete failed');
      setItems(prev => prev.filter(x => x.id !== item.id));
    } catch (e) {
      alert(e?.message || 'Failed to delete');
    }
  };

  const onUploadViaApi = async () => {
    try {
      // Guard against double-clicks or repeated triggers
      if (uploading || saving) return;
      setStatus("");
      if (!user) {
        setStatus("You must be signed in to upload.");
        return;
      }
      if (!file) {
        setStatus("Select a PDF to upload.");
        return;
      }
      setUploading(true);
      // 1) Send file to our server API for Cloudinary upload
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/resources', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Server upload failed');
      }
      const uploaded = json.result; // Cloudinary response

      // 2) Save metadata in Firestore
      // setUploading(false);
      setSaving(true);
      const docRef = await addDoc(
        collection(db, "resources", "Free pds", "uploads"),
        {
          title: (file.name || "").replace(/\.pdf$/i, ""),
          category: "General",
          filename: file.name,
          size: file.size,
          contentType: file.type,
          cloudinary: {
            public_id: uploaded.public_id,
            secure_url: uploaded.secure_url,
            bytes: uploaded.bytes,
            folder: uploaded.folder || (uploaded.public_id?.includes('/') ? uploaded.public_id.split('/').slice(0, -1).join('/') : 'resources'),
            resource_type: uploaded.resource_type || "raw"
          },
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        }
      );
      // Reset states so button label flips back
      setSaving(false);
      // setUploading(false);
      setStatus(`Uploaded to Cloudinary and saved (id: ${docRef.id}).`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      console.error("[RESOURCES] upload error", e);
      setStatus(e?.message || "Upload failed. Try again.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">Study materials your team can share with students.</p>
        </div>

        {/* CTAs requested */}
        <div className="flex gap-2">
          <Button onClick={goToFreeNotes} variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Free Notes & PDFs
          </Button>
          <Button onClick={goToBooks} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Recommended Books & Materials
          </Button>
        </div>
      </div>

      {/* Primary call to action */}
      <div>
        <Button onClick={goToUpload} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Free PDFs
        </Button>
      </div>

      {/* Inline Firestore upload (small PDFs only) */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Upload Free PDFs (Firestore)</h2>
        <p className="text-sm text-muted-foreground">For demo use: stores the file directly inside Firestore (max ~900KB). For larger files, we should use Firebase Storage and keep only metadata in Firestore.</p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">PDF file</label>
            <div className="mt-2">
              <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors p-6 cursor-pointer">
                <Upload className="h-8 w-8 text-gray-500 mb-3" />
                <span className="text-sm font-medium text-gray-700">Drag and drop your PDF here</span>
                <span className="text-xs text-gray-500">or click to browse</span>
              </label>
              <input id="pdf-upload" ref={fileInputRef} type="file" accept="application/pdf" onChange={onPickFile} className="hidden" />
              {file && (
                <div className="mt-3 text-sm text-gray-700">
                  Selected: <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {status && <p className="text-sm text-blue-600">{status}</p>}
        <div className="flex gap-2">
          <Button
            onClick={onUploadViaApi}
            disabled={uploading || saving || !file}
            className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white px-4 py-2 shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-fuchsia-500 disabled:opacity-60 disabled:cursor-not-allowed`}
         >
            {uploading ? "Uploading..." : saving ? "Saving..." : (<><Upload className="h-4 w-4" /> Upload</>)}
          </Button>
        </div>
      </div>

      {/* List uploaded PDFs */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Uploaded PDFs</h2>
          <Button variant="outline" onClick={loadList} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        {loadError && <p className="text-sm text-red-600">{loadError}</p>}
        {loading && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No PDFs uploaded yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => {
              const name = it.title || (it.url ? decodeURIComponent(it.url.split('/').pop()) : it.id);
              const when = it.uploadedAt?.toDate ? it.uploadedAt.toDate() : (it.uploadedAt ? new Date(it.uploadedAt) : null);
              const whenStr = when ? when.toLocaleString() : '';
              return (
                <div key={it.id} className="p-4 rounded-lg border bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{name}</p>
                      <p className="text-xs text-muted-foreground">{whenStr}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={it.url} target="_blank" rel="noreferrer" className="text-blue-600 text-xs underline">View</a>
                      <button onClick={() => onDelete(it)} title="Delete" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

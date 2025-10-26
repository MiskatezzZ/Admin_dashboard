"use client";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { FileText, BookOpen, Upload, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";

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
    const confirmToast = toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-md">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Delete PDF?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Are you sure you want to delete "{item.title || item.id}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                toast.promise(
                  (async () => {
                    const res = await fetch(`/api/resources`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ docId: item.id, url: item.url })
                    });
                    const json = await res.json();
                    if (!res.ok || json?.success !== true) throw new Error(json?.error || 'Delete failed');
                    setItems(prev => prev.filter(x => x.id !== item.id));
                    return json;
                  })(),
                  {
                    loading: 'Deleting PDF...',
                    success: 'PDF deleted successfully!',
                    error: (err) => err?.message || 'Failed to delete PDF',
                  }
                );
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
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
    <div className="space-y-[4vw] sm:space-y-[3vw] md:space-y-[2vw] xl:space-y-[1.5vw]">
      {/* Page Header */}
      <div className="flex flex-col gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-gray-900">Resources</h1>
          <p className="text-[3.5vw] sm:text-[2.8vw] md:text-[1.8vw] xl:text-[1vw] text-gray-500 mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">Upload and manage study materials for students</p>
        </div>
        <div className="flex gap-[2vw] sm:gap-[1.5vw] md:gap-[0.8vw] xl:gap-[0.6vw]">
          <Button onClick={goToFreeNotes} variant="outline" className="gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.6vw] xl:gap-[0.4vw] h-[9vw] sm:h-[7vw] md:h-[3.5vw] xl:h-[2.5vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.9vw] font-medium border-gray-300">
            <FileText className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.4vw] md:w-[1.4vw] xl:h-[1vw] xl:w-[1vw]" />
            Free Notes
          </Button>
          <Button onClick={goToBooks} variant="outline" className="gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.6vw] xl:gap-[0.4vw] h-[9vw] sm:h-[7vw] md:h-[3.5vw] xl:h-[2.5vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.9vw] font-medium border-gray-300">
            <BookOpen className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.4vw] md:w-[1.4vw] xl:h-[1vw] xl:w-[1vw]" />
            Books
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">Upload PDF</CardTitle>
          <CardDescription className="mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw] text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500">Upload study materials and resources for students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[3vw] sm:space-y-[2.5vw] md:space-y-[1.5vw] xl:space-y-[1vw]">
          <div>
            <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-[6vw] sm:p-[5vw] md:p-[3vw] xl:p-[2vw] cursor-pointer">
              <Upload className="h-[8vw] w-[8vw] sm:h-[6.5vw] sm:w-[6.5vw] md:h-[4vw] md:w-[4vw] xl:h-[2.8vw] xl:w-[2.8vw] text-gray-400 mb-[1.5vw] sm:mb-[1.2vw] md:mb-[0.8vw] xl:mb-[0.5vw]" />
              <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] font-medium text-gray-700">Drop PDF here or click to browse</span>
              <span className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">Maximum file size: 900KB</span>
            </label>
            <input id="pdf-upload" ref={fileInputRef} type="file" accept="application/pdf" onChange={onPickFile} className="hidden" />
            {file && (
              <div className="mt-[2.5vw] sm:mt-[2vw] md:mt-[1.2vw] xl:mt-[0.8vw] p-[2.5vw] sm:p-[2vw] md:p-[1.2vw] xl:p-[0.8vw] bg-indigo-50 rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw]">
                <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-gray-700">Selected: <span className="font-medium">{file.name}</span></p>
              </div>
            )}
          </div>
          {status && <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-indigo-600">{status}</p>}
          <Button
            onClick={onUploadViaApi}
            disabled={uploading || saving || !file}
            className="gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.8vw] xl:gap-[0.5vw] h-[10vw] sm:h-[8vw] md:h-[5vw] xl:h-[3.5vw] text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:shadow-md disabled:opacity-60"
          >
            {uploading ? "Uploading..." : saving ? "Saving..." : (<><Upload className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.8vw] md:w-[1.8vw] xl:h-[1.2vw] xl:w-[1.2vw]" /> Upload PDF</>)}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded PDFs */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">Uploaded PDFs</CardTitle>
              <CardDescription className="mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw] text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500">All uploaded study materials</CardDescription>
            </div>
            <Button variant="outline" onClick={loadList} disabled={loading} size="sm" className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium border-gray-300">
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadError && <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-red-600">{loadError}</p>}
          {loading && items.length === 0 ? (
            <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-muted-foreground">No PDFs uploaded yet</p>
          ) : (
            <div className="grid gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw] sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it, index) => {
                const name = it.title || (it.url ? decodeURIComponent(it.url.split('/').pop()) : it.id);
                const when = it.uploadedAt?.toDate ? it.uploadedAt.toDate() : (it.uploadedAt ? new Date(it.uploadedAt) : null);
                const whenStr = when ? when.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                return (
                  <div key={it.id} className="p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.4vw] rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-200 bg-white group">
                    <div className="flex items-start gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw]">
                      <div className="h-[12vw] w-[12vw] sm:h-[10vw] sm:w-[10vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw] rounded-[1.5vw] sm:rounded-[1.2vw] md:rounded-[0.8vw] xl:rounded-[0.5vw] bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <FileText className="h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] md:h-[2.5vw] md:w-[2.5vw] xl:h-[1.8vw] xl:w-[1.8vw] text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1.05vw] truncate text-gray-900">{name}</p>
                        <p className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.9vw] text-gray-500 mt-[1vw] sm:mt-[0.8vw] md:mt-[0.4vw] xl:mt-[0.3vw]">{whenStr}</p>
                        <div className="flex items-center gap-[2vw] sm:gap-[1.5vw] md:gap-[0.8vw] xl:gap-[0.6vw] mt-[2vw] sm:mt-[1.5vw] md:mt-[1vw] xl:mt-[0.7vw]">
                          <a href={it.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.9vw] font-medium">View PDF</a>
                          <button onClick={() => onDelete(it)} title="Delete" className="text-red-600 hover:text-red-700 p-[1vw] sm:p-[0.8vw] md:p-[0.4vw] xl:p-[0.3vw] hover:bg-red-50 rounded-[1vw] sm:rounded-[0.8vw] md:rounded-[0.4vw] xl:rounded-[0.3vw] transition-colors">
                            <Trash2 className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.4vw] md:w-[1.4vw] xl:h-[1vw] xl:w-[1vw]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

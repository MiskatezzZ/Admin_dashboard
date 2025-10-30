"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge.jsx"

export default function ApplicationDetailPage() {
  const params = useParams();
  const userId = useMemo(() => {
    const raw = params?.userId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);
  const applicationId = useMemo(() => {
    const raw = params?.applicationId;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [user, setUser] = useState(null);
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !applicationId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch application details
        const appRes = await fetch(`/api/users/${userId}/applications/${applicationId}`, { cache: 'no-store' });
        const appJson = await appRes.json();
        if (!appRes.ok || appJson?.success !== true) {
          throw new Error(appJson?.message || 'Failed to load application');
        }
        const applicationData = appJson.application || null;
        console.log('Fetched application data:', applicationData);
        setApp(applicationData);
        
        // Fetch user details
        const uRes = await fetch(`/api/users/${userId}`, { cache: 'no-store' });
        const uJson = await uRes.json();
        if (uRes.ok && uJson?.success === true) {
          setUser(uJson.user || null);
        }
      } catch (e) {
        setError(e?.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, applicationId]);

  // Helpers
  const formatDate = (v) => {
    if (!v) return null;
    try {
      const d = new Date(v);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  // Get displayable fields - exclude technical fields and those shown elsewhere
  const getDisplayFields = (app) => {
    if (!app) return [];
    // Exclude technical/metadata fields that are shown elsewhere or not relevant for display
    const excludeKeys = [
      'id', 'path', 'pdfs', 'images', 'form', 'status', 'category',
      'uploads', 'attachments', 'pdfUrls', 'pdfUrl', 'imageUrls', 
      'imageUrl', 'photos', 'updatedAt'
    ];
    
    return Object.entries(app)
      .filter(([key, value]) => {
        // Exclude specific keys
        if (excludeKeys.includes(key)) return false;
        // Exclude null/undefined values
        if (value === null || value === undefined) return false;
        // Exclude empty strings
        if (value === '') return false;
        // Exclude empty arrays
        if (Array.isArray(value) && value.length === 0) return false;
        // Exclude empty objects
        if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
        return true;
      })
      .map(([key, value]) => {
        const isDate = key.toLowerCase().includes('date') || key.toLowerCase().includes('at');
        let displayValue = value;
        
        if (isDate) {
          displayValue = formatDate(value);
        } else if (Array.isArray(value)) {
          displayValue = value.join(', ');
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value, null, 2);
        }
        
        return {
          key,
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim(),
          value: displayValue,
          rawValue: value
        };
      })
      .filter(field => field.value !== null); // Remove fields where date formatting failed
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Application Details</h1>
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Application Details</h1>
        <p className="text-red-600">{error}</p>
        <Link href={`/forms/${userId}`} className="text-blue-600 text-sm hover:underline">Back to Applications</Link>
      </div>
    );
  }
  if (!app) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Application Details</h1>
        <p className="text-muted-foreground">No application found.</p>
        <Link href={`/forms/${userId}`} className="text-blue-600 text-sm hover:underline">Back to Applications</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2.5 text-sm">
        <Link href="/forms" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Form Submissions</Link>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/forms/${userId}`} className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Applications</Link>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-semibold">{app.form || app.category || 'Details'}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-3">
            {app.form || app.category || 'Application'} Form
          </h1>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <Badge 
                className={`text-xs font-semibold px-3 py-1 border
                  ${app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                    app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-gray-50 text-gray-700 border-gray-200'}
                `}
              >
                {app.status || 'pending'}
              </Badge>
            </div>
          </div>
          {user && (
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Applicant:</span> {user.name || user.username || user.email || userId}
            </p>
          )}
        </div>
        <Link href={`/forms/${userId}`} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300">
          ← Back to Applications
        </Link>
      </div>

      {/* Form Details Section */}
      {getDisplayFields(app).length > 0 && (
        <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 bg-gradient-to-r from-gray-50/80 to-gray-50/40">
            <h2 className="text-lg font-bold text-gray-900">Form Information</h2>
            <p className="text-sm text-gray-500 mt-0.5">Details specific to this {app.form || 'form'} application</p>
          </div>
          <div className="p-6 space-y-4">
            {getDisplayFields(app).map((field, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="text-sm text-gray-600 font-semibold min-w-[160px]">
                  {field.label}
                </div>
                <div className="text-left sm:text-right text-sm max-w-2xl text-gray-900 break-words">
                  {typeof field.rawValue === 'object' && !Array.isArray(field.rawValue) ? (
                    <pre className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-lg whitespace-pre-wrap font-mono">{field.value}</pre>
                  ) : (
                    <span className="font-medium">{String(field.value)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDFs Section */}
      {(Array.isArray(app.pdfs) && app.pdfs.length > 0) && (
        <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 bg-gradient-to-r from-gray-50/80 to-gray-50/40">
            <h2 className="text-lg font-bold text-gray-900">PDF Documents</h2>
            <p className="text-sm text-gray-500 mt-0.5">{app.pdfs.length} PDF{app.pdfs.length !== 1 ? 's' : ''} attached to this application</p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {app.pdfs.map((url, i) => (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">PDF Document {i + 1}</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-700 font-medium transition-colors mt-0.5">Click to view →</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Images Section */}
      {(Array.isArray(app.images) && app.images.length > 0) && (
        <div className="rounded-xl border border-gray-200/60 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 bg-gradient-to-r from-gray-50/80 to-gray-50/40">
            <h2 className="text-lg font-bold text-gray-900">Images</h2>
            <p className="text-sm text-gray-500 mt-0.5">{app.images.length} image{app.images.length !== 1 ? 's' : ''} attached to this application</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {app.images.map((src, i) => (
                <a 
                  key={i} 
                  href={src} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-200"
                >
                  <img 
                    alt={`Image ${i + 1}`} 
                    src={src} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3">
                    <span className="text-white text-xs font-semibold bg-gray-800 px-3 py-1.5 rounded-full shadow-lg">View Full Size</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

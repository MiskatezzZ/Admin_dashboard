"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"

export default function UserApplicationsPage() {
  const params = useParams()
  const userId = useMemo(() => {
    const raw = params?.userId
    return Array.isArray(raw) ? raw[0] : raw
  }, [params])

  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!userId) return
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const uRes = await fetch(`/api/users/${userId}`, { cache: 'no-store' })
        const uJson = await uRes.json()
        if (!uRes.ok || uJson?.success !== true) throw new Error(uJson?.message || 'Failed to load user')
        const list = Array.isArray(uJson.applications)
          ? uJson.applications
          : Array.isArray(uJson.application)
            ? uJson.application
            : Array.isArray(uJson.apps)
              ? uJson.apps
              : []
        setApps(list)
      } catch (e) {
        setError(e?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const formatDate = (v) => {
    if (!v) return '—'
    try {
      const d = v && typeof v.toDate === 'function' ? v.toDate() : new Date(v)
      if (!d || isNaN(d.getTime())) return '—'
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return '—'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Applications</h1>
          <p className="text-base text-gray-500">All applications for this user</p>
        </div>
        <Link href="/forms" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          ← Back to Form Submissions
        </Link>
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b">
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Form</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Status</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Applied At</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">PDFs</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Images</TableHead>
              <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No applications</TableCell>
              </TableRow>
            ) : (
              apps.map((a) => (
                <TableRow key={a.id} className="cursor-pointer hover:bg-blue-50/40 transition-all duration-150 group border-b border-gray-100" onClick={() => window.location.href = `/forms/${userId}/${a.id}`}>
                  <TableCell className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{a.form || a.category || '—'}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`capitalize text-xs font-semibold px-2.5 py-1 border
                        ${a.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                          a.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                          'bg-gray-50 text-gray-700 border-gray-200'}
                      `}
                    >
                      {a.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{a.appliedAt ? formatDate(a.appliedAt) : '—'}</TableCell>
                  <TableCell>
                    {Array.isArray(a.pdfs) && a.pdfs.length > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
                        {a.pdfs.length} PDF{a.pdfs.length !== 1 ? 's' : ''}
                      </span>
                    ) : <span className="text-sm text-gray-400">—</span>}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(a.images) && a.images.length > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
                        {a.images.length} Image{a.images.length !== 1 ? 's' : ''}
                      </span>
                    ) : <span className="text-sm text-gray-400">—</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/forms/${userId}/${a.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
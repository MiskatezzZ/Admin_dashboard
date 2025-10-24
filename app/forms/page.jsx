"use client"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Button } from "@/components/ui/button.jsx"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function FormSubmissions() {
  const router = useRouter()
  const [apps, setApps] = useState([])
  const [appsLoading, setAppsLoading] = useState(true)
  const [appsError, setAppsError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setAppsLoading(true)
        setAppsError("")
        const res = await fetch('/api/user-applications?limit=200', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to load applications')
        setApps(Array.isArray(json.data) ? json.data : [])
      } catch (e) {
        setAppsError(e?.message || 'Failed to load applications')
      } finally {
        setAppsLoading(false)
      }
    }
    load()
  }, [])

  const markSeen = async (app) => {
    try {
      const res = await fetch('/api/user-applications/mark-seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: app.path, userId: app.userId, id: app.id })
      })
      const json = await res.json()
      if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to update')
      setApps(prev => prev.map(x => x.id === app.id ? { ...x, status: json.status || 'seen' } : x))
    } catch (e) {
      if (typeof window !== 'undefined') window.alert(e?.message || 'Failed to update')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">All applications with attachments</p>
      </div>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Fetched from users/*/applications</CardDescription>
        </CardHeader>
        <CardContent>
          {appsLoading && (
            <p className="text-sm text-muted-foreground">Loading applications...</p>
          )}
          {appsError && !appsLoading && (
            <p className="text-sm text-red-600">{appsError}</p>
          )}
          {!appsLoading && !appsError && apps.length === 0 && (
            <p className="text-sm text-muted-foreground">No applications found.</p>
          )}
          {apps.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied At</TableHead>
                    <TableHead>PDFs</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.map((a) => (
                    <TableRow
                      key={a.id}
                      role={a.userId ? 'button' : undefined}
                      tabIndex={a.userId ? 0 : -1}
                      onClick={() => { if (a.userId) router.push(`/forms/${a.userId}`) }}
                      onKeyDown={(e) => { if (a.userId && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); router.push(`/forms/${a.userId}`) }}}
                      className={`${a.userId ? 'cursor-pointer hover:bg-muted/40' : ''}`}
                    >
                      <TableCell className="font-medium">
                        {a.userId ? (
                          <Link href={`/forms/${a.userId}`} className="text-blue-600 hover:underline">{a.name || '—'}</Link>
                        ) : (
                          a.name || '—'
                        )}
                      </TableCell>
                      <TableCell>{a.email || '—'}</TableCell>
                      <TableCell>{a.phone || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'approved' ? 'default' : a.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {a.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{a.appliedAt ? formatDate(a.appliedAt) : '—'}</TableCell>
                      <TableCell>
                        {Array.isArray(a.pdfs) && a.pdfs.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <a href={a.pdfs[0]} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">View</a>
                            {a.pdfs.length > 1 && <span className="text-xs text-muted-foreground">+{a.pdfs.length - 1} more</span>}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(a.images) && a.images.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <a href={a.images[0]} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">Open</a>
                            {a.images.length > 1 && <span className="text-xs text-muted-foreground">+{a.images.length - 1} more</span>}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        {a.status === 'pending' ? (
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); markSeen(a) }}>
                            Mark seen
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

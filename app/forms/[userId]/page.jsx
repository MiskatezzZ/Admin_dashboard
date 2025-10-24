"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Image as ImageIcon, FileText as FileIcon, User as UserIcon } from "lucide-react"

export default function UserFormsPage() {
  const params = useParams()
  const userId = useMemo(() => {
    const raw = params?.userId
    return Array.isArray(raw) ? raw[0] : raw
  }, [params])

  const [user, setUser] = useState(null)
  const [attachments, setAttachments] = useState({ pdfs: [], images: [] })
  const [apps, setApps] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const imageUrls = useMemo(() => {
    const fromUser = attachments?.images || []
    const fromApps = apps.flatMap(a => Array.isArray(a.images) ? a.images : [])
    return Array.from(new Set([...fromUser, ...fromApps].filter(Boolean)))
  }, [attachments, apps])

  const pdfUrls = useMemo(() => {
    const fromUser = attachments?.pdfs || []
    const fromApps = apps.flatMap(a => Array.isArray(a.pdfs) ? a.pdfs : [])
    return Array.from(new Set([...fromUser, ...fromApps].filter(Boolean)))
  }, [attachments, apps])

  useEffect(() => {
    if (!userId) return
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const [uRes, aRes, bRes] = await Promise.all([
          fetch(`/api/users/${userId}`, { cache: 'no-store' }),
          fetch(`/api/user-applications?userId=${userId}&limit=200`, { cache: 'no-store' }),
          fetch(`/api/user-bookings?userId=${userId}&limit=100`, { cache: 'no-store' }),
        ])
        const [uJson, aJson, bJson] = await Promise.all([uRes.json(), aRes.json(), bRes.json()])
        if (!uRes.ok || uJson?.success !== true) throw new Error(uJson?.message || 'Failed to load user')
        if (!aRes.ok || aJson?.success !== true) throw new Error(aJson?.message || 'Failed to load applications')
        if (!bRes.ok || bJson?.success !== true) throw new Error(bJson?.message || 'Failed to load bookings')
        setUser(uJson.user || null)
        setAttachments(uJson.attachments || { pdfs: [], images: [] })
        setApps(Array.isArray(aJson.data) ? aJson.data : [])
        setBookings(Array.isArray(bJson.data) ? bJson.data : [])
      } catch (e) {
        setError(e?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const toDateObj = (v) => {
    if (!v) return null
    if (v && typeof v.toDate === 'function') return v.toDate()
    try { return new Date(v) } catch { return null }
  }

  const formatDate = (v) => {
    const d = toDateObj(v)
    if (!d || isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">Summary, attachments, applications and bookings</p>
        </div>
        <Link href="/forms" className="text-sm text-blue-600 hover:underline">Back to Applications</Link>
      </div>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5 text-indigo-600" /> Profile</CardTitle>
          <CardDescription>User information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-muted-foreground">User ID</div>
            <div className="text-base font-medium">{userId || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Name</div>
            <div className="text-base font-medium">{user?.name || user?.username || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="text-base font-medium">{user?.email || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Phone</div>
            <div className="text-base font-medium">{user?.phone || '—'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Created At</div>
            <div className="text-base font-medium">{user?.createdAt ? formatDate(user.createdAt) : '—'}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>At a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-4 bg-gradient-to-br from-indigo-50 to-white">
              <div className="text-xs text-muted-foreground">Applications</div>
              <div className="text-xl font-semibold">{apps.length}</div>
            </div>
            <div className="rounded-xl border p-4 bg-gradient-to-br from-emerald-50 to-white">
              <div className="text-xs text-muted-foreground">Bookings</div>
              <div className="text-xl font-semibold">{bookings.length}</div>
            </div>
            <div className="rounded-xl border p-4 bg-gradient-to-br from-blue-50 to-white">
              <div className="text-xs text-muted-foreground">Images</div>
              <div className="text-xl font-semibold">{imageUrls.length}</div>
            </div>
            <div className="rounded-xl border p-4 bg-gradient-to-br from-amber-50 to-white">
              <div className="text-xs text-muted-foreground">PDFs</div>
              <div className="text-xl font-semibold">{pdfUrls.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-blue-600" /> Image Uploads</CardTitle>
          <CardDescription>Preview of uploaded images</CardDescription>
        </CardHeader>
        <CardContent>
          {imageUrls.length ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {imageUrls.map((src, i) => (
                <div key={i} className="rounded-xl border overflow-hidden bg-white">
                  <div className="aspect-[4/3] w-full bg-muted/20">
                    <img src={src} alt={`Image ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-right">
                    <a href={src} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600">Open</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No images</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileIcon className="h-5 w-5 text-amber-600" /> PDF Uploads</CardTitle>
          <CardDescription>Preview of uploaded PDFs</CardDescription>
        </CardHeader>
        <CardContent>
          {pdfUrls.length ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {pdfUrls.map((url, i) => (
                <div key={i} className="rounded-xl border overflow-hidden bg-white">
                  <div className="aspect-[4/3] bg-muted/30">
                    <iframe src={url} title={`pdf-${i}`} className="w-full h-full" />
                  </div>
                  <div className="p-3 border-t flex items-center justify-end">
                    <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600">Open</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDFs</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>All applications for this user</CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && apps.length === 0 && (
            <p className="text-sm text-muted-foreground">No applications</p>
          )}
          {apps.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied At</TableHead>
                    <TableHead>PDFs</TableHead>
                    <TableHead>Images</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.form || a.category || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'approved' ? 'default' : a.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {a.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{a.appliedAt ? formatDate(a.appliedAt) : '—'}</TableCell>
                      <TableCell>
                        {Array.isArray(a.pdfs) && a.pdfs.length ? (
                          <div className="flex items-center gap-2">
                            <a href={a.pdfs[0]} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">View</a>
                            {a.pdfs.length > 1 && <span className="text-xs text-muted-foreground">+{a.pdfs.length - 1} more</span>}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(a.images) && a.images.length ? (
                          <div className="flex items-center gap-2">
                            <a href={a.images[0]} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">Open</a>
                            {a.images.length > 1 && <span className="text-xs text-muted-foreground">+{a.images.length - 1} more</span>}
                          </div>
                        ) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>All bookings for this user</CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && !error && bookings.length === 0 && (
            <p className="text-sm text-muted-foreground">No bookings</p>
          )}
          {bookings.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Slot</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <Badge variant={b.status === 'approved' ? 'default' : b.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {b.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{b.bookingDate ? formatDate(b.bookingDate) : '—'}</TableCell>
                      <TableCell>{b.createdAt ? formatDate(b.createdAt) : '—'}</TableCell>
                      <TableCell>{b.slot || '—'}</TableCell>
                      <TableCell className="max-w-[320px] truncate" title={b.notes || ''}>{b.notes || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading...</p>
      )}
      {error && !loading && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

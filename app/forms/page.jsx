"use client"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Button } from "@/components/ui/button.jsx"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Image as ImageIcon, Eye, Check } from "lucide-react"
import toast from "react-hot-toast"

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
    toast.promise(
      (async () => {
        const res = await fetch('/api/user-applications/mark-seen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: app.path, userId: app.userId, id: app.id })
        })
        const json = await res.json()
        if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to update')
        setApps(prev => prev.map(x => x.id === app.id ? { ...x, status: json.status || 'seen' } : x))
        return json
      })(),
      {
        loading: 'Marking as seen...',
        success: 'Marked as seen!',
        error: (err) => err?.message || 'Failed to update status',
      }
    );
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
    <div className="space-y-[4vw] sm:space-y-[3vw] md:space-y-[2vw] xl:space-y-[1.5vw]">
      {/* Page Header */}
      <div>
        <h1 className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-gray-900">Form Submissions</h1>
        <p className="text-[3.5vw] sm:text-[2.8vw] md:text-[1.8vw] xl:text-[1vw] text-gray-500 mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">Review and manage all student applications</p>
      </div>

      {/* Applications Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">All Applications</CardTitle>
          <CardDescription className="mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw] text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500">Student applications with documents and status</CardDescription>
        </CardHeader>
        <CardContent>
          {appsLoading && (
            <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-muted-foreground">Loading...</p>
          )}
          {appsError && !appsLoading && (
            <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-red-600">{appsError}</p>
          )}
          {!appsLoading && !appsError && apps.length === 0 && (
            <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-muted-foreground">No applications found</p>
          )}
          {apps.length > 0 && (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                    <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] py-[4vw] sm:py-[3vw] md:py-[2vw] xl:py-[1.2vw] text-gray-700">APPLICANT</TableHead>
                    <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">CONTACT</TableHead>
                    <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">STATUS</TableHead>
                    <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">APPLIED AT</TableHead>
                    <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">ATTACHMENTS</TableHead>
                    <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700 text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.map((a, index) => (
                    <TableRow
                      key={a.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      {/* Applicant Name & Email Column */}
                      <TableCell className="py-[4vw] sm:py-[3vw] md:py-[2.2vw] xl:py-[1.5vw]">
                        <div>
                          {a.userId ? (
                            <Link href={`/forms/${a.userId}`} className="font-semibold text-[3.5vw] sm:text-[2.9vw] md:text-[1.8vw] xl:text-[1.1vw] text-gray-900 hover:text-blue-600 transition-colors">
                              {a.name || '—'}
                            </Link>
                          ) : (
                            <div className="font-semibold text-[3.5vw] sm:text-[2.9vw] md:text-[1.8vw] xl:text-[1.1vw] text-gray-900">{a.name || '—'}</div>
                          )}
                          <div className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500 mt-[0.5vw] sm:mt-[0.4vw] md:mt-[0.2vw] xl:mt-[0.15vw]">{a.email || '—'}</div>
                        </div>
                      </TableCell>

                      {/* Phone Column */}
                      <TableCell className="text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1.05vw] text-gray-600 font-medium">
                        {a.phone || '—'}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <Badge 
                          className={`capitalize text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] px-[3vw] sm:px-[2.5vw] md:px-[1.2vw] xl:px-[0.8vw] py-[1.2vw] sm:py-[1vw] md:py-[0.5vw] xl:py-[0.35vw] font-semibold rounded-[1.5vw] sm:rounded-[1.2vw] md:rounded-[0.5vw] xl:rounded-[0.3vw]
                            ${a.status === 'seen' ? 'bg-green-100 text-green-700 hover:bg-green-100 border border-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-100 border border-orange-200'}
                          `}
                        >
                          {a.status || 'pending'}
                        </Badge>
                      </TableCell>

                      {/* Applied Date */}
                      <TableCell className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[0.95vw] text-gray-600 whitespace-nowrap">
                        {a.appliedAt ? formatDate(a.appliedAt) : '—'}
                      </TableCell>

                      {/* Attachments Column */}
                      <TableCell>
                        <div className="flex items-center gap-[2vw] sm:gap-[1.5vw] md:gap-[0.8vw] xl:gap-[0.5vw]">
                          {/* PDFs */}
                          {Array.isArray(a.pdfs) && a.pdfs.length > 0 ? (
                            <a 
                              href={a.pdfs[0]} 
                              target="_blank" 
                              rel="noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-[1.2vw] sm:gap-[1vw] md:gap-[0.5vw] xl:gap-[0.35vw] text-blue-600 hover:text-blue-700 hover:underline transition-colors text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] font-medium"
                            >
                              <FileText className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.4vw] md:w-[1.4vw] xl:h-[1vw] xl:w-[1vw]" />
                              {a.pdfs.length > 1 ? `${a.pdfs.length} PDFs` : 'PDF'}
                            </a>
                          ) : (
                            <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-400">—</span>
                          )}
                          
                          {/* Images */}
                          {Array.isArray(a.images) && a.images.length > 0 && (
                            <a 
                              href={a.images[0]} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-[1.2vw] sm:gap-[1vw] md:gap-[0.5vw] xl:gap-[0.35vw] text-purple-600 hover:text-purple-700 hover:underline transition-colors text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] font-medium"
                            >
                              <ImageIcon className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.4vw] md:w-[1.4vw] xl:h-[1vw] xl:w-[1vw]" />
                              {a.images.length > 1 ? `${a.images.length} Images` : 'Image'}
                            </a>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.6vw] xl:gap-[0.4vw]">
                          {a.userId && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => router.push(`/forms/${a.userId}`)}
                              className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] px-[2.5vw] sm:px-[2vw] md:px-[1vw] xl:px-[0.7vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium border-gray-300 hover:bg-gray-50"
                            >
                              <Eye className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] md:h-[1.2vw] md:w-[1.2vw] xl:h-[0.85vw] xl:w-[0.85vw] mr-[1vw] sm:mr-[0.8vw] md:mr-[0.4vw] xl:mr-[0.3vw]" />
                              View
                            </Button>
                          )}
                          {a.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={(e) => { e.stopPropagation(); markSeen(a) }} 
                              className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] px-[2.5vw] sm:px-[2vw] md:px-[1vw] xl:px-[0.7vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] md:h-[1.2vw] md:w-[1.2vw] xl:h-[0.85vw] xl:w-[0.85vw] mr-[1vw] sm:mr-[0.8vw] md:mr-[0.4vw] xl:mr-[0.3vw]" />
                              Mark Seen
                            </Button>
                          )}
                        </div>
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

"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import toast from "react-hot-toast"
import { Calendar, Check, X, BookOpen, CalendarCheck, Clock } from "lucide-react"

const EXAM_TYPES = [
  "JEE Main",
  "JEE Advanced",
  "NEET",
  "GATE",
  "UPSC CSE",
  "SSC CGL",
  "CAT",
  "CLAT",
  "CUET",
  "State PSC",
  "Other"
]

export default function ExamsAdmin() {
  const router = useRouter()
  const [exams, setExams] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState("")

  // form state - simplified
  const [type, setType] = useState("JEE Main")
  const [examDate, setExamDate] = useState("")
  const [applyStart, setApplyStart] = useState("")
  const [applyEnd, setApplyEnd] = useState("")
  // publish is always true per requirements

  const loadExams = async () => {
    try {
      setListLoading(true)
      setListError("")
      const res = await fetch('/api/exams', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to load exams')
      setExams(Array.isArray(json.data) ? json.data : [])
    } catch (e) {
      setListError(e?.message || 'Failed to load exams')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadExams()
  }, [])

  const onDelete = async (id) => {
    if (!id) return
    if (!confirm('Delete this exam?')) return
    try {
      const res = await fetch('/api/exams', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      const json = await res.json()
      if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to delete')
      await loadExams()
    } catch (e) {
      toast.error(e?.message || 'Delete failedd')
    }
  }

  const onPublish = async () => {
    if (!type) return toast.error('Select exam type')
    if (!examDate) return toast.error('Enter exam date')
    if (!applyStart) return toast.error('Enter application start date')
    if (!applyEnd) return toast.error('Enter application end date')

    const payload = {
      title: type,
      type,
      examDate,
      applicationStart: applyStart,
      applicationEnd: applyEnd,
      published: true,
      createdAt: new Date().toISOString()
    }

    toast.promise(
      (async () => {
        const res = await fetch('/api/exams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const json = await res.json()
        if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to publish exam')
        // refresh list
        await loadExams()
        // reset form
        setType("JEE Main")
        setExamDate("")
        setApplyStart("")
        setApplyEnd("")
        return json
      })(),
      {
        loading: 'Publishing exam...',
        success: 'Exam published! 🎉',
        error: (err) => err?.message || 'Failed to publish exam',
      }
    )
  }

  const formatDate = (d) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch { return d }
  }

  // Filter only published exams
  const publishedExams = useMemo(() => {
    return exams.filter(e => e.published)
  }, [exams])

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Publish Exams</h1>
            <p className="text-sm text-gray-500 mt-1">Create and publish exam notifications</p>
          </div>
        </div>
      </div>

      {/* Publish Form */}
      <Card className="border-2 border-blue-100 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">New Exam Notification</CardTitle>
              <CardDescription className="text-sm mt-0.5">Fill in the exam details below</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Exam Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exam Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-green-600" />
                Exam Date
              </label>
              <Input 
                type="date" 
                value={examDate} 
                onChange={(e) => setExamDate(e.target.value)} 
                className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Application Start Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="h-4 w-4 text-orange-600" />
                Application Start Date
              </label>
              <Input 
                type="date" 
                value={applyStart} 
                onChange={(e) => setApplyStart(e.target.value)} 
                className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Application End Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="h-4 w-4 text-red-600" />
                Application End Date
              </label>
              <Input 
                type="date" 
                value={applyEnd} 
                onChange={(e) => setApplyEnd(e.target.value)} 
                className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Publish Button */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-end">
              <Button 
                onClick={onPublish} 
                className="px-8 py-6 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
              >
                <Check className="h-5 w-5 mr-2" />
                Publish Exam
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Exams */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CalendarCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Published Exams</CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  {publishedExams.length} exam{publishedExams.length !== 1 ? 's' : ''} currently published
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {listLoading && (
            <div className="p-16 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-sm text-gray-600 font-medium">Loading exams...</p>
            </div>
          )}
          {listError && !listLoading && (
            <div className="p-16 text-center">
              <p className="text-sm text-red-600 font-medium">{listError}</p>
            </div>
          )}
          {!listLoading && !listError && (
            <div className="overflow-x-auto">
              {publishedExams.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">No published exams yet</p>
                  <p className="text-xs text-gray-500 mt-1">Create and publish your first exam above</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-50 hover:to-slate-50 border-b-2">
                      <TableHead className="font-bold text-xs text-gray-700 uppercase tracking-wider py-4">Exam Type</TableHead>
                      <TableHead className="font-bold text-xs text-gray-700 uppercase tracking-wider py-4">Exam Date</TableHead>
                      <TableHead className="font-bold text-xs text-gray-700 uppercase tracking-wider py-4">Application Period</TableHead>
                      <TableHead className="font-bold text-xs text-gray-700 uppercase tracking-wider py-4 text-center">Status</TableHead>
                      <TableHead className="font-bold text-xs text-gray-700 uppercase tracking-wider py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {publishedExams.map((e, idx) => (
                      <TableRow 
                        key={e.id || idx} 
                        className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-gray-900">{e.type || e.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">ID: {e.id || 'N/A'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-sm text-gray-900">{formatDate(e.examDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="h-3.5 w-3.5 text-orange-600" />
                              <span className="text-gray-600">Start: <span className="font-semibold text-gray-900">{formatDate(e.applicationStart)}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="h-3.5 w-3.5 text-red-600" />
                              <span className="text-gray-600">End: <span className="font-semibold text-gray-900">{formatDate(e.applicationEnd)}</span></span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-center">
                          <Badge className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200 font-bold px-4 py-1.5 text-xs shadow-sm">
                            <Check className="h-3 w-3 mr-1 inline" />
                            Published
                          </Badge>
                        </TableCell>
                        <TableCell className="py-5 text-right">
                          <Button variant="destructive" size="sm" onClick={() => onDelete(e.id)}>
                            <X className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

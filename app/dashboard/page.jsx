"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { useEffect, useState } from 'react'
import { Calendar, Activity, FileText, Bell, Upload, Users, AlertCircle, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [bookingsError, setBookingsError] = useState("")

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setBookingsLoading(true)
        setBookingsError("")
        const res = await fetch('/api/user-bookings?orderBy=bookingDate&limit=5', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to load bookings')
        setBookings(Array.isArray(json.data) ? json.data : [])
      } catch (e) {
        setBookingsError(e?.message || 'Failed to load bookings')
      } finally {
        setBookingsLoading(false)
      }
    }
    loadBookings()
  }, [])

  // Mock data
  const activeStudents = 42
  const upcomingExams = [
    { id: 1, title: "Mathematics Final", description: "Algebra and Calculus", examDate: "2025-11-15", category: "Math", priority: "high" },
    { id: 2, title: "English Literature", description: "Shakespeare and Modern Literature", examDate: "2025-11-20", category: "English", priority: "normal" },
  ]
  const recentSubmissions = [
    { id: 1, studentName: "John Doe", form: "Enrollment Form", submittedAt: "2025-10-18T10:30:00", pdfAttached: true, status: "approved" },
    { id: 2, studentName: "Jane Smith", form: "Assignment 1", submittedAt: "2025-10-18T09:15:00", pdfAttached: true, status: "pending" },
  ]
  const enrolledStudents = Array(42).fill(null)
  const examNotifications = Array(8).fill(null)
  const formSubmissions = Array(5).fill(null).map((_, i) => ({ status: i < 2 ? 'pending' : 'approved' }))

  return (
    <div className="space-y-6">
      {/* Recent Bookings */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Latest 5 bookings fetched from Firestore
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookingsLoading && (<p className="text-sm text-muted-foreground">Loading bookings...</p>)}
          {bookingsError && !bookingsLoading && (<p className="text-sm text-red-600">{bookingsError}</p>)}
          {!bookingsLoading && !bookingsError && bookings.length === 0 && (<p className="text-sm text-muted-foreground">No bookings found.</p>)}
          {bookings.map((b) => {
            const when = b.bookingDate ? new Date(b.bookingDate) : (b.createdAt ? new Date(b.createdAt) : null)
            const whenStr = when ? when.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
            return (
              <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-700">
                      {(b.name || b.studentName || 'U').toString().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{b.name || b.studentName || 'Unnamed'}</p>
                    <p className="text-xs text-muted-foreground">{b.email || b.phone || 'No contact'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{whenStr}{b.slot ? ` • ${b.slot}` : ''}</div>
                  {b.status && (<div className="text-xs text-muted-foreground">{b.status}</div>)}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
      
    </div>
  )
}
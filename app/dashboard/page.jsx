"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Button } from "@/components/ui/button.jsx"
import { dashboardStats, formSubmissions, examNotifications, enrolledStudents } from "@/lib/dummy-data.js"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from "../config/firebaseConfig"
import { 
  Users, 
  FileText, 
  Upload, 
  UserCheck,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  Bell,
  BarChart3,
  Activity
} from "lucide-react"

export default function Dashboard() {
  // Calculate some dynamic stats
  const recentSubmissions = formSubmissions.slice(0, 3)
  const upcomingExams = examNotifications.slice(0, 3)
  const activeStudents = enrolledStudents.filter(student => student.status === 'active').length
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  // Bookings state (from Firestore)
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [bookingsError, setBookingsError] = useState("")

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setBookingsLoading(true)
        setBookingsError("")
        const res = await fetch('/api/bookings?orderBy=date&limit=5', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to load bookings')
        const items = Array.isArray(json.data) ? json.data : []
        setBookings(items)
      } catch (e) {
        console.error('[Dashboard] loadBookings error', e)
        setBookingsError(e?.message || 'Failed to load bookings')
      } finally {
        setBookingsLoading(false)
      }
    }
    loadBookings()
  }, [])

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await signOut(auth)
      router.replace('/sign-in')
    } catch (e) {
      console.error('Logout failed', e)
      if (typeof window !== 'undefined') window.alert('Logout failed. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="space-y-[4vw] sm:space-y-[3vw] lg:space-y-[2vw] xl:space-y-[1.5vw]">
      {/* Page Header */}
      <div className="flex flex-col gap-[3vw] sm:gap-[2vw] lg:flex-row lg:items-start lg:justify-between lg:gap-[1vw]">
        <div className="space-y-[1.5vw] sm:space-y-[1vw] lg:space-y-[0.5vw]">
          <h1 className="text-[6vw] sm:text-[4vw] lg:text-[2.5vw] xl:text-[2vw] font-bold tracking-tight text-foreground leading-tight">Dashboard</h1>
          <p className="text-muted-foreground text-[3.5vw] sm:text-[2.5vw] lg:text-[1.2vw] xl:text-[1vw] font-medium leading-relaxed">
            Welcome back! Here's what's happening with your counseling platform.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.5vw] shrink-0">
          <Button size="sm" variant="outline" className="gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] px-[3vw] sm:px-[2vw] lg:px-[1vw] xl:px-[0.8vw] hover:bg-gray-50 border-gray-200 text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
            <Plus className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
            <span className="hidden sm:inline">Add Student</span>
          </Button>
          <Button size="sm" variant="outline" className="gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] px-[3vw] sm:px-[2vw] lg:px-[1vw] xl:px-[0.8vw] hover:bg-gray-50 border-gray-200 text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
            <Bell className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
            <span className="hidden sm:inline">Notify</span>
          </Button>
          <Button size="sm" className="gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] px-[3vw] sm:px-[2vw] lg:px-[1vw] xl:px-[0.8vw] gradient-primary text-white border-0 shadow-sm hover:shadow-md transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
            <Upload className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
            <span className="hidden sm:inline">Upload PDF</span>
          </Button>
          <Button onClick={handleLogout} disabled={loggingOut} size="sm" variant="outline" className={`gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] px-[3vw] sm:px-[2vw] lg:px-[1vw] xl:px-[0.8vw] hover:bg-gray-50 border-gray-200 text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] ${loggingOut ? 'opacity-70' : ''}`}>
            <span className="hidden sm:inline">{loggingOut ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-[3vw] sm:gap-[2vw] lg:gap-[1.5vw] xl:gap-[1vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardContent className="p-[4vw] sm:p-[3vw] lg:p-[2vw] xl:p-[1.5vw]">
            <div className="flex items-start justify-between">
              <div className="space-y-[2vw] sm:space-y-[1.5vw] lg:space-y-[1vw] xl:space-y-[0.8vw] flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Total Enrollments</p>
                  <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <Users className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{dashboardStats.totalEnrollments.toLocaleString()}</p>
                  <div className="flex items-center gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] xl:gap-[0.3vw] mt-[1.5vw] sm:mt-[1vw] lg:mt-[0.5vw] xl:mt-[0.4vw]">
                    <span className="inline-flex items-center gap-[0.5vw] sm:gap-[0.3vw] lg:gap-[0.2vw] xl:gap-[0.15vw] text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] font-medium text-emerald-600">
                      <TrendingUp className="h-[2vw] w-[2vw] sm:h-[1.5vw] sm:w-[1.5vw] lg:h-[0.8vw] lg:w-[0.8vw] xl:h-[0.6vw] xl:w-[0.6vw]" />
                      +12%
                    </span>
                    <span className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground">from last month</span>
                  </div>
                </div>
                {/* Mini sparkline */}
                <div className="flex items-end gap-[0.3vw] sm:gap-[0.2vw] lg:gap-[0.1vw] xl:gap-[0.08vw] h-[4vw] sm:h-[3vw] lg:h-[1.5vw] xl:h-[1.2vw]">
                  {[40, 52, 45, 68, 72, 85, 95].map((height, i) => (
                    <div key={i} className={`sparkline-bar bg-blue-200 group-hover:bg-blue-300 rounded-sm cursor-pointer w-[1vw] sm:w-[0.8vw] lg:w-[0.4vw] xl:w-[0.3vw]`} style={{height: `${height}%`}} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardContent className="p-[4vw] sm:p-[3vw] lg:p-[2vw] xl:p-[1.5vw]">
            <div className="flex items-start justify-between">
              <div className="space-y-[2vw] sm:space-y-[1.5vw] lg:space-y-[1vw] xl:space-y-[0.8vw] flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Form Submissions</p>
                  <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                    <FileText className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{dashboardStats.formSubmissions}</p>
                  <div className="flex items-center gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] xl:gap-[0.3vw] mt-[1.5vw] sm:mt-[1vw] lg:mt-[0.5vw] xl:mt-[0.4vw]">
                    <span className="inline-flex items-center gap-[0.5vw] sm:gap-[0.3vw] lg:gap-[0.2vw] xl:gap-[0.15vw] text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] font-medium text-emerald-600">
                      <TrendingUp className="h-[2vw] w-[2vw] sm:h-[1.5vw] sm:w-[1.5vw] lg:h-[0.8vw] lg:w-[0.8vw] xl:h-[0.6vw] xl:w-[0.6vw]" />
                      +5
                    </span>
                    <span className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground">this week</span>
                  </div>
                </div>
                <div className="flex items-end gap-[0.3vw] sm:gap-[0.2vw] lg:gap-[0.1vw] xl:gap-[0.08vw] h-[4vw] sm:h-[3vw] lg:h-[1.5vw] xl:h-[1.2vw]">
                  {[20, 35, 28, 42, 38, 45, 50].map((height, i) => (
                    <div key={i} className="sparkline-bar bg-green-200 group-hover:bg-green-300 rounded-sm cursor-pointer w-[1vw] sm:w-[0.8vw] lg:w-[0.4vw] xl:w-[0.3vw]" style={{height: `${height}%`}} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardContent className="p-[4vw] sm:p-[3vw] lg:p-[2vw] xl:p-[1.5vw]">
            <div className="flex items-start justify-between">
              <div className="space-y-[2vw] sm:space-y-[1.5vw] lg:space-y-[1vw] xl:space-y-[0.8vw] flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">PDF Uploads</p>
                  <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                    <Upload className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{dashboardStats.pdfUploads}</p>
                  <div className="flex items-center gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] xl:gap-[0.3vw] mt-[1.5vw] sm:mt-[1vw] lg:mt-[0.5vw] xl:mt-[0.4vw]">
                    <span className="inline-flex items-center gap-[0.5vw] sm:gap-[0.3vw] lg:gap-[0.2vw] xl:gap-[0.15vw] text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] font-medium text-blue-600">
                      <TrendingUp className="h-[2vw] w-[2vw] sm:h-[1.5vw] sm:w-[1.5vw] lg:h-[0.8vw] lg:w-[0.8vw] xl:h-[0.6vw] xl:w-[0.6vw]" />
                      +23
                    </span>
                    <span className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground">this month</span>
                  </div>
                </div>
                <div className="flex items-end gap-[0.3vw] sm:gap-[0.2vw] lg:gap-[0.1vw] xl:gap-[0.08vw] h-[4vw] sm:h-[3vw] lg:h-[1.5vw] xl:h-[1.2vw]">
                  {[15, 25, 35, 40, 32, 48, 55].map((height, i) => (
                    <div key={i} className="sparkline-bar bg-purple-200 group-hover:bg-purple-300 rounded-sm cursor-pointer w-[1vw] sm:w-[0.8vw] lg:w-[0.4vw] xl:w-[0.3vw]" style={{height: `${height}%`}} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardContent className="p-[4vw] sm:p-[3vw] lg:p-[2vw] xl:p-[1.5vw]">
            <div className="flex items-start justify-between">
              <div className="space-y-[2vw] sm:space-y-[1.5vw] lg:space-y-[1vw] xl:space-y-[0.8vw] flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Active Students</p>
                  <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                    <UserCheck className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-orange-600" />
                  </div>
                </div>
                <div>
                  <p className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{activeStudents}</p>
                  <div className="flex items-center gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] xl:gap-[0.3vw] mt-[1.5vw] sm:mt-[1vw] lg:mt-[0.5vw] xl:mt-[0.4vw]">
                    <span className="inline-flex items-center gap-[0.5vw] sm:gap-[0.3vw] lg:gap-[0.2vw] xl:gap-[0.15vw] text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] font-medium text-gray-600">
                      <Activity className="h-[2vw] w-[2vw] sm:h-[1.5vw] sm:w-[1.5vw] lg:h-[0.8vw] lg:w-[0.8vw] xl:h-[0.6vw] xl:w-[0.6vw]" />
                      Stable
                    </span>
                    <span className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground">currently enrolled</span>
                  </div>
                </div>
                <div className="flex items-end gap-[0.3vw] sm:gap-[0.2vw] lg:gap-[0.1vw] xl:gap-[0.08vw] h-[4vw] sm:h-[3vw] lg:h-[1.5vw] xl:h-[1.2vw]">
                  {[30, 30, 32, 31, 33, 32, 31].map((height, i) => (
                    <div key={i} className="sparkline-bar bg-orange-200 group-hover:bg-orange-300 rounded-sm cursor-pointer w-[1vw] sm:w-[0.8vw] lg:w-[0.4vw] xl:w-[0.3vw]" style={{height: `${height}%`}} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed & Recent Submissions */}
      <div className="grid gap-[4vw] sm:gap-[3vw] lg:gap-[2vw] xl:gap-[1.5vw] grid-cols-1 xl:grid-cols-3">
        {/* Activity Feed */}
        <Card className="border-0 shadow-sm bg-white hover-lift">
          <CardHeader className="pb-[3vw] sm:pb-[2vw] lg:pb-[1vw] xl:pb-[0.8vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[4vw] sm:text-[3vw] lg:text-[1.4vw] xl:text-[1.1vw] font-semibold flex items-center gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] xl:gap-[0.4vw]">
                  <Activity className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.2vw] lg:w-[1.2vw] xl:h-[1vw] xl:w-[1vw] text-indigo-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.4vw] xl:mt-[0.3vw]">
                  Live updates from your platform
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-[3vw] sm:space-y-[2vw] lg:space-y-[1vw] xl:space-y-[0.8vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            {[
              { name: "Emily Johnson", action: "submitted a form", time: "2 min ago", type: "submission" },
              { name: "System", action: "updated exam schedule", time: "15 min ago", type: "system" },
              { name: "Michael Brown", action: "uploaded PDF", time: "1 hour ago", type: "upload" },
              { name: "Sarah Davis", action: "enrolled in program", time: "3 hours ago", type: "enrollment" }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw] p-[2vw] sm:p-[1.5vw] lg:p-[0.8vw] xl:p-[0.6vw] rounded-lg hover:bg-muted/30 transition-colors">
                <div className={`h-[6vw] w-[6vw] sm:h-[4vw] sm:w-[4vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.6vw] xl:w-[1.6vw] rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'submission' ? 'bg-blue-50' :
                  activity.type === 'system' ? 'bg-purple-50' :
                  activity.type === 'upload' ? 'bg-green-50' : 'bg-orange-50'
                }`}>
                  {activity.type === 'submission' ? <FileText className="h-[3vw] w-[3vw] sm:h-[2vw] sm:w-[2vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] text-blue-600" /> :
                   activity.type === 'system' ? <Bell className="h-[3vw] w-[3vw] sm:h-[2vw] sm:w-[2vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] text-purple-600" /> :
                   activity.type === 'upload' ? <Upload className="h-[3vw] w-[3vw] sm:h-[2vw] sm:w-[2vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] text-green-600" /> :
                   <Users className="h-[3vw] w-[3vw] sm:h-[2vw] sm:w-[2vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] text-orange-600" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
                    <span className="font-medium text-gray-900">{activity.name}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                  </p>
                  <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[0.5vw] sm:mt-[0.3vw] lg:mt-[0.2vw] xl:mt-[0.15vw]">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Upcoming Exams */}
        <Card className="border-0 shadow-sm bg-white hover-lift xl:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Upcoming Exams
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Important exam dates and notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <div key={exam.id} className="relative">
                {/* Timeline line */}
                {index !== upcomingExams.length - 1 && (
                  <div className="absolute left-6 top-12 h-6 w-0.5 bg-border" />
                )}
                
                <div className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                    exam.priority === 'high' ? 'bg-red-50' : 'bg-purple-50'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      exam.priority === 'high' ? 'text-red-600' : 'text-purple-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <p className="font-semibold text-sm text-gray-900">{exam.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{exam.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="pill-badge bg-purple-50 text-purple-700 border border-purple-200">
                            {exam.category}
                          </div>
                          {exam.priority === 'high' && (
                            <div className="pill-badge bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              High Priority
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {new Date(exam.examDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(exam.examDate).getFullYear()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings (from Firestore) */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
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
          {bookingsLoading && (
            <p className="text-sm text-muted-foreground">Loading bookings...</p>
          )}
          {bookingsError && !bookingsLoading && (
            <p className="text-sm text-red-600">{bookingsError}</p>
          )}
          {!bookingsLoading && !bookingsError && bookings.length === 0 && (
            <p className="text-sm text-muted-foreground">No bookings found.</p>
          )}
          {bookings.map((b) => {
            const when = b.bookingDate ? new Date(b.bookingDate) : (b.createdAt ? new Date(b.createdAt) : null)
            const whenStr = when ? when.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
            return (
              <div key={b.id} className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center group-hover:from-indigo-100 group-hover:to-indigo-200 transition-colors">
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
                  {b.status && (
                    <div className="text-xs text-muted-foreground">{b.status}</div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recent Form Submissions */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Recent Submissions
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Latest form submissions from students
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 gap-2">
                <BarChart3 className="h-3 w-3" />
                Filter
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-2">
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentSubmissions.map((submission) => (
            <div key={submission.id} className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                  <span className="text-sm font-bold text-blue-700">
                    {submission.studentName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{submission.studentName}</p>
                  <p className="text-xs text-muted-foreground">{submission.form}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(submission.submittedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {submission.pdfAttached && (
                  <div className="h-6 w-6 rounded bg-gray-50 flex items-center justify-center">
                    <FileText className="h-3 w-3 text-gray-600" />
                  </div>
                )}
                <div className={`pill-badge font-semibold ${
                  submission.status === 'approved' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : submission.status === 'rejected' 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {submission.status}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats Overview */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Quick Stats Overview
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Key metrics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">{enrolledStudents.length}</div>
                <div className="text-sm font-medium text-blue-600">Total Students</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700">{examNotifications.length}</div>
                <div className="text-sm font-medium text-emerald-600">Active Notifications</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-200">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700">
                  {formSubmissions.filter(f => f.status === 'pending').length}
                </div>
                <div className="text-sm font-medium text-amber-600">Pending Reviews</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

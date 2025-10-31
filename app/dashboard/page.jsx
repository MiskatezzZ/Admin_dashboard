"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { useEffect, useState } from 'react'
import { Calendar, Clock, ArrowUpRight, Users, FileText, FolderOpen, Eye, EyeOff, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge.jsx"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    seenApplications: 0,
    totalResources: 0
  })
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingBooking, setProcessingBooking] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all data in parallel
        const [usersRes, appsRes, resourcesRes] = await Promise.all([
          fetch('/api/users?limit=100', { cache: 'no-store' }),
          fetch('/api/user-applications?limit=50', { cache: 'no-store' }),
          fetch('/api/resources?limit=100', { cache: 'no-store' })
        ])

        const [usersData, appsData, resourcesData] = await Promise.all([
          usersRes.json(),
          appsRes.json(),
          resourcesRes.json()
        ])

        const users = usersData.data || []
        const applications = appsData.data || []
        const resources = resourcesData.items || []

        // Calculate stats
        const pending = applications.filter(a => a.status === 'pending' || !a.status).length
        const seen = applications.filter(a => a.status === 'seen').length

        setStats({
          totalUsers: users.length,
          totalApplications: applications.length,
          pendingApplications: pending,
          seenApplications: seen,
          totalResources: resources.length
        })

        // Get recent applications (last 5)
        setRecentApplications(applications.slice(0, 5))
      } catch (error) {
        console.error('Dashboard load error:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      bgGradient: "from-blue-500 to-blue-600",
      link: "/users"
    },
    {
      title: "Total Bookings",
      value: stats.totalApplications.toString(),
      icon: Calendar,
      bgGradient: "from-indigo-500 to-indigo-600",
      link: "/bookings"
    },
    {
      title: "Pending Bookings",
      value: stats.pendingApplications.toString(),
      icon: Clock,
      bgGradient: "from-orange-500 to-orange-600",
      link: "/bookings"
    },
    {
      title: "Resources",
      value: stats.totalResources.toString(),
      icon: FolderOpen,
      bgGradient: "from-purple-500 to-purple-600",
      link: "/resources"
    }
  ]

  return (
    <div className="space-y-[4vw] sm:space-y-[3vw] md:space-y-[2.5vw] xl:space-y-[1.8vw]">
      {/* Page Header */}
      <div>
        <h1 className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-[3.5vw] sm:text-[2.8vw] md:text-[1.8vw] xl:text-[1vw] text-gray-500 mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
          Welcome back! Here's your overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[4vw] sm:gap-[3vw] md:gap-[2vw] xl:gap-[1.5vw]">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading statistics...</div>
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Link key={index} href={stat.link}>
                <Card className="border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                  <CardContent className="p-[4.5vw] sm:p-[3.5vw] md:p-[2.2vw] xl:p-[1.5vw]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.9vw] font-medium text-gray-600 uppercase tracking-wide">
                          {stat.title}
                        </p>
                        <p className="text-[7vw] sm:text-[5.5vw] md:text-[3.5vw] xl:text-[2.4vw] font-bold text-gray-900 mt-[2vw] sm:mt-[1.5vw] md:mt-[1vw] xl:mt-[0.6vw]">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`h-[14vw] w-[14vw] sm:h-[11vw] sm:w-[11vw] md:h-[6vw] md:w-[6vw] xl:h-[4vw] xl:w-[4vw] rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-[7vw] w-[7vw] sm:h-[5.5vw] sm:w-[5.5vw] md:h-[3vw] md:w-[3vw] xl:h-[2vw] xl:w-[2vw] text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>

      {/* Recent Applications & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[4vw] sm:gap-[3vw] md:gap-[2.5vw] xl:gap-[1.8vw]">
        {/* Recent Applications */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">
                  Recent Bookings
                </CardTitle>
                <CardDescription className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500 mt-[0.8vw] sm:mt-[0.6vw] md:mt-[0.3vw] xl:mt-[0.2vw]">
                  Latest booking requests
                </CardDescription>
              </div>
              <Link href="/bookings">
                <Button variant="outline" size="sm" className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium border-gray-300">
                  View All
                  <ArrowUpRight className="ml-[1vw] sm:ml-[0.8vw] md:ml-[0.4vw] xl:ml-[0.3vw] h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] md:h-[1.2vw] md:w-[1.2vw] xl:h-[0.85vw] xl:w-[0.85vw]" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading applications...</div>
            ) : recentApplications.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No bookings yet</p>
                <p className="text-sm text-gray-400 mt-1">Booking requests will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentApplications.map((app, idx) => {
                  const bookingTime = app.createdAt?.toDate ? app.createdAt.toDate() : (app.createdAt ? new Date(app.createdAt) : new Date())
                  const timeStr = bookingTime.toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })
                  const isPending = app.status === 'pending' || !app.status
                  
                  return (
                    <div
                      key={app.id}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                          <span className="text-sm font-bold text-white">
                            {(app.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {app.name || 'Unnamed'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {app.email || app.phone || 'No contact'}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">
                              {timeStr}
                            </p>
                          </div>
                        </div>
                      </div>
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              setProcessingBooking(app.id + '-accept')
                              try {
                                // Update booking status to accepted
                                const res = await fetch('/api/user-applications', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ 
                                    id: app.id, 
                                    path: app.path, 
                                    status: 'accepted' 
                                  })
                                })
                                if (res.ok) {
                                  setRecentApplications(prev => 
                                    prev.map(a => a.id === app.id ? { ...a, status: 'accepted' } : a)
                                  )
                                  // Update stats
                                  setStats(prev => ({
                                    ...prev,
                                    pendingApplications: prev.pendingApplications - 1,
                                    seenApplications: prev.seenApplications + 1
                                  }))
                                }
                              } catch (error) {
                                console.error('Accept error:', error)
                              } finally {
                                setProcessingBooking(null)
                              }
                            }}
                            disabled={processingBooking === app.id + '-accept'}
                            className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              setProcessingBooking(app.id + '-reject')
                              try {
                                // Update booking status to rejected
                                const res = await fetch('/api/user-applications', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ 
                                    id: app.id, 
                                    path: app.path, 
                                    status: 'rejected' 
                                  })
                                })
                                if (res.ok) {
                                  setRecentApplications(prev => 
                                    prev.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a)
                                  )
                                  // Update stats
                                  setStats(prev => ({
                                    ...prev,
                                    pendingApplications: prev.pendingApplications - 1
                                  }))
                                }
                              } catch (error) {
                                console.error('Reject error:', error)
                              } finally {
                                setProcessingBooking(null)
                              }
                            }}
                            disabled={processingBooking === app.id + '-reject'}
                            className="h-8 px-3 border-red-300 text-red-600 hover:bg-red-50 text-xs"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge className={`capitalize text-xs px-2 py-1 font-medium ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'seen' ? 'bg-blue-100 text-blue-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats & Actions */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
            <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">
              Quick Overview
            </CardTitle>
            <CardDescription className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500 mt-[0.8vw] sm:mt-[0.6vw] md:mt-[0.3vw] xl:mt-[0.2vw]">
              Booking insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <>
                {/* Today's Bookings */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-gray-700">Today's Bookings</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">
                      {recentApplications.filter(app => {
                        const bookingDate = app.createdAt?.toDate ? app.createdAt.toDate() : (app.createdAt ? new Date(app.createdAt) : new Date())
                        const today = new Date()
                        return bookingDate.toDateString() === today.toDateString()
                      }).length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">New requests today</p>
                </div>

                {/* Pending Actions */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-700">Needs Attention</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</span>
                  </div>
                  <p className="text-xs text-gray-600">Pending approval</p>
                </div>

                {/* Confirmed Bookings */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700">Confirmed</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{stats.seenApplications}</span>
                  </div>
                  <p className="text-xs text-gray-600">Accepted bookings</p>
                </div>

                {/* Quick Actions */}
                <div className="pt-2 space-y-2">
                  <Link href="/bookings">
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Manage Bookings
                    </Button>
                  </Link>
                  <Link href="/users">
                    <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                      <Users className="mr-2 h-4 w-4" />
                      View Customers
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { useEffect, useState } from 'react'
import { Calendar, Clock, Search, Filter, CheckCircle, XCircle, User, Mail, Phone, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge.jsx"
import { Input } from "@/components/ui/input.jsx"
import { useRouter } from "next/navigation"

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingBooking, setProcessingBooking] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/user-applications?limit=100', { cache: 'no-store' })
      const data = await res.json()
      
      if (data.success) {
        setBookings(data.data || [])
        setFilteredBookings(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = bookings

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => {
        if (statusFilter === 'pending') return booking.status === 'pending' || !booking.status
        return booking.status === statusFilter
      })
    }

    setFilteredBookings(filtered)
  }, [searchQuery, statusFilter, bookings])

  const handleStatusUpdate = async (booking, newStatus) => {
    setProcessingBooking(booking.id + '-' + newStatus)
    try {
      const res = await fetch('/api/user-applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: booking.id, 
          path: booking.path, 
          status: newStatus 
        })
      })

      if (res.ok) {
        setBookings(prev => 
          prev.map(b => b.id === booking.id ? { ...b, status: newStatus } : b)
        )
      }
    } catch (error) {
      console.error('Status update error:', error)
    } finally {
      setProcessingBooking(null)
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending' || !b.status).length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  }

  return (
    <div className="space-y-[4vw] sm:space-y-[3vw] md:space-y-[2.5vw] xl:space-y-[1.8vw]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-gray-900">
            Booking Management
          </h1>
          <p className="text-[3.5vw] sm:text-[2.8vw] md:text-[1.8vw] xl:text-[1vw] text-gray-500 mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
            Manage all booking requests and appointments
          </p>
        </div>
        <Button 
          onClick={loadBookings} 
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[3vw] sm:gap-[2.5vw] md:gap-[2vw] xl:gap-[1.5vw]">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.5vw]">
            <div className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium text-gray-600 uppercase tracking-wide">
              Total
            </div>
            <div className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-gray-900 mt-2">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200 shadow-sm bg-orange-50/30">
          <CardContent className="p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.5vw]">
            <div className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium text-orange-700 uppercase tracking-wide">
              Pending
            </div>
            <div className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-orange-600 mt-2">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 shadow-sm bg-green-50/30">
          <CardContent className="p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.5vw]">
            <div className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium text-green-700 uppercase tracking-wide">
              Accepted
            </div>
            <div className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-green-600 mt-2">
              {stats.accepted}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-200 shadow-sm bg-red-50/30">
          <CardContent className="p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.5vw]">
            <div className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium text-red-700 uppercase tracking-wide">
              Rejected
            </div>
            <div className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-red-600 mt-2">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.5vw]">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={`capitalize ${
                    statusFilter === status 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : ''
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">
            All Bookings ({filteredBookings.length})
          </CardTitle>
          <CardDescription className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500">
            Complete list of booking requests
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin mb-3" />
              <p>Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium text-lg">No bookings found</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Booking requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => {
                const bookingTime = booking.createdAt?.toDate 
                  ? booking.createdAt.toDate() 
                  : (booking.createdAt ? new Date(booking.createdAt) : new Date())
                
                const timeStr = bookingTime.toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })

                const isPending = booking.status === 'pending' || !booking.status

                return (
                  <div
                    key={booking.id}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: User Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
                          <span className="text-lg font-bold text-white">
                            {(booking.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {booking.name || 'Unnamed'}
                          </h3>
                          
                          <div className="flex flex-col gap-1.5 mt-2">
                            {booking.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                <span className="truncate">{booking.email}</span>
                              </div>
                            )}
                            {booking.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                <span>{booking.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              <span>{timeStr}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3">
                        {isPending ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(booking, 'accepted')}
                              disabled={processingBooking === booking.id + '-accepted'}
                              className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(booking, 'rejected')}
                              disabled={processingBooking === booking.id + '-rejected'}
                              className="h-9 px-4 border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1.5" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge className={`capitalize px-3 py-1.5 font-medium ${
                            booking.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' : 
                            booking.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                            booking.status === 'seen' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {booking.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

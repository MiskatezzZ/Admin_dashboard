"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { useEffect, useState } from 'react'
import { Calendar, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge.jsx"
import Link from "next/link"

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

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length.toString(),
      icon: Calendar,
      bgGradient: "from-blue-500 to-blue-600"
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
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
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
          )
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-[4vw] sm:gap-[3vw] md:gap-[2.5vw] xl:gap-[1.8vw]">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">
                  Recent Bookings
                </CardTitle>
                <CardDescription className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500 mt-[0.8vw] sm:mt-[0.6vw] md:mt-[0.3vw] xl:mt-[0.2vw]">
                  Latest student bookings and appointments
                </CardDescription>
              </div>
              <Link href="/forms">
                <Button variant="outline" size="sm" className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium border-gray-300">
                  View All
                  <ArrowUpRight className="ml-[1vw] sm:ml-[0.8vw] md:ml-[0.4vw] xl:ml-[0.3vw] h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] md:h-[1.2vw] md:w-[1.2vw] xl:h-[0.85vw] xl:w-[0.85vw]" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {bookingsLoading && (
              <div className="p-[6vw] sm:p-[5vw] md:p-[3vw] xl:p-[2vw] text-center">
                <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1vw] text-gray-500">Loading...</p>
              </div>
            )}
            {bookingsError && !bookingsLoading && (
              <div className="p-[6vw] sm:p-[5vw] md:p-[3vw] xl:p-[2vw] text-center">
                <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1vw] text-red-600">{bookingsError}</p>
              </div>
            )}
            {!bookingsLoading && !bookingsError && bookings.length === 0 && (
              <div className="p-[8vw] sm:p-[6vw] md:p-[4vw] xl:p-[3vw] text-center">
                <Calendar className="h-[12vw] w-[12vw] sm:h-[10vw] sm:w-[10vw] md:h-[6vw] md:w-[6vw] xl:h-[4vw] xl:w-[4vw] mx-auto text-gray-300 mb-[2vw] sm:mb-[1.5vw] md:mb-[1vw] xl:mb-[0.6vw]" />
                <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1vw] text-gray-500 font-medium">No bookings found</p>
                <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.85vw] text-gray-400 mt-[1vw] sm:mt-[0.8vw] md:mt-[0.4vw] xl:mt-[0.3vw]">Bookings will appear here when students schedule appointments</p>
              </div>
            )}
            {!bookingsLoading && !bookingsError && bookings.length > 0 && (
              <div className="divide-y divide-gray-100">
                {bookings.map((b, index) => {
                  const when = b.bookingDate ? new Date(b.bookingDate) : (b.createdAt ? new Date(b.createdAt) : null)
                  const whenStr = when ? when.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
                  return (
                    <div 
                      key={b.id} 
                      className={`flex items-center justify-between p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.4vw] hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <div className="flex items-center gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw]">
                        <div className="h-[12vw] w-[12vw] sm:h-[10vw] sm:w-[10vw] md:h-[5.5vw] md:w-[5.5vw] xl:h-[3.8vw] xl:w-[3.8vw] rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                          <span className="text-[4vw] sm:text-[3.2vw] md:text-[1.8vw] xl:text-[1.3vw] font-bold text-white">
                            {(b.name || b.studentName || 'U').toString().charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[3.5vw] sm:text-[2.9vw] md:text-[1.8vw] xl:text-[1.1vw] text-gray-900">
                            {b.name || b.studentName || 'Unnamed'}
                          </p>
                          <p className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500 flex items-center gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.6vw] xl:gap-[0.4vw] mt-[0.5vw] sm:mt-[0.4vw] md:mt-[0.2vw] xl:mt-[0.15vw]">
                            {b.email || b.phone || 'No contact'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.6vw] xl:gap-[0.4vw] justify-end">
                          <Clock className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] md:h-[1.2vw] md:w-[1.2vw] xl:h-[0.85vw] xl:w-[0.85vw] text-gray-400" />
                          <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] font-medium text-gray-700">{whenStr}</span>
                        </div>
                        {b.slot && (
                          <p className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.9vw] text-blue-600 font-medium mt-[0.5vw] sm:mt-[0.4vw] md:mt-[0.2vw] xl:mt-[0.15vw]">
                            {b.slot}
                          </p>
                        )}
                        {b.status && (
                          <Badge className={`mt-[1vw] sm:mt-[0.8vw] md:mt-[0.4vw] xl:mt-[0.3vw] capitalize text-[2.5vw] sm:text-[2vw] md:text-[1.2vw] xl:text-[0.75vw] font-semibold ${
                            b.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                            b.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {b.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

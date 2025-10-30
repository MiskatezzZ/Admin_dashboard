"use client"
import React, { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { useRouter } from "next/navigation"
import { Search, Filter, ChevronLeft, ChevronRight, Calendar, Users, Clock, CheckCircle2, Check, X, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

export default function FormSubmissions() {
  const router = useRouter()
  const [apps, setApps] = useState([])
  const [appsLoading, setAppsLoading] = useState(true)
  const [appsError, setAppsError] = useState("")
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  const markUnseen = async (app) => {
    toast.promise(
      (async () => {
        const res = await fetch('/api/user-applications/mark-unseen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: app.path, userId: app.userId, id: app.id })
        })
        const json = await res.json()
        if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to update')
        setApps(prev => prev.map(x => x.id === app.id ? { ...x, status: 'pending' } : x))
        return json
      })(),
      {
        loading: 'Marking as pending...',
        success: 'Marked as pending!',
        error: (err) => err?.message || 'Failed to update status',
      }
    );
  }

  const deleteUser = async (app) => {
    if (!confirm(`Are you sure you want to delete ${app.name || 'this user'}? This will delete the user and all their applications permanently.`)) {
      return
    }

    toast.promise(
      (async () => {
        const res = await fetch('/api/users/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: app.userId })
        })
        const json = await res.json()
        if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to delete user')
        
        // Remove all applications for this user from the list
        setApps(prev => prev.filter(x => x.userId !== app.userId))
        return json
      })(),
      {
        loading: 'Deleting user...',
        success: 'User deleted successfully!',
        error: (err) => err?.message || 'Failed to delete user',
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

  // Filter and search logic
  const filteredApps = useMemo(() => {
    let filtered = [...apps]
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter)
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(app => 
        app.name?.toLowerCase().includes(query) ||
        app.email?.toLowerCase().includes(query) ||
        app.phone?.includes(query)
      )
    }
    
    return filtered
  }, [apps, statusFilter, searchQuery])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = apps.length
    const pending = apps.filter(app => app.status === 'pending').length
    const seen = apps.filter(app => app.status === 'seen').length
    const today = apps.filter(app => {
      if (!app.appliedAt) return false
      const appDate = new Date(app.appliedAt)
      const todayDate = new Date()
      return appDate.toDateString() === todayDate.toDateString()
    }).length
    
    return { total, pending, seen, today }
  }, [apps])

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage)
  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredApps.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredApps, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Form Submissions</h1>
        <p className="text-base text-gray-500">Manage and review all student applications</p>
      </div>

      {/* Statistics Cards */}
      {!appsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="group cursor-default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2.5">{stats.total}</p>
                </div>
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group cursor-default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2.5">{stats.pending}</p>
                </div>
                <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Clock className="h-7 w-7 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group cursor-default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reviewed</p>
                  <p className="text-3xl font-bold text-green-600 mt-2.5">{stats.seen}</p>
                </div>
                <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group cursor-default">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Today</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2.5">{stats.today}</p>
                </div>
                <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <Calendar className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="seen">Seen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || statusFilter !== "all") && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-gray-600">Active filters:</p>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-gray-50/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Applications</CardTitle>
              <CardDescription className="mt-1.5">
                Showing {paginatedApps.length} of {filteredApps.length} application(s)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {appsLoading && (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-sm text-gray-600">Loading applications...</p>
            </div>
          )}
          {appsError && !appsLoading && (
            <div className="p-12 text-center">
              <p className="text-sm text-red-600">{appsError}</p>
            </div>
          )}
          {!appsLoading && !appsError && apps.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">No applications found</p>
            </div>
          )}
          {!appsLoading && !appsError && filteredApps.length === 0 && apps.length > 0 && (
            <div className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">No applications match your filters</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
          {paginatedApps.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b">
                    <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Applicant</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Contact</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider">Applied</TableHead>
                    <TableHead className="font-semibold text-xs text-gray-600 uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApps.map((a) => (
                    <TableRow
                      key={a.id}
                      onClick={() => a.userId && router.push(`/forms/${a.userId}`)}
                      className="border-b border-gray-100 hover:bg-blue-50/40 transition-all duration-150 cursor-pointer group"
                    >
                      {/* Applicant Name & Email Column */}
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{a.name || '—'}</div>
                          <div className="text-xs text-gray-500">{a.email || '—'}</div>
                        </div>
                      </TableCell>

                      {/* Phone Column */}
                      <TableCell className="text-sm text-gray-600">
                        {a.phone || '—'}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <Badge 
                          className={`capitalize text-xs font-semibold px-2.5 py-1
                            ${a.status === 'seen' 
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' 
                              : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                            }
                          `}
                        >
                          {a.status || 'pending'}
                        </Badge>
                      </TableCell>

                      {/* Applied Date */}
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                        {a.appliedAt ? formatDate(a.appliedAt) : '—'}
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {a.status === 'pending' ? (
                            <Button 
                              size="sm" 
                              onClick={(e) => { e.stopPropagation(); markSeen(a) }} 
                              className="h-9 px-3 text-xs font-semibold bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md transition-all"
                            >
                              <Check className="h-3.5 w-3.5 mr-1.5" />
                              Mark Seen
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); markUnseen(a) }} 
                              className="h-9 px-3 text-xs font-semibold border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all"
                            >
                              <X className="h-3.5 w-3.5 mr-1.5" />
                              Mark Unseen
                            </Button>
                          )}
                          {a.userId && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); deleteUser(a) }} 
                              className="h-9 px-3 text-xs font-semibold border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                              Delete
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-4 font-medium hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-4 font-medium hover:bg-white transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

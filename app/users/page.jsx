"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Filter,
  Download,
  UserCheck,
  UserX,
  GraduationCap
} from "lucide-react"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function UsersEnrollments() {
  const router = useRouter();
  // Client-side data from API with fallback to local dummy data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch('/api/users?limit=100', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Failed to load users');
      setStudents(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load users');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const data = students;

  const onDelete = async (id, studentName) => {
    const confirmToast = toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 max-w-md">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Delete User?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Are you sure you want to delete "{studentName}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                toast.promise(
                  (async () => {
                    const res = await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                    const json = await res.json();
                    if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Delete failed');
                    setStudents(prev => prev.filter(s => s.id !== id));
                    return json;
                  })(),
                  {
                    loading: 'Deleting user...',
                    success: 'User deleted successfully!',
                    error: (err) => err?.message || 'Failed to delete user',
                  }
                );
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const activeStudents = data.filter(student => student.status === 'active')
  const inactiveStudents = data.filter(student => student.status === 'inactive')

  return (
    <div className="space-y-[4vw] sm:space-y-[3vw] md:space-y-[2vw] xl:space-y-[1.5vw]">
      {/* Page Header */}
      <div className="flex flex-col gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] xl:text-[2vw] font-bold text-gray-900">Users & Enrollments</h1>
          <p className="text-[3.5vw] sm:text-[2.8vw] md:text-[1.8vw] xl:text-[1vw] text-gray-500 mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
            Manage student enrollments and user accounts
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 shadow-sm bg-white group hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[1.5vw] sm:pb-[1.2vw] md:pb-[0.8vw] xl:pb-[0.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] font-semibold text-muted-foreground uppercase tracking-wider">Total Students</CardTitle>
            <div className="h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw] rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Users className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw] text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-[5vw] sm:text-[4vw] md:text-[2.5vw] xl:text-[1.8vw] font-bold text-gray-900">{data.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
              All enrolled students
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white group hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[1.5vw] sm:pb-[1.2vw] md:pb-[0.8vw] xl:pb-[0.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] font-semibold text-muted-foreground uppercase tracking-wider">Active Students</CardTitle>
            <div className="h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw] rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <UserCheck className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw] text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-[5vw] sm:text-[4vw] md:text-[2.5vw] xl:text-[1.8vw] font-bold text-gray-900">{activeStudents.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white group hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[1.5vw] sm:pb-[1.2vw] md:pb-[0.8vw] xl:pb-[0.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] font-semibold text-muted-foreground uppercase tracking-wider">Inactive Students</CardTitle>
            <div className="h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw] rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <UserX className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw] text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-[5vw] sm:text-[4vw] md:text-[2.5vw] xl:text-[1.8vw] font-bold text-gray-900">{inactiveStudents.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
              Not currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white group hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[1.5vw] sm:pb-[1.2vw] md:pb-[0.8vw] xl:pb-[0.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] font-semibold text-muted-foreground uppercase tracking-wider">New Today</CardTitle>
            <div className="h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw] rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
              <GraduationCap className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw] text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-[5vw] sm:text-[4vw] md:text-[2.5vw] xl:text-[1.8vw] font-bold text-gray-900">
              {data.filter(s => {
                if (!s.enrolledDate) return false;
                const enrolledDate = new Date(s.enrolledDate);
                const today = new Date();
                return enrolledDate.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
              Registered today
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Students Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">All Students</CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">Complete list of enrolled students</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search students..." className="pl-10 w-80 h-10 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <Button variant="outline" size="icon" className="border-gray-200 h-10 w-10 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-200 h-10 w-10 hover:bg-gray-50">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="font-semibold text-sm text-gray-600 py-4">STUDENT</TableHead>
                <TableHead className="font-semibold text-sm text-gray-600">COURSE</TableHead>
                <TableHead className="font-semibold text-sm text-gray-600">ENROLLED</TableHead>
                <TableHead className="font-semibold text-sm text-gray-600">STATUS</TableHead>
                <TableHead className="font-semibold text-sm text-gray-600">CONTACT</TableHead>
                <TableHead className="text-right font-semibold text-sm text-gray-600">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loading && !students.length) ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <span className="text-sm text-gray-500">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : error && !students.length ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <span className="text-sm text-red-600">{error}</span>
                  </TableCell>
                </TableRow>
              ) : !students.length ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <span className="text-sm text-gray-500">No users found.</span>
                  </TableCell>
                </TableRow>
              ) : data.map((student, index) => (
                <TableRow 
                  key={student.id} 
                  onClick={() => router.push(`/forms/${student.id}`)}
                  className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-semibold text-white">
                          {(student.name || student.username || student.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {student.name || student.username || student.email?.split('@')[0] || 'Unnamed User'}
                        </div>
                        <div className="text-sm text-gray-500">{student.email || '—'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700">{student.course || <span className="text-gray-400 italic">Not set</span>}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{student.enrolledDate ? formatDate(student.enrolledDate) : <span className="text-gray-400">—</span>}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize text-xs px-2.5 py-1 font-medium rounded-full ${
                      student.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {student.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{student.phone || <span className="text-gray-400 italic">Not provided</span>}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(student.id, student.name || student.username || student.email?.split('@')[0] || 'User');
                      }} 
                      className="h-8 px-3 text-xs font-medium bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <Button variant="outline" onClick={load} disabled={loading} size="sm" className="h-9 px-4 text-sm font-medium border-gray-200 hover:bg-gray-50">
              {loading ? 'Refreshing...' : 'Refresh List'}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

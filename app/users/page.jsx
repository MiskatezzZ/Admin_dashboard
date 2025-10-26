"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import React, { useEffect, useState } from "react";
import { 
  Users, 
  UserPlus, 
  Eye, 
  Edit, 
  Mail,
  Phone,
  Search, 
  Filter,
  Download,
  UserCheck,
  UserX,
  GraduationCap
} from "lucide-react"
import toast from "react-hot-toast";

export default function UsersEnrollments() {
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
        <Button className="gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.6vw] xl:gap-[0.4vw] h-[9vw] sm:h-[7vw] md:h-[3.5vw] xl:h-[2.5vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.9vw] font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0 shadow-sm hover:shadow-md transition-all">
          <UserPlus className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.4vw] md:w-[1.4vw] xl:h-[1vw] xl:w-[1vw]" />
          Add Student
        </Button>
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
            <CardTitle className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] font-semibold text-muted-foreground uppercase tracking-wider">12th Graders</CardTitle>
            <div className="h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw] rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
              <GraduationCap className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw] text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-[5vw] sm:text-[4vw] md:text-[2.5vw] xl:text-[1.8vw] font-bold text-gray-900">
              {data.filter(s => s.grade === '12th').length}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] md:text-[1.3vw] xl:text-[0.9vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw]">
              College-bound students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Distribution */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">Course Distribution</CardTitle>
          <CardDescription className="mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw] text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500">Students enrolled in each course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-[2.5vw] sm:gap-[2vw] md:gap-[1.2vw] xl:gap-[0.8vw] md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(
              data.reduce((acc, student) => {
                acc[student.course] = (acc[student.course] || 0) + 1
                return acc
              }, {})
            ).map(([course, count]) => (
              <div key={course} className="flex items-center justify-between p-[4vw] sm:p-[3vw] md:p-[2vw] xl:p-[1.4vw] border border-gray-200 rounded-[2vw] sm:rounded-[1.5vw] md:rounded-[1vw] xl:rounded-[0.6vw] hover:shadow-md hover:border-indigo-200 transition-all bg-white">
                <div>
                  <div className="font-semibold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1.05vw] text-gray-900">{course}</div>
                  <div className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.9vw] text-gray-500 mt-[0.5vw] sm:mt-[0.4vw] md:mt-[0.2vw] xl:mt-[0.15vw]">{count} {count === 1 ? 'student' : 'students'}</div>
                </div>
                <div className="h-[12vw] w-[12vw] sm:h-[10vw] sm:w-[10vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw] rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-[4vw] sm:text-[3.2vw] md:text-[1.8vw] xl:text-[1.3vw] font-bold text-indigo-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw] md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">All Students</CardTitle>
              <CardDescription className="mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw] text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500">Complete list of enrolled students</CardDescription>
            </div>
            <div className="flex gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.8vw] xl:gap-[0.5vw]">
              <div className="relative">
                <Search className="absolute left-[2vw] sm:left-[1.5vw] md:left-[1vw] xl:left-[0.6vw] top-1/2 h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.8vw] md:w-[1.8vw] xl:h-[1.2vw] xl:w-[1.2vw] -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-[7vw] sm:pl-[5.5vw] md:pl-[3.5vw] xl:pl-[2.5vw] w-[50vw] sm:w-[40vw] md:w-[25vw] xl:w-[18vw] h-[10vw] sm:h-[8vw] md:h-[5vw] xl:h-[3.5vw] text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] border-gray-200" />
              </div>
              <Button variant="outline" size="icon" className="border-gray-200 h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw]">
                <Filter className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.8vw] md:w-[1.8vw] xl:h-[1.2vw] xl:w-[1.2vw]" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-200 h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] md:h-[5vw] md:w-[5vw] xl:h-[3.5vw] xl:w-[3.5vw]">
                <Download className="h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] md:h-[1.8vw] md:w-[1.8vw] xl:h-[1.2vw] xl:w-[1.2vw]" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 border-gray-200">
                <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] py-[4vw] sm:py-[3vw] md:py-[2vw] xl:py-[1.2vw] text-gray-700">STUDENT</TableHead>
                <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">COURSE</TableHead>
                <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">GRADE</TableHead>
                <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">ENROLLED</TableHead>
                <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">STATUS</TableHead>
                <TableHead className="font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">CONTACT</TableHead>
                <TableHead className="text-right font-bold text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1vw] text-gray-700">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loading && !students.length) ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-muted-foreground">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : error && !students.length ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-red-600">{error}</span>
                  </TableCell>
                </TableRow>
              ) : !students.length ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw] text-muted-foreground">No users found.</span>
                  </TableCell>
                </TableRow>
              ) : data.map((student, index) => (
                <TableRow key={student.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <TableCell className="py-[4vw] sm:py-[3vw] md:py-[2.2vw] xl:py-[1.5vw]">
                    <div className="flex items-center gap-[3vw] sm:gap-[2.5vw] md:gap-[1.5vw] xl:gap-[1vw]">
                      <div className="w-[10vw] h-[10vw] sm:w-[8vw] sm:h-[8vw] md:w-[5vw] md:h-[5vw] xl:w-[3.5vw] xl:h-[3.5vw] rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <span className="text-[3.5vw] sm:text-[2.8vw] md:text-[1.7vw] xl:text-[1.2vw] font-bold text-white">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-[3.5vw] sm:text-[2.9vw] md:text-[1.8vw] xl:text-[1.1vw] text-gray-900">{student.name}</div>
                        <div className="text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500 mt-[0.5vw] sm:mt-[0.4vw] md:mt-[0.2vw] xl:mt-[0.15vw]">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[3.2vw] sm:text-[2.7vw] md:text-[1.7vw] xl:text-[1.05vw] text-gray-700">{student.course}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium border-gray-300">
                      {student.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[0.95vw] text-gray-600">{formatDate(student.enrolledDate)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] px-[3vw] sm:px-[2.5vw] md:px-[1.2vw] xl:px-[0.8vw] py-[1.2vw] sm:py-[1vw] md:py-[0.5vw] xl:py-[0.35vw] font-semibold rounded-[1.5vw] sm:rounded-[1.2vw] md:rounded-[0.5vw] xl:rounded-[0.3vw] ${
                      student.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[0.95vw] text-gray-600">{student.phone}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.6vw] xl:gap-[0.4vw] justify-end">
                      <Button variant="outline" size="sm" className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] px-[2.5vw] sm:px-[2vw] md:px-[1vw] xl:px-[0.7vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium border-gray-300">
                        <Eye className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] md:h-[1.2vw] md:w-[1.2vw] xl:h-[0.85vw] xl:w-[0.85vw] mr-[1vw] sm:mr-[0.8vw] md:mr-[0.4vw] xl:mr-[0.3vw]" />
                        View
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(student.id, student.name)} title="Delete" className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] px-[2.5vw] sm:px-[2vw] md:px-[1vw] xl:px-[0.7vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          <div className="mt-[3vw] sm:mt-[2.5vw] md:mt-[1.5vw] xl:mt-[1vw] pt-[3vw] sm:pt-[2.5vw] md:pt-[1.5vw] xl:pt-[1vw] border-t border-gray-100 flex justify-end">
            <Button variant="outline" onClick={load} disabled={loading} size="sm" className="h-[7vw] sm:h-[5.5vw] md:h-[3vw] xl:h-[2.2vw] text-[2.8vw] sm:text-[2.3vw] md:text-[1.4vw] xl:text-[0.85vw] font-medium border-gray-300">{loading ? 'Refreshing...' : 'Refresh List'}</Button>
          </div>
        </CardContent>
      </Card>

      {/* $oum0L@nd*/}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-[4.5vw] sm:text-[3.5vw] md:text-[2.2vw] xl:text-[1.4vw] font-bold text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="mt-[1vw] sm:mt-[0.8vw] md:mt-[0.5vw] xl:mt-[0.3vw] text-[3vw] sm:text-[2.5vw] md:text-[1.5vw] xl:text-[0.95vw] text-gray-500">Common tasks for managing enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-[2.5vw] sm:gap-[2vw] md:gap-[1.2vw] xl:gap-[0.8vw] md:grid-cols-4">
            <Button variant="outline" className="h-[18vw] sm:h-[15vw] md:h-[9vw] xl:h-[7vw] flex-col gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.8vw] xl:gap-[0.5vw] border-gray-200 hover:border-gray-300">
              <UserPlus className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw]" />
              <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw]">Bulk Import</span>
            </Button>
            <Button variant="outline" className="h-[18vw] sm:h-[15vw] md:h-[9vw] xl:h-[7vw] flex-col gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.8vw] xl:gap-[0.5vw] border-gray-200 hover:border-gray-300">
              <Download className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw]" />
              <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw]">Export List</span>
            </Button>
            <Button variant="outline" className="h-[18vw] sm:h-[15vw] md:h-[9vw] xl:h-[7vw] flex-col gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.8vw] xl:gap-[0.5vw] border-gray-200 hover:border-gray-300">
              <Mail className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw]" />
              <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw]">Send Emails</span>
            </Button>
            <Button variant="outline" className="h-[18vw] sm:h-[15vw] md:h-[9vw] xl:h-[7vw] flex-col gap-[1.5vw] sm:gap-[1.2vw] md:gap-[0.8vw] xl:gap-[0.5vw] border-gray-200 hover:border-gray-300">
              <GraduationCap className="h-[4.5vw] w-[4.5vw] sm:h-[3.5vw] sm:w-[3.5vw] md:h-[2.2vw] md:w-[2.2vw] xl:h-[1.5vw] xl:w-[1.5vw]" />
              <span className="text-[3vw] sm:text-[2.5vw] md:text-[1.6vw] xl:text-[1.1vw]">Grade Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

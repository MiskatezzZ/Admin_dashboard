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

  const onDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      const json = await res.json();
      if (!res.ok || json?.success !== true) throw new Error(json?.message || 'Delete failed');
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      alert(e?.message || 'Delete failed');
    }
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
    <div className="space-y-[4vw] sm:space-y-[3vw] lg:space-y-[2vw] xl:space-y-[1.5vw]">
      {/* Page Header */}
      <div className="flex flex-col gap-[3vw] sm:gap-[2vw] lg:flex-row lg:items-center lg:justify-between lg:gap-[1vw]">
        <div className="space-y-[1.5vw] sm:space-y-[1vw] lg:space-y-[0.5vw]">
          <h1 className="text-[6vw] sm:text-[4vw] lg:text-[2.5vw] xl:text-[2vw] font-bold tracking-tight text-foreground leading-tight">Users & Enrollments</h1>
          <p className="text-muted-foreground text-[3.5vw] sm:text-[2.5vw] lg:text-[1.2vw] xl:text-[1vw] font-medium leading-relaxed">
            Manage student enrollments and user accounts.
          </p>
        </div>
        <Button className="gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] px-[3vw] sm:px-[2vw] lg:px-[1vw] xl:px-[0.8vw] gradient-primary text-white border-0 shadow-sm hover:shadow-md transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
          <UserPlus className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
          Add New Student
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-[3vw] sm:gap-[2vw] lg:gap-[1.5vw] xl:gap-[1vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Total Students</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Users className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{data.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              <span className="text-emerald-600 font-medium">+2</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Active Students</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <UserCheck className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{activeStudents.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Inactive Students</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <UserX className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{inactiveStudents.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Not currently enrolled
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">12th Graders</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
              <GraduationCap className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">
              {data.filter(s => s.grade === '12th').length}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              College-bound students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Course Distribution</CardTitle>
          <CardDescription>Number of students enrolled in each course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(
              data.reduce((acc, student) => {
                acc[student.course] = (acc[student.course] || 0) + 1
                return acc
              }, {})
            ).map(([course, count]) => (
              <div key={course} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{course}</div>
                  <div className="text-sm text-muted-foreground">{count} students</div>
                </div>
                <div className="text-2xl font-bold text-primary">{count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>Complete list of enrolled students with contact information</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Enrolled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loading && !students.length) ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : error && !students.length ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <span className="text-sm text-red-600">{error}</span>
                  </TableCell>
                </TableRow>
              ) : !students.length ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <span className="text-sm text-muted-foreground">No users found.</span>
                  </TableCell>
                </TableRow>
              ) : data.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{student.course}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {student.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(student.enrolledDate)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{student.email}</span>
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{student.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(student.id)} title="Delete">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing student enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <UserPlus className="h-6 w-6" />
              <span>Bulk Import</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Export List</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Mail className="h-6 w-6" />
              <span>Send Emails</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <GraduationCap className="h-6 w-6" />
              <span>Grade Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

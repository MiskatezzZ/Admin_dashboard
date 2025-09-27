import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { examNotifications } from "@/lib/dummy-data.js"
import { 
  Calendar, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Search, 
  Filter,
  Bell,
  Clock,
  AlertCircle,
  BookOpen
} from "lucide-react"

export default function ExamNotifications() {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilExam = (examDate) => {
    const today = new Date()
    const exam = new Date(examDate)
    const diffTime = exam - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-[4vw] sm:space-y-[3vw] lg:space-y-[2vw] xl:space-y-[1.5vw]">
      {/* Page Header */}
      <div className="flex flex-col gap-[3vw] sm:gap-[2vw] lg:flex-row lg:items-center lg:justify-between lg:gap-[1vw]">
        <div className="space-y-[1.5vw] sm:space-y-[1vw] lg:space-y-[0.5vw]">
          <h1 className="text-[6vw] sm:text-[4vw] lg:text-[2.5vw] xl:text-[2vw] font-bold tracking-tight text-foreground leading-tight">Exam Notifications & Resources</h1>
          <p className="text-muted-foreground text-[3.5vw] sm:text-[2.5vw] lg:text-[1.2vw] xl:text-[1vw] font-medium leading-relaxed">
            Manage exam schedules, notifications, and study resources for students.
          </p>
        </div>
        <Button className="gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] px-[3vw] sm:px-[2vw] lg:px-[1vw] xl:px-[0.8vw] gradient-primary text-white border-0 shadow-sm hover:shadow-md transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
          <Plus className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
          Add New Notification
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-[3vw] sm:gap-[2vw] lg:gap-[1.5vw] xl:gap-[1vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Total Notifications</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Bell className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{examNotifications.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Active notifications
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">High Priority</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <AlertCircle className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">
              {examNotifications.filter(n => n.priority === 'high').length}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Urgent exams
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">This Month</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
              <Calendar className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">
              {examNotifications.filter(n => {
                const examDate = new Date(n.examDate)
                const today = new Date()
                return examDate.getMonth() === today.getMonth() && examDate.getFullYear() === today.getFullYear()
              }).length}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Upcoming exams
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Categories</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <BookOpen className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">
              {new Set(examNotifications.map(n => n.category)).size}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Exam types
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Notification Form */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
        <CardHeader className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw] pb-[3vw] sm:pb-[2vw] lg:pb-[1vw] xl:pb-[0.8vw]">
          <CardTitle className="text-[4vw] sm:text-[3vw] lg:text-[1.4vw] xl:text-[1.1vw] font-semibold text-foreground">Quick Add Notification</CardTitle>
          <CardDescription className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.4vw] xl:mt-[0.3vw]">Add a new exam notification for students</CardDescription>
        </CardHeader>
        <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
          <div className="grid gap-[3vw] sm:gap-[2vw] lg:gap-[1.5vw] xl:gap-[1vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Exam title" className="h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] border-gray-200 focus:border-primary/30" />
            <Input placeholder="Category" className="h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] border-gray-200 focus:border-primary/30" />
            <Input type="date" placeholder="Exam date" className="h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] border-gray-200 focus:border-primary/30" />
            <Button className="h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] gradient-primary text-white border-0 shadow-sm hover:shadow-md transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">Add Notification</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
        <CardHeader className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw] pb-[3vw] sm:pb-[2vw] lg:pb-[1vw] xl:pb-[0.8vw]">
          <div className="flex flex-col gap-[3vw] sm:gap-[2vw] lg:flex-row lg:items-center lg:justify-between lg:gap-[1vw]">
            <div>
              <CardTitle className="text-[4vw] sm:text-[3vw] lg:text-[1.4vw] xl:text-[1.1vw] font-semibold text-foreground">All Exam Notifications</CardTitle>
              <CardDescription className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.4vw] xl:mt-[0.3vw]">Manage exam schedules and important dates</CardDescription>
            </div>
            <div className="flex gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.5vw]">
              <div className="relative">
                <Search className="absolute left-[2vw] sm:left-[1.5vw] lg:left-[0.8vw] xl:left-[0.6vw] top-1/2 h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search exams..." className="pl-[6vw] sm:pl-[5vw] lg:pl-[2.5vw] xl:pl-[2vw] w-[50vw] sm:w-[40vw] lg:w-[20vw] xl:w-[16vw] h-[7vw] sm:h-[5vw] lg:h-[2.5vw] xl:h-[2vw] text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] border-gray-200 focus:border-primary/30" />
              </div>
              <Button variant="outline" size="icon" className="h-[7vw] w-[7vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2.5vw] lg:w-[2.5vw] xl:h-[2vw] xl:w-[2vw] border-gray-200">
                <Filter className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
          <div className="space-y-[2vw] sm:space-y-[1.5vw] lg:space-y-[0.8vw] xl:space-y-[0.6vw]">
            {examNotifications.map((notification) => {
              const daysUntil = getDaysUntilExam(notification.examDate)
              return (
                <div key={notification.id} className="group flex items-center justify-between p-[3vw] sm:p-[2vw] lg:p-[1.2vw] xl:p-[1vw] rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-[3vw] sm:gap-[2vw] lg:gap-[1vw] xl:gap-[0.8vw] flex-1">
                    <div className={`h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] lg:h-[3.5vw] lg:w-[3.5vw] xl:h-[2.8vw] xl:w-[2.8vw] rounded-full flex items-center justify-center font-bold text-white ${
                      daysUntil <= 7 ? 'bg-red-500' : daysUntil <= 30 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      <span className="text-[2.5vw] sm:text-[2vw] lg:text-[1vw] xl:text-[0.8vw]">{daysUntil}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-[3.5vw] sm:text-[2.8vw] lg:text-[1vw] xl:text-[0.9vw] text-gray-900">{notification.title}</p>
                          <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground line-clamp-2">{notification.description}</p>
                          <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[0.5vw] sm:mt-[0.3vw] lg:mt-[0.2vw]">
                            {formatDate(notification.examDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw] ml-[2vw] sm:ml-[1.5vw] lg:ml-[1vw]">
                          <div className="pill-badge bg-gray-50 text-gray-700 border border-gray-200">
                            {notification.category}
                          </div>
                          <div className={`pill-badge font-semibold ${
                            notification.priority === 'high' 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : notification.priority === 'medium' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {notification.priority}
                          </div>
                          <div className="flex items-center gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] xl:gap-[0.3vw]">
                            <Button variant="ghost" size="icon" className="h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2.2vw] lg:w-[2.2vw] xl:h-[1.8vw] xl:w-[1.8vw] hover:bg-gray-100">
                              <Eye className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2.2vw] lg:w-[2.2vw] xl:h-[1.8vw] xl:w-[1.8vw] hover:bg-gray-100">
                              <Edit className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2.2vw] lg:w-[2.2vw] xl:h-[1.8vw] xl:w-[1.8vw] hover:bg-red-50 text-red-600">
                              <Trash2 className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exams Timeline */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
        <CardHeader className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw] pb-[3vw] sm:pb-[2vw] lg:pb-[1vw] xl:pb-[0.8vw]">
          <CardTitle className="text-[4vw] sm:text-[3vw] lg:text-[1.4vw] xl:text-[1.1vw] font-semibold text-foreground">Upcoming Exam Timeline</CardTitle>
          <CardDescription className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.4vw] xl:mt-[0.3vw]">Visual timeline of upcoming important exams</CardDescription>
        </CardHeader>
        <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
          <div className="space-y-[3vw] sm:space-y-[2vw] lg:space-y-[1vw] xl:space-y-[0.8vw]">
            {examNotifications
              .filter(n => getDaysUntilExam(n.examDate) >= 0)
              .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
              .slice(0, 5)
              .map((notification) => {
                const daysUntil = getDaysUntilExam(notification.examDate)
                return (
                  <div key={notification.id} className="flex items-center gap-[3vw] sm:gap-[2vw] lg:gap-[1vw] xl:gap-[0.8vw] p-[3vw] sm:p-[2vw] lg:p-[1vw] xl:p-[0.8vw] border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all">
                    <div className={`w-[10vw] h-[10vw] sm:w-[8vw] sm:h-[8vw] lg:w-[3vw] lg:h-[3vw] xl:w-[2.5vw] xl:h-[2.5vw] rounded-full flex items-center justify-center text-white font-bold text-[3vw] sm:text-[2.5vw] lg:text-[1vw] xl:text-[0.8vw] ${
                      daysUntil <= 7 ? 'bg-red-500' : daysUntil <= 30 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {daysUntil}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[3.5vw] sm:text-[2.8vw] lg:text-[1vw] xl:text-[0.9vw] text-gray-900">{notification.title}</div>
                      <div className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground">{notification.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] text-gray-900">{formatDate(notification.examDate)}</div>
                      <div className={`pill-badge mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw] font-semibold ${
                        notification.priority === 'high' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : notification.priority === 'medium' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {notification.priority}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

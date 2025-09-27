import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx"
import { formSubmissions } from "@/lib/dummy-data.js"
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Upload,
  Calendar,
  Mail,
  User
} from "lucide-react"

export default function FormSubmissions() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
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

  return (
    <div className="space-y-[4vw] sm:space-y-[3vw] lg:space-y-[2vw] xl:space-y-[1.5vw]">
      {/* Page Header */}
      <div className="flex flex-col gap-[3vw] sm:gap-[2vw] lg:flex-row lg:items-center lg:justify-between lg:gap-[1vw]">
        <div className="space-y-[1.5vw] sm:space-y-[1vw] lg:space-y-[0.5vw]">
          <h1 className="text-[6vw] sm:text-[4vw] lg:text-[2.5vw] xl:text-[2vw] font-bold tracking-tight text-foreground leading-tight">Form Submissions</h1>
          <p className="text-muted-foreground text-[3.5vw] sm:text-[2.5vw] lg:text-[1.2vw] xl:text-[1vw] font-medium leading-relaxed">
            Manage and review student form submissions and documents.
          </p>
        </div>
        <Button className="gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] h-[8vw] sm:h-[6vw] lg:h-[3vw] xl:h-[2.5vw] px-[3vw] sm:px-[2vw] lg:px-[1vw] xl:px-[0.8vw] gradient-primary text-white border-0 shadow-sm hover:shadow-md transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
          <Upload className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
          Upload PDF
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-[3vw] sm:gap-[2vw] lg:gap-[1.5vw] xl:gap-[1vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Total Submissions</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <FileText className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">{formSubmissions.length}</div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              <span className="text-emerald-600 font-medium">+3</span> this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">Pending Review</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
              <Calendar className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-amber-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">
              {formSubmissions.filter(s => s.status === 'pending').length}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-white group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[2vw] sm:pb-[1.5vw] lg:pb-[0.5vw] xl:pb-[0.4vw] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw]">
            <CardTitle className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] font-semibold text-muted-foreground uppercase tracking-wider">With PDFs</CardTitle>
            <div className="h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[3vw] lg:w-[3vw] xl:h-[2.5vw] xl:w-[2.5vw] rounded-lg bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <Download className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.5vw] lg:w-[1.5vw] xl:h-[1.2vw] xl:w-[1.2vw] text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
            <div className="text-[6vw] sm:text-[4.5vw] lg:text-[2.2vw] xl:text-[1.8vw] font-bold text-gray-900">
              {formSubmissions.filter(s => s.pdfAttached).length}
            </div>
            <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.3vw] xl:mt-[0.2vw]">
              Documents attached
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
        <CardHeader className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw] pb-[3vw] sm:pb-[2vw] lg:pb-[1vw] xl:pb-[0.8vw]">
          <div className="flex flex-col gap-[3vw] sm:gap-[2vw] lg:flex-row lg:items-center lg:justify-between lg:gap-[1vw]">
            <div>
              <CardTitle className="text-[4vw] sm:text-[3vw] lg:text-[1.4vw] xl:text-[1.1vw] font-semibold text-foreground">All Submissions</CardTitle>
              <CardDescription className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.4vw] xl:mt-[0.3vw]">Review and manage student form submissions</CardDescription>
            </div>
            <div className="flex gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.5vw]">
              <div className="relative">
                <Search className="absolute left-[2vw] sm:left-[1.5vw] lg:left-[0.8vw] xl:left-[0.6vw] top-1/2 h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search submissions..." className="pl-[6vw] sm:pl-[5vw] lg:pl-[2.5vw] xl:pl-[2vw] w-[50vw] sm:w-[40vw] lg:w-[20vw] xl:w-[16vw] h-[7vw] sm:h-[5vw] lg:h-[2.5vw] xl:h-[2vw] text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] border-gray-200 focus:border-primary/30" />
              </div>
              <Button variant="outline" size="icon" className="h-[7vw] w-[7vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2.5vw] lg:w-[2.5vw] xl:h-[2vw] xl:w-[2vw] border-gray-200">
                <Filter className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
          <div className="space-y-[2vw] sm:space-y-[1.5vw] lg:space-y-[0.8vw] xl:space-y-[0.6vw]">
            {formSubmissions.map((submission) => (
              <div key={submission.id} className="group flex items-center justify-between p-[3vw] sm:p-[2vw] lg:p-[1.2vw] xl:p-[1vw] rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-[3vw] sm:gap-[2vw] lg:gap-[1vw] xl:gap-[0.8vw] flex-1">
                  <div className="h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw] lg:h-[3.5vw] lg:w-[3.5vw] xl:h-[2.8vw] xl:w-[2.8vw] rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                    <span className="text-[3vw] sm:text-[2.5vw] lg:text-[1.2vw] xl:text-[1vw] font-bold text-blue-700">
                      {submission.studentName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[3.5vw] sm:text-[2.8vw] lg:text-[1vw] xl:text-[0.9vw] text-gray-900">{submission.studentName}</p>
                        <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground">{submission.form}</p>
                        <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.8vw] xl:text-[0.7vw] text-muted-foreground mt-[0.5vw] sm:mt-[0.3vw] lg:mt-[0.2vw]">
                          {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw] ml-[2vw] sm:ml-[1.5vw] lg:ml-[1vw]">
                        <div className={`pill-badge font-semibold ${
                          submission.status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : submission.status === 'rejected' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {submission.status}
                        </div>
                        {submission.pdfAttached && (
                          <div className="h-[5vw] w-[5vw] sm:h-[4vw] sm:w-[4vw] lg:h-[1.8vw] lg:w-[1.8vw] xl:h-[1.5vw] xl:w-[1.5vw] rounded bg-gray-50 flex items-center justify-center">
                            <FileText className="h-[2.5vw] w-[2.5vw] sm:h-[2vw] sm:w-[2vw] lg:h-[0.9vw] lg:w-[0.9vw] xl:h-[0.8vw] xl:w-[0.8vw] text-gray-600" />
                          </div>
                        )}
                        <div className="flex items-center gap-[1vw] sm:gap-[0.8vw] lg:gap-[0.5vw] xl:gap-[0.3vw]">
                          <Button variant="ghost" size="icon" className="h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2.2vw] lg:w-[2.2vw] xl:h-[1.8vw] xl:w-[1.8vw] hover:bg-gray-100">
                            <Eye className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
                          </Button>
                          {submission.pdfAttached && (
                            <Button variant="ghost" size="icon" className="h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2.2vw] lg:w-[2.2vw] xl:h-[1.8vw] xl:w-[1.8vw] hover:bg-gray-100">
                              <Download className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm bg-white hover-lift">
        <CardHeader className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pt-[4vw] sm:pt-[3vw] lg:pt-[2vw] xl:pt-[1.5vw] pb-[3vw] sm:pb-[2vw] lg:pb-[1vw] xl:pb-[0.8vw]">
          <CardTitle className="text-[4vw] sm:text-[3vw] lg:text-[1.4vw] xl:text-[1.1vw] font-semibold text-foreground">Quick Actions</CardTitle>
          <CardDescription className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] text-muted-foreground mt-[1vw] sm:mt-[0.8vw] lg:mt-[0.4vw] xl:mt-[0.3vw]">Common tasks for managing form submissions</CardDescription>
        </CardHeader>
        <CardContent className="px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] pb-[4vw] sm:pb-[3vw] lg:pb-[2vw] xl:pb-[1.5vw]">
          <div className="grid gap-[3vw] sm:gap-[2vw] lg:gap-[1.5vw] xl:gap-[1vw] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-[20vw] sm:h-[15vw] lg:h-[8vw] xl:h-[6vw] flex-col gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw] border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
              <Upload className="h-[5vw] w-[5vw] sm:h-[4vw] sm:w-[4vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.5vw] xl:w-[1.5vw]" />
              <span>Bulk Upload PDFs</span>
            </Button>
            <Button variant="outline" className="h-[20vw] sm:h-[15vw] lg:h-[8vw] xl:h-[6vw] flex-col gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw] border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
              <Download className="h-[5vw] w-[5vw] sm:h-[4vw] sm:w-[4vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.5vw] xl:w-[1.5vw]" />
              <span>Export Submissions</span>
            </Button>
            <Button variant="outline" className="h-[20vw] sm:h-[15vw] lg:h-[8vw] xl:h-[6vw] flex-col gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw] border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]">
              <FileText className="h-[5vw] w-[5vw] sm:h-[4vw] sm:w-[4vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.5vw] xl:w-[1.5vw]" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

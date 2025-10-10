// Dashboard Stats
export const dashboardStats = {
  totalEnrollments: 1284,
  formSubmissions: 42,
  pdfUploads: 156,
  activeUsers: 89
}

// Form Submissions Data
export const formSubmissions = [
  {
    id: 1,
    studentName: "John Smith",
    email: "john.smith@email.com",
    form: "College Application",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    pdfAttached: true
  },
  {
    id: 2,
    studentName: "Emily Johnson",
    email: "emily.j@email.com",
    form: "Scholarship Application",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "approved",
    pdfAttached: false
  },
  {
    id: 3,
    studentName: "Michael Brown",
    email: "m.brown@email.com",
    form: "Course Enrollment",
    submittedAt: "2024-01-13T09:15:00Z",
    status: "rejected",
    pdfAttached: true
  },
  {
    id: 4,
    studentName: "Sarah Davis",
    email: "sarah.davis@email.com",
    form: "Transfer Request",
    submittedAt: "2024-01-12T16:45:00Z",
    status: "pending",
    pdfAttached: true
  },
  {
    id: 5,
    studentName: "David Wilson",
    email: "d.wilson@email.com",
    form: "Academic Appeal",
    submittedAt: "2024-01-11T11:30:00Z",
    status: "approved",
    pdfAttached: false
  }
]

// Exam Notifications Data
export const examNotifications = [
  {
    id: 1,
    title: "SAT Registration Opens",
    description: "Registration for the March SAT is now open. Deadline: February 15th",
    examDate: "2024-03-15",
    category: "Standardized Test",
    priority: "high",
    createdAt: "2024-01-10T08:00:00Z"
  },
  {
    id: 2,
    title: "AP Exam Schedule Released",
    description: "The 2024 AP exam schedule has been published. Check your subjects.",
    examDate: "2024-05-01",
    category: "AP Exams",
    priority: "medium",
    createdAt: "2024-01-08T12:00:00Z"
  },
  {
    id: 3,
    title: "University Entrance Exam",
    description: "State university entrance exam registration closes soon.",
    examDate: "2024-04-20",
    category: "University Entrance",
    priority: "high",
    createdAt: "2024-01-05T15:30:00Z"
  },
  {
    id: 4,
    title: "TOEFL Test Dates",
    description: "New TOEFL test dates added for international students.",
    examDate: "2024-02-28",
    category: "Language Test",
    priority: "low",
    createdAt: "2024-01-03T10:00:00Z"
  }
]

// Users/Enrollments Data
export const enrolledStudents = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex.t@email.com",
    course: "Computer Science Prep",
    enrolledDate: "2024-01-01",
    status: "active",
    grade: "12th",
    phone: "+1 (555) 123-4567"
  },
  {
    id: 2,
    name: "Jessica Martinez",
    email: "jessica.m@email.com",
    course: "Medical School Prep",
    enrolledDate: "2023-12-15",
    status: "active",
    grade: "12th",
    phone: "+1 (555) 234-5678"
  },
  {
    id: 3,
    name: "Ryan Chen",
    email: "ryan.c@email.com",
    course: "Engineering Prep",
    enrolledDate: "2024-01-05",
    status: "inactive",
    grade: "11th",
    phone: "+1 (555) 345-6789"
  },
  {
    id: 4,
    name: "Emma Taylor",
    email: "emma.t@email.com",
    course: "Business School Prep",
    enrolledDate: "2023-12-20",
    status: "active",
    grade: "12th",
    phone: "+1 (555) 456-7890"
  },
  {
    id: 5,
    name: "Lucas Anderson",
    email: "lucas.a@email.com",
    course: "Liberal Arts Prep",
    enrolledDate: "2024-01-08",
    status: "active",
    grade: "11th",
    phone: "+1 (555) 567-8901"
  },
  {
    id: 6,
    name: "Sophia Rodriguez",
    email: "sophia.r@email.com",
    course: "Pre-Law Program",
    enrolledDate: "2023-12-25",
    status: "active",
    grade: "12th",
    phone: "+1 (555) 678-9012"
  }
]

// Study Materials/PDF Data
export const studyMaterials = [
  {
    id: 1,
    title: "SAT Math Practice Guide",
    category: "SAT Prep",
    uploadDate: "2024-01-10",
    fileSize: "2.4 MB",
    downloads: 156,
    type: "PDF"
  },
  {
    id: 2,
    title: "College Essay Writing Tips",
    category: "Application Help",
    uploadDate: "2024-01-08",
    fileSize: "1.8 MB",
    downloads: 89,
    type: "PDF"
  },
  {
    id: 3,
    title: "AP Chemistry Study Notes",
    category: "AP Prep",
    uploadDate: "2024-01-05",
    fileSize: "5.2 MB",
    downloads: 203,
    type: "PDF"
  },
  {
    id: 4,
    title: "University Interview Guide",
    category: "Interview Prep",
    uploadDate: "2024-01-03",
    fileSize: "1.5 MB",
    downloads: 67,
    type: "PDF"
  }
]

// Navigation Items
export const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard"
  },
  {
    title: "Form Submissions",
    href: "/forms",
    icon: "FileText"
  },
  {
    title: "Exam Notifications",
    href: "/exams",
    icon: "Calendar"
  },
  {
    title: "Resources",
    href: "/resources",
    icon: "FileText"
  },
  {
    title: "Users & Enrollments",
    href: "/users",
    icon: "Users"
  }
]

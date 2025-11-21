import { Sidebar } from "./sidebar.jsx"
import { Navbar } from "./navbar.jsx"

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="app-shell">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

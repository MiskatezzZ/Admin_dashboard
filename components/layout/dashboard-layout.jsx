import { Sidebar } from "./sidebar.jsx"
import { Navbar } from "./navbar.jsx"

export function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-[3vw] sm:p-[2.5vw] lg:p-[2vw] xl:p-[1.5vw] bg-muted/20">
          <div className="max-w-[95vw] sm:max-w-[92vw] lg:max-w-[90vw] xl:max-w-[88vw] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

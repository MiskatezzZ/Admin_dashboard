import { Sidebar } from "./sidebar.jsx"
import { Navbar } from "./navbar.jsx"

export function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-[4vw] sm:p-[3vw] lg:p-[2vw] xl:p-[1.5vw] bg-muted/20">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

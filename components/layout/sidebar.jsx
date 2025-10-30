"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils.js"
import { Button } from "@/components/ui/button.jsx"
import { navigationItems } from "@/lib/dummy-data.js"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { auth } from "@/app/config/firebaseConfig.js"
import { signOut } from "firebase/auth"

const iconMap = {
  LayoutDashboard,
  FileText,
  Calendar,
  Users
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-40 lg:hidden",
        isMobileOpen ? "block" : "hidden"
      )} onClick={() => setIsMobileOpen(false)} />
      
      {/* Mobile menu button - hide when sidebar is open to avoid overlap with logo */}
      {!isMobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-40 lg:hidden bg-white/90 backdrop-blur-sm border shadow-sm h-10 w-10 sm:h-9 sm:w-9 rounded-xl"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white/95 backdrop-blur-md border-r border-border/50 transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center border-b border-border/50 transition-all duration-300",
          isCollapsed ? "h-[10vh] sm:h-[8vh] lg:h-[6vh] xl:h-[5vh] px-[2vw] sm:px-[1.5vw] lg:px-[1vw] justify-center" : "h-[10vh] sm:h-[8vh] lg:h-[6vh] xl:h-[5vh] px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw] justify-between"
        )}>
          <div className={cn("flex items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw]", isCollapsed && "justify-center")}>
            <div className="w-[12vw] h-[12vw] sm:w-[9vw] sm:h-[9vw] lg:w-[3vw] lg:h-[3vw] xl:w-[2.5vw] xl:h-[2.5vw] rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center overflow-hidden">
              <img 
                src="/askpfp.png" 
                alt="Ask Your Councillor" 
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-bold text-[3.5vw] sm:text-[2.8vw] lg:text-[1vw] xl:text-[0.9vw] text-foreground tracking-tight">Ask Your Councillor</span>
                <p className="text-[2.5vw] sm:text-[2vw] lg:text-[0.7vw] xl:text-[0.6vw] text-muted-foreground font-medium">Admin Dashboard</p>
              </div>
            )}
          </div>
          
          {/* Desktop collapse toggle */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.6vw] xl:w-[1.6vw] text-muted-foreground hover:text-foreground hover:bg-accent/50"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-[3.5vw] w-[3.5vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
            </Button>
          )}
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw]"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-[4vw] w-[4vw] sm:h-[3.5vw] sm:w-[3.5vw]" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-[2.5vw] sm:p-[2vw] lg:p-[0.8vw] xl:p-[0.6vw] space-y-[1vw] sm:space-y-[0.8vw] lg:space-y-[0.3vw] xl:space-y-[0.25vw]">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center rounded-[2vw] sm:rounded-[1.5vw] lg:rounded-[0.8vw] xl:rounded-[0.6vw] transition-all duration-200 cursor-pointer",
                    isCollapsed ? "gap-0 px-[2.5vw] sm:px-[2vw] lg:px-[0.8vw] xl:px-[0.6vw] py-[2.5vw] sm:py-[2vw] lg:py-[0.8vw] xl:py-[0.6vw] justify-center" : "gap-[2.5vw] sm:gap-[2vw] lg:gap-[0.8vw] xl:gap-[0.6vw] px-[2.5vw] sm:px-[2vw] lg:px-[0.8vw] xl:px-[0.6vw] py-[2vw] sm:py-[1.5vw] lg:py-[0.6vw] xl:py-[0.5vw]",
                    isActive 
                      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    isCollapsed ? "h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.2vw] lg:w-[1.2vw] xl:h-[1vw] xl:w-[1vw]" : "h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]",
                    isActive ? "text-blue-600" : "group-hover:text-blue-600"
                  )} />
                  {!isCollapsed && (
                    <span className="text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw] font-semibold truncate">
                      {item.title}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-[1.5vw] h-[1.5vw] sm:w-[1.2vw] sm:h-[1.2vw] lg:w-[0.4vw] lg:h-[0.4vw] xl:w-[0.3vw] xl:h-[0.3vw] rounded-full bg-blue-600" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className={cn(
          "absolute left-0 right-0 px-[3vw] sm:px-[2.5vw] lg:px-[1vw] xl:px-[0.8vw]",
          isCollapsed ? "bottom-[3vw] sm:bottom-[2.5vw] lg:bottom-[1.2vw] xl:bottom-[1vw]" : "bottom-[3vw] sm:bottom-[2.5vw] lg:bottom-[1.2vw] xl:bottom-[1vw]"
        )}>
          <Button
            onClick={() => setShowLogoutModal(true)}
            className={cn(
              "group flex items-center justify-center w-full gap-[2vw] sm:gap-[1.6vw] lg:gap-[0.7vw] xl:gap-[0.6vw] rounded-[2vw] sm:rounded-[1.5vw] lg:rounded-[0.8vw] xl:rounded-[0.6vw] bg-red-600 hover:bg-red-700 border-0 transition-all shadow-sm hover:shadow-md",
              isCollapsed ? "py-[2vw] sm:py-[1.5vw] lg:py-[0.7vw] xl:py-[0.6vw]" : "py-[2.2vw] sm:py-[1.8vw] lg:py-[0.8vw] xl:py-[0.7vw]"
            )}
          >
            <LogOut className={cn(
              "text-white transition-colors",
              isCollapsed ? "h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1.2vw] lg:w-[1.2vw] xl:h-[1vw] xl:w-[1vw]" : "h-[3.5vw] w-[3.5vw] sm:h-[2.8vw] sm:w-[2.8vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.9vw] xl:w-[0.9vw]"
            )} />
            {!isCollapsed && (
              <span className="text-[2.8vw] sm:text-[2.2vw] lg:text-[0.85vw] xl:text-[0.75vw] font-semibold text-white transition-colors">
                Logout
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Collapsed sidebar expand button */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-[3vw] sm:top-[2.5vw] lg:top-[1vw] xl:top-[0.8vw] left-[3vw] sm:left-[2.5vw] lg:left-[1vw] xl:left-[0.8vw] z-50 hidden lg:flex h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.6vw] xl:w-[1.6vw] bg-white border shadow-sm hover:bg-accent/50"
          onClick={() => setIsCollapsed(false)}
        >
          <Menu className="h-[3.5vw] w-[3.5vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
        </Button>
      )}

      {/* Professional Logout Modal */}
      {showLogoutModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-md animate-in zoom-in-95 fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <LogOut className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
                    <p className="text-sm text-gray-600 mt-0.5">You're about to end your session</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-700">
                  Are you sure you want to logout? You'll need to sign in again to access the admin dashboard.
                </p>
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutModal(false)}
                  className="px-6 font-semibold hover:bg-white transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setShowLogoutModal(false)
                    try {
                      await signOut(auth)
                      setTimeout(() => {
                        window.location.href = '/sign-in'
                      }, 150)
                    } catch (error) {
                      console.error('Logout error:', error)
                      window.location.href = '/sign-in'
                    }
                  }}
                  className="px-6 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

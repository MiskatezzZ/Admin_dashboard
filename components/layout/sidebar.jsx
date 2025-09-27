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
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

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

  return (
    <>
      {/* Mobile overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-40 lg:hidden",
        isMobileOpen ? "block" : "hidden"
      )} onClick={() => setIsMobileOpen(false)} />
      
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm border shadow-sm"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

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
            <div className="w-[8vw] h-[8vw] sm:w-[6vw] sm:h-[6vw] lg:w-[2.5vw] lg:h-[2.5vw] xl:w-[2vw] xl:h-[2vw] rounded-xl bg-white shadow-sm border flex items-center justify-center overflow-hidden">
              <img 
                src="/asklogo.png" 
                alt="Ask Your Councillor" 
                className="w-[5vw] h-[5vw] sm:w-[4vw] sm:h-[4vw] lg:w-[1.5vw] lg:h-[1.5vw] xl:w-[1.2vw] xl:h-[1.2vw] object-contain"
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
              className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer",
                    isCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2.5",
                    isActive 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    isCollapsed ? "h-5 w-5" : "h-4 w-4",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-muted-foreground text-center">
              <p>v1.0.0</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapsed sidebar expand button */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 hidden lg:flex h-8 w-8 bg-white border shadow-sm hover:bg-accent/50"
          onClick={() => setIsCollapsed(false)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}

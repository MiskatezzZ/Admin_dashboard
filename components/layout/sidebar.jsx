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
        className="fixed top-[3vw] sm:top-[2.5vw] left-[3vw] sm:left-[2.5vw] z-50 lg:hidden bg-white/80 backdrop-blur-sm border shadow-sm h-[10vw] w-[10vw] sm:h-[8vw] sm:w-[8vw]"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-[4vw] w-[4vw] sm:h-[3.5vw] sm:w-[3.5vw]" />
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

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-[3vw] sm:bottom-[2.5vw] lg:bottom-[1vw] xl:bottom-[0.8vw] left-[3vw] sm:left-[2.5vw] lg:left-[1vw] xl:left-[0.8vw] right-[3vw] sm:right-[2.5vw] lg:right-[1vw] xl:right-[0.8vw]">
            <div className="text-[2.5vw] sm:text-[2vw] lg:text-[0.7vw] xl:text-[0.6vw] text-muted-foreground text-center">
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
          className="fixed top-[3vw] sm:top-[2.5vw] lg:top-[1vw] xl:top-[0.8vw] left-[3vw] sm:left-[2.5vw] lg:left-[1vw] xl:left-[0.8vw] z-50 hidden lg:flex h-[6vw] w-[6vw] sm:h-[5vw] sm:w-[5vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.6vw] xl:w-[1.6vw] bg-white border shadow-sm hover:bg-accent/50"
          onClick={() => setIsCollapsed(false)}
        >
          <Menu className="h-[3.5vw] w-[3.5vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
        </Button>
      )}
    </>
  )
}

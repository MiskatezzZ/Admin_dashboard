"use client"

import { cn } from "@/lib/utils.js"
import { Button } from "@/components/ui/button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Badge } from "@/components/ui/badge.jsx"
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-[10vh] sm:h-[8vh] lg:h-[6vh] xl:h-[5vh] items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[1vw] xl:gap-[0.8vw] border-b border-border/50 bg-white/95 backdrop-blur-md px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw]">
      {/* Search bar */}
      <div className="flex-1 max-w-[50vw] sm:max-w-[40vw] lg:max-w-[30vw] xl:max-w-[25vw]">
        <div className="relative">
          <Search className="absolute left-[2vw] sm:left-[1.5vw] lg:left-[0.8vw] xl:left-[0.6vw] top-1/2 h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students, forms, exams..."
            className="pl-[6vw] sm:pl-[5vw] lg:pl-[2.5vw] xl:pl-[2vw] pr-[3vw] sm:pr-[2vw] lg:pr-[1vw] xl:pr-[0.8vw] h-[7vw] sm:h-[5vw] lg:h-[2.5vw] xl:h-[2vw] border-0 bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]"
          />
        </div>
      </div>

      {/* Spacer to push right content to the right */}
      <div className="flex-1"></div>

      {/* Right side actions */}
      <div className="flex items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw]">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw] lg:h-[2.5vw] lg:w-[2.5vw] xl:h-[2vw] xl:w-[2vw] hover:bg-accent/50">
          <Bell className="h-[4vw] w-[4vw] sm:h-[3vw] sm:w-[3vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] text-muted-foreground" />
          <div className="absolute -top-[0.5vw] sm:-top-[0.3vw] lg:-top-[0.2vw] xl:-top-[0.15vw] -right-[0.5vw] sm:-right-[0.3vw] lg:-right-[0.2vw] xl:-right-[0.15vw] h-[3vw] w-[3vw] sm:h-[2vw] sm:w-[2vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] bg-primary rounded-full flex items-center justify-center">
            <span className="text-[2vw] sm:text-[1.5vw] lg:text-[0.6vw] xl:text-[0.5vw] font-medium text-white">3</span>
          </div>
        </Button>

        {/* Profile dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[0.8vw] xl:gap-[0.6vw] px-[1.5vw] sm:px-[1vw] lg:px-[0.5vw] xl:px-[0.4vw] h-[8vw] sm:h-[6vw] lg:h-[2.5vw] xl:h-[2vw] hover:bg-accent/50"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="h-[6vw] w-[6vw] sm:h-[4.5vw] sm:w-[4.5vw] lg:h-[2vw] lg:w-[2vw] xl:h-[1.6vw] xl:w-[1.6vw] rounded-full bg-white border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              <img 
                src="/asklogo.png" 
                alt="Admin" 
                className="w-[3vw] h-[3vw] sm:w-[2.5vw] sm:h-[2.5vw] lg:w-[1vw] lg:h-[1vw] xl:w-[0.8vw] xl:h-[0.8vw] object-contain"
              />
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-[2.5vw] sm:text-[2vw] lg:text-[0.9vw] xl:text-[0.8vw] font-medium text-foreground">Admin</span>
              <span className="text-[2vw] sm:text-[1.5vw] lg:text-[0.7vw] xl:text-[0.6vw] text-muted-foreground">admin@company.com</span>
            </div>
            <ChevronDown className={cn(
              "h-[2.5vw] w-[2.5vw] sm:h-[2vw] sm:w-[2vw] lg:h-[0.8vw] lg:w-[0.8vw] xl:h-[0.6vw] xl:w-[0.6vw] text-muted-foreground transition-transform duration-200",
              showProfileDropdown && "rotate-180"
            )} />
          </Button>

          {/* Dropdown menu */}
          {showProfileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-white/95 backdrop-blur-md p-2 shadow-lg">
              <Button variant="ghost" className="w-full justify-start gap-3 h-9 hover:bg-accent/50" size="sm">
                <User className="h-4 w-4" />
                <span className="text-sm">Profile</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-9 hover:bg-accent/50" size="sm">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Button>
              <div className="h-px bg-border my-2" />
              <Button variant="ghost" className="w-full justify-start gap-3 h-9 text-destructive hover:bg-destructive/10" size="sm">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </header>
  )
}

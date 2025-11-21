"use client"

import { Input } from "@/components/ui/input.jsx"
import { Search, X } from "lucide-react"
import { useAuthContext } from "@/app/providers/AuthProvider.jsx"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils.js"

export function Navbar() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ users: [], applications: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search function
  useEffect(() => {
    const searchData = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ users: [], applications: [] })
        setShowResults(false)
        return
      }

      setIsSearching(true)
      setShowResults(true)

      try {
        // Search users and applications in parallel
        const [usersRes, appsRes] = await Promise.all([
          fetch(`/api/users?limit=5`).then(r => r.json()),
          fetch(`/api/user-applications?limit=10`).then(r => r.json())
        ])

        const q = searchQuery.toLowerCase()
        
        // Filter users
        const users = (usersRes.data || []).filter(u => 
          (u.name?.toLowerCase() || '').includes(q) ||
          (u.username?.toLowerCase() || '').includes(q) ||
          (u.email?.toLowerCase() || '').includes(q) ||
          (u.phone || '').includes(q)
        ).slice(0, 3)

        // Filter applications
        const applications = (appsRes.data || []).filter(a =>
          (a.name?.toLowerCase() || '').includes(q) ||
          (a.email?.toLowerCase() || '').includes(q) ||
          (a.phone || '').includes(q) ||
          (a.form?.toLowerCase() || '').includes(q)
        ).slice(0, 5)

        setSearchResults({ users, applications })
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(searchData, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults({ users: [], applications: [] })
    setShowResults(false)
  }

  return (
    <header className="sticky top-0 z-30 flex h-[10vh] sm:h-[8vh] lg:h-[6vh] xl:h-[5vh] items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[1vw] xl:gap-[0.8vw] border-b border-border/50 bg-white/95 backdrop-blur-md px-[4vw] sm:px-[3vw] lg:px-[2vw] xl:px-[1.5vw]">
      {/* Profile summary - now on the left */}
      <div className="flex items-center gap-[2vw] sm:gap-[1.5vw] lg:gap-[1vw] xl:gap-[0.8vw]">
        {user && (
          <>
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="text-[2.5vw] sm:text-[2vw] lg:text-[0.95vw] xl:text-[0.85vw] font-semibold text-foreground">
                {user.displayName || user.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="text-[2vw] sm:text-[1.6vw] lg:text-[0.75vw] xl:text-[0.65vw] text-muted-foreground tracking-tight">
                {user.email || 'No email'}
              </span>
            </div>
            <div className="h-[7vw] w-[7vw] sm:h-[5.5vw] sm:w-[5.5vw] lg:h-[2.4vw] lg:w-[2.4vw] xl:h-[2vw] xl:w-[2vw] rounded-full bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 ring-2 ring-slate-200 flex items-center justify-center text-white text-[3vw] sm:text-[2.4vw] lg:text-[0.9vw] xl:text-[0.8vw] font-semibold">
              {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </>
        )}
      </div>

      {/* Search bar - now on the right */}
      <div className="flex-1 max-w-[50vw] sm:max-w-[40vw] lg:max-w-[30vw] xl:max-w-[25vw] ml-auto" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-[2vw] sm:left-[1.5vw] lg:left-[0.8vw] xl:left-[0.6vw] top-1/2 h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw] -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students, forms, applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            className="pl-[6vw] sm:pl-[5vw] lg:pl-[2.5vw] xl:pl-[2vw] pr-[6vw] sm:pr-[5vw] lg:pr-[2.5vw] xl:pr-[2vw] h-[7vw] sm:h-[5vw] lg:h-[2.5vw] xl:h-[2vw] border-0 bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-[3vw] sm:text-[2.5vw] lg:text-[0.9vw] xl:text-[0.8vw]"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-[2vw] sm:right-[1.5vw] lg:right-[0.8vw] xl:right-[0.6vw] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-[3vw] w-[3vw] sm:h-[2.5vw] sm:w-[2.5vw] lg:h-[1vw] lg:w-[1vw] xl:h-[0.8vw] xl:w-[0.8vw]" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
              ) : (
                <>
                  {searchResults.users.length === 0 && searchResults.applications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No results found</div>
                  ) : (
                    <>
                      {/* Users Section */}
                      {searchResults.users.length > 0 && (
                        <div className="border-b border-gray-100">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">Users</div>
                          {searchResults.users.map((u) => (
                            <button
                              key={u.id}
                              onClick={() => {
                                router.push(`/forms/${u.id}`)
                                clearSearch()
                              }}
                              className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                                {(u.name || u.username || u.email || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {u.name || u.username || u.email?.split('@')[0] || 'User'}
                                </div>
                                <div className="text-xs text-gray-500 truncate">{u.email}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Applications Section */}
                      {searchResults.applications.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">Applications</div>
                          {searchResults.applications.map((a) => (
                            <button
                              key={a.id}
                              onClick={() => {
                                if (a.userId) {
                                  router.push(`/forms/${a.userId}`)
                                } else {
                                  router.push(`/forms`)
                                }
                                clearSearch()
                              }}
                              className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {a.name || 'Unnamed'}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-500 truncate">{a.email || a.phone || 'No contact'}</span>
                                  {a.status && (
                                    <span className={cn(
                                      "text-xs px-1.5 py-0.5 rounded-full font-medium",
                                      a.status === 'seen' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    )}>
                                      {a.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

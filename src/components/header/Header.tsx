
  "use client"

  import { useState, useRef, useEffect } from "react"
  import { Crown, LogOut, ChevronDown } from "lucide-react"
import type { AppDispatch } from "../../store/store"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../slice/apicalls"
import { toast } from "react-toastify"
import { logout } from "../../slice/userslice"
import { useNavigate } from "react-router-dom"

  interface HeaderProps {
    currentUser?: {
      name: string
      role: string
      initials: string
      id:string
    }
  }

  export default function Header({ currentUser }: HeaderProps) {

    const navigate=useNavigate()
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const profileDropdownRef = useRef<HTMLDivElement>(null)
const dispatch:AppDispatch=useDispatch()
const handleLogout=()=>{
  if(!currentUser?.id){
    toast.error("Something Problem pleas Login first")
    return
  }
  dispatch(logoutUser(currentUser.id))
  dispatch(logout())
  navigate('/login')
}
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
          setIsProfileDropdownOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Wavenet Solutions</h1>
                  <p className="text-sm text-gray-500">Super Admin Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button> */}

              {/* Profile Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentUser?.initials || "SA"}
                  </div>
                  <span className="hidden md:block text-gray-700">{currentUser?.name || "Super Admin"}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">My Account</p>
                      <p className="text-xs text-gray-500">{currentUser?.role || "Super Admin"}</p>
                    </div>
                    {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button> */}
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4"  />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

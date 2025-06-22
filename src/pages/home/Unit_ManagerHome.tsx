  "use client"

  import { useState, useEffect, useCallback } from "react"
  import { UserPlus, Users, AlertCircle, RefreshCw } from "lucide-react"
  import type {  UserStats, UserFilters, CreateUserRequest, UpdateUserRequest, User_Tyeps, User_create_types } from "../../types"
  import Header from "../../components/header/Header"
  import StatsCards from "../../components/StatsCard"
  import UserFiltersComponent from "../../components/Userfilter"
  import UserTable from "../../components/UserTable"
  import CreateUserModal from "../../components/auth/Createusermodal"
  import EditUserModal from "../../components/auth/EditModal"
  import DeleteUserModal from "../../components/auth/DeleteModal"
  import type { AppDispatch, RootState } from "../../store/store"
  import { useDispatch } from "react-redux"
  import { createuser, deleteuser, editUser, getallUsers } from "../../slice/apicalls"
  import { useSelector } from "react-redux"
  import { setusers } from "../../slice/userslice"
  import { toast } from "react-toastify"

  export default function UNIT_MANAGERHome() {
    const {user,users}=useSelector((state:RootState)=>state.user)
    
    const [tempusers, setTempUsers] = useState<User_Tyeps[]>(users)
    const [filteredUsers, setFilteredUsers] = useState<User_Tyeps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filters, setFilters] = useState<UserFilters>({
      role: "ALL",
      status: "ALL",
      searchTerm: "",
    })
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User_Tyeps | null>(null)
    const [userToDelete, setUserToDelete] = useState<User_Tyeps | null>(null)

    const dispatch: AppDispatch = useDispatch()
    // Optional: Get loading state from Redux if you have it in your slice
    // const { loading: reduxLoading, error: reduxError } = useSelector((state: RootState) => state.users)

    const fetchUsers = useCallback (async() => {
      try {
        setLoading(true)
        setError(null)

        const result = await dispatch(getallUsers())

        if (getallUsers.fulfilled.match(result)) {
          const userData = result.payload || []
        const filteredOutCurrentUser = userData.filter(
      (u) => u.userId !== user?.userId&&user?.role!=="ADMIN"&&user?.role!=="SUPER_ADMIN"
    )

    setTempUsers(filteredOutCurrentUser)
    setFilteredUsers(filteredOutCurrentUser)
        } else if (getallUsers.rejected.match(result)) {
          const errorMessage = result.payload?.message || "Failed to load users"
          setError(errorMessage)
        setTempUsers([])
          setFilteredUsers([])
        }
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred")
      setTempUsers([])
        setFilteredUsers([])
      } finally {
        setLoading(false)
      }
    },[dispatch,user])

    useEffect(() => {
      fetchUsers()
    }, [dispatch,fetchUsers])

    const stats: UserStats = {
      totalUsers: tempusers.length,
      superAdmins: tempusers.filter((u) => u.role === "SUPER_ADMIN").length,
      admins: tempusers.filter((u) => u.role === "ADMIN").length,
      unitManagers: tempusers.filter((u) => u.role === "UNIT_MANAGER").length,
      regularUsers: tempusers.filter((u) => u.role === "USER").length,
      activeUsers: tempusers.filter((u) => u.isActive).length,
      inactiveUsers: tempusers.filter((u) => !u.isActive).length,
    }

    useEffect(() => {
      if (tempusers.length === 0) {
        setFilteredUsers([])
        return
      }

      let filtered = tempusers

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.id?.toLowerCase().includes(searchLower) ||
            user.userId?.toLowerCase().includes(searchLower),
        )
      }

      if (filters.role !== "ALL") {
        filtered = filtered.filter((user) => user.role === filters.role)
      }

      if (filters.status !== "ALL") {
        filtered = filtered.filter((user) => (filters.status === "ACTIVE" ? user.isActive : !user.isActive))
      }

      setFilteredUsers(filtered)
    }, [tempusers, filters])

    
    const handleCreateUser = async (userData: CreateUserRequest) => {
    
  if(!user)return
      const newUser: User_create_types = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdBy:user.userId,
        password:userData.password,
        TimeZone: userData.TimeZone || "",
      
    
      }
      await dispatch(createuser(newUser)).unwrap().then((res)=>{
        console.log(res);
        
        dispatch(setusers(res))
        
        
            setTempUsers((prevUsers) => [...prevUsers, res]);

        
      })
      
    }

    const handleEditUser = (user: User_Tyeps) => {
      setSelectedUser(user)
      setIsEditModalOpen(true)
    }

    const handleUpdateUser = async (userId: string, userData: UpdateUserRequest) => {
      const updatedUsers = tempusers.map((user) =>
        user.userId === userId ? { ...user, ...userData, updatedAt: new Date() } : user,
      )
    setTempUsers(updatedUsers)
      setIsEditModalOpen(false)
      setSelectedUser(null)

      dispatch(editUser({id:userData.id||"",name:userData.name||"",role:userData.role as "ADMIN"|"SUPER_ADMIN"|"UNIT_MANAGER"|"USER",TimeZone:userData.TimeZone||""})).unwrap()
      .then(()=>{
        toast.success("Success")

      })
      .catch((err)=>{
        toast.error(err.message)
      })
      await fetchUsers()
    }

    const handleDeleteUser = (user: User_Tyeps) => {
      setUserToDelete(user)
      setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
      if (userToDelete) {
      const updatedUsers = tempusers.map((user) =>
    user.userId === userToDelete?.userId
      ? { ...user, isActive: false }
      : user
  );
      setTempUsers(updatedUsers)


        setIsDeleteModalOpen(false)
        setUserToDelete(null)
        dispatch(deleteuser(userToDelete.id)).unwrap()
        .then(()=>{
          toast.success("Success")
        }).catch((err)=>{
          toast.error(err.message)
        })

        // TODO: Dispatch delete user action to backend
        // await dispatch(deleteUser(userToDelete.userId))

        // Refresh users list to get the actual data from backend
        // await fetchUsers()
      }
    }

    const handleRefresh = () => {
      fetchUsers()
    }

    // Loading state
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Header
            currentUser={{
              name: user?.name||"UNIT MANAGER",
              role: user?.role||"UNIT MANAGER",
              initials: "UM",
              id:user?.id||""
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Loading skeleton for stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading skeleton for main content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Error state
    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Header
            currentUser={{
              name: user?.name||"UNIT MANAGER",
              role: user?.role|| "UNIT_MANAGER",
              initials: "UM",
              id:user?.id||""

            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center max-w-md">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Unable to Load Users</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <div className="space-y-3">
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                      <span>{loading ? "Retrying..." : "Try Again"}</span>
                    </button>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium block mx-auto"
                    >
                      Or create a new user
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header
          currentUser={{
            name: user?.name||"UNIT MANAGER",
            role: user?.role||"UNIT MANAGER",
            initials: "UM",
            id:user?.id||""
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StatsCards stats={stats} />

          {/* User Management Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Refresh users"
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">
                    Manage all users, admins, and unit managers in the system
                    {tempusers.length > 0 && <span className="text-sm text-gray-500 ml-2">({tempusers.length} total users)</span>}
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {tempusers.length === 0 ? (
                // Empty state when no users exist
                <div className="text-center py-16">
                  <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Users Found</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Get started by creating your first user. You can create admins, unit managers, and regular users to
                    build your team.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Create First User</span>
                    </button>
                    <button
                      onClick={handleRefresh}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 mx-auto"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <UserFiltersComponent filters={filters} onFiltersChange={setFilters} />

                  {filteredUsers.length === 0 &&
                  (filters.searchTerm || filters.role !== "ALL" || filters.status !== "ALL") ? (
                    // No results after filtering
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Match Your Filters</h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your search term or filter criteria to find users.
                      </p>
                      <div className="space-x-4">
                        <button
                          onClick={() => setFilters({ role: "ALL", status: "ALL", searchTerm: "" })}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear All Filters
                        </button>
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Create New User
                        </button>
                      </div>
                    </div>
                  ) : (
                    <UserTable users={filteredUsers} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateUser={handleCreateUser}
          creator={user!}
        />

        <EditUserModal
            editer={user}
          isOpen={isEditModalOpen}
          user={selectedUser}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedUser(null)
          }}
          onUpdateUser={handleUpdateUser}
        />

        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          user={userToDelete}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setUserToDelete(null)
          }}
          onConfirmDelete={handleConfirmDelete}
        />
      </div>
    )
  }

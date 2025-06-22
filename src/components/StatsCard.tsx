"use client"

import { Users, Crown, Shield, User, Activity } from "lucide-react"
import type { UserStats } from "../types"

interface StatsCardsProps {
  stats: UserStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <Users className="h-8 w-8 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm font-medium">Super Admins</p>
            <p className="text-3xl font-bold">{stats.superAdmins}</p>
          </div>
          <Crown className="h-8 w-8 text-yellow-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Admins</p>
            <p className="text-3xl font-bold">{stats.admins}</p>
          </div>
          <Shield className="h-8 w-8 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Unit Managers</p>
            <p className="text-3xl font-bold">{stats.unitManagers}</p>
          </div>
          <Shield className="h-8 w-8 text-indigo-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Regular Users</p>
            <p className="text-3xl font-bold">{stats.regularUsers}</p>
          </div>
          <User className="h-8 w-8 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Active Users</p>
            <p className="text-3xl font-bold">{stats.activeUsers}</p>
          </div>
          <Activity className="h-8 w-8 text-orange-200" />
        </div>
      </div>
    </div>
  )
}

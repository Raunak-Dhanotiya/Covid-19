import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { AuthContext } from '../context/AuthContext'

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar role={user?.role} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

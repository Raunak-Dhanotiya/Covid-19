import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

import Footer from '../components/Footer'

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-8 sm:px-6 lg:px-8 flex-1">
        <main className="w-full flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

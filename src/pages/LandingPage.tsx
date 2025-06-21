import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        Invoice & User Management System
      </h1>

      <p className="text-gray-600 max-w-xl text-lg mb-6">
        Manage users and invoices by role with intelligent validation, access control, and fiscal year categorization.
      </p>

      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Login
        </Link>

        <a
          href="https://your-demo-video-link.com"
          target="_blank"
          rel="noreferrer"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Watch Demo
        </a>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © 2025 Wavenet Solutions Pvt Ltd. All rights reserved.
      </footer>
    </div>
  )
}

export default Landing

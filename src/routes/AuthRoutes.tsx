import { Routes,Route } from "react-router-dom"
import Login from "../components/login/Login"
import Landing from "../pages/LandingPage"
import HomePage from "../pages/home/SuperAdminHome"
import ProtectedRoute from "../components/protector/Protector"
import AdminDashboard from "../pages/home/AdminHome"
import UserHome from "../pages/home/UserHome"



export const AuthRoutes = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/SA/home" element={
          <ProtectedRoute>

            <HomePage/>
          </ProtectedRoute>
            }
            />
        <Route path="/A/home" element={
          <ProtectedRoute>

            <AdminDashboard/>
          </ProtectedRoute>
            }
            />
        <Route path="/U/home" element={
          <ProtectedRoute>

            <UserHome/>
          </ProtectedRoute>
            }
            />
    </Routes>
    
    
    </>
  )
}

import { Routes,Route } from "react-router-dom"
import Login from "../components/login/Login"
import Landing from "../pages/LandingPage"



export const AuthRoutes = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>
    </Routes>
    
    
    </>
  )
}

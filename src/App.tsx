
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { AuthRoutes } from "./routes/AuthRoutes"
import NotFound from "./components/notfound/NotFound"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";


function App() {
 

  return (
    <>
    <Router>
      <Routes>
      
        <Route path="/*" element={<AuthRoutes/>}/>
        <Route path="*" element={<NotFound/>}/>

      </Routes>
    </Router>

          <ToastContainer position="top-right" autoClose={3000} />

 
    </>
  ) 
}
 
export default App

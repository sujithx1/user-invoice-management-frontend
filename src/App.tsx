
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { AuthRoutes } from "./routes/AuthRoutes"
import NotFound from "./components/notfound/NotFound"


function App() {
 

  return (
    <>
    <Router>
      <Routes>
      
        <Route path="/*" element={<AuthRoutes/>}/>
        <Route path="*" element={<NotFound/>}/>

      </Routes>
    </Router>
 
    </>
  ) 
}
 
export default App

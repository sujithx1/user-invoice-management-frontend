import { useDispatch } from "react-redux"
import { useForm } from "../../hooks/useform"
import type { AppDispatch } from "../../store/store"
import type { ErrorPayload, UserLogin_types } from "../../types"
import { authLogin } from "../../slice/apicalls"
import { loginSuccess } from "../../slice/userslice"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Login = () => {
  const [email,setEmail]=useForm("")
  const [password,setPassword]=useForm("")
  const navigate=useNavigate()

  const dispatch:AppDispatch=useDispatch()
  

  const handleSubmitt=async()=>{
    const data:UserLogin_types={
      email,
      password,
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    
      dispatch(authLogin(data)).unwrap()
     .then((res)=>{
       
       dispatch(loginSuccess(res))
       if (res.role=="SUPER_ADMIN") {   
        navigate('/SA/home')
      }else if(res.role=="ADMIN")
        navigate('/A/home')
        else if(res.role=="UNIT_MANAGER")
          navigate('/UM/home')
        else if(res.role=="USER")
          navigate('/U/home')
     })
     .catch((err:ErrorPayload)=>{
      toast.error(err.message)

     })
      


  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Sign In</h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={setEmail}
              value={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              onChange={setPassword}
              value={password}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Timezone</label>
            <input
              type="text"
              value={Intl.DateTimeFormat().resolvedOptions().timeZone}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300"
            onClick={handleSubmitt}
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          © 2025 Wavenet Solutions Pvt Ltd
        </p>
      </div>
    </div>
  )
}

export default Login

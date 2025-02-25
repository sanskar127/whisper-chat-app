import { Home, Signin, Signup } from "./pages"
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from "react"
import { setOnlineUsers, setSocket } from "./features/Socket/socketSlice"
import { io } from "socket.io-client"


const App = () => {
  const authUser = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (authUser) {
      // Initialize socket connection
      const mySocket = io("/", {
        query: {
          userId: authUser.uname,
        },
      })

      // Dispatch socket instance to Redux store
      dispatch(setSocket(mySocket))

      // Listen for 'getUsersOnline' event
      mySocket.on("getOnlineUsers", users => dispatch(setOnlineUsers(users)))

      // Cleanup on component unmount or authUser change
      return () => {
        if (mySocket) {
          mySocket.off("getOnlineUsers") // Remove listeners
          mySocket.close() // Close connection
          dispatch(setSocket(null)) // Optionally clear socket from Redux store
        }
      }
    }

  }, [authUser, dispatch])

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to={"/signin"} />} />
        <Route path="/signin" element={authUser ? <Navigate to={"/"} /> : <Signin />} />
        <Route path="/signup" element={authUser ? <Navigate to={"/"} /> : <Signup />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App

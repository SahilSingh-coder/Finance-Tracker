import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard" 
import Transactions from "./pages/Transactions"
import Analytics from "./pages/Analytics"
import Profile from "./pages/Profile"
import ResetPassword from "./pages/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword"

function App() {
  return (
    <BrowserRouter>
    <Navbar/>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>}/>
      <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
      <Route path="/reset-password/:token" element={<ResetPassword />}/>
      <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>
    </Routes>
    </BrowserRouter>
  )
}

export default App

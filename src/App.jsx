import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { getToken, setToken } from './api.js'
import Landing from './pages/Landing.jsx'
import Quiz from './pages/Quiz.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Wizard from './pages/Wizard.jsx'
import Counselor from './pages/Counselor.jsx'
import Clients from './pages/Clients.jsx'
import Disputes from './pages/Disputes.jsx'
import Billing from './pages/Billing.jsx'

function Protected({ children }) {
  if (!getToken()) return <Navigate to="/login" replace />
  return children
}

function Layout({ children }) {
  const navigate = useNavigate()
  const logout = () => {
    setToken(null)
    navigate('/')
  }
  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center gap-6">
        <span className="font-bold text-amber-400">DisputeTrack</span>
        <Link to="/wizard" className="text-sm text-amber-400 hover:text-amber-300">My Path</Link>
        <Link to="/dashboard" className="text-sm text-slate-300 hover:text-white">Dashboard</Link>
        <Link to="/clients" className="text-sm text-slate-300 hover:text-white">Clients</Link>
        <Link to="/disputes" className="text-sm text-slate-300 hover:text-white">Disputes</Link>
        <Link to="/billing" className="text-sm text-slate-300 hover:text-white">Billing</Link>
        <Link to="/counselor" className="text-sm text-slate-300 hover:text-white">Counselor</Link>
        <button onClick={logout} className="ml-auto text-sm text-slate-400 hover:text-white">Log out</button>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Protected><Layout><Dashboard /></Layout></Protected>} />
      <Route path="/wizard" element={<Protected><Layout><Wizard /></Layout></Protected>} />
      <Route path="/counselor" element={<Protected><Layout><Counselor /></Layout></Protected>} />
      <Route path="/clients" element={<Protected><Layout><Clients /></Layout></Protected>} />
      <Route path="/disputes" element={<Protected><Layout><Disputes /></Layout></Protected>} />
      <Route path="/billing" element={<Protected><Layout><Billing /></Layout></Protected>} />
    </Routes>
  )
}

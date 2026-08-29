import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { getToken, setToken } from './api.js'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
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
    navigate('/login')
  }
  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center gap-6">
        <span className="font-bold text-amber-400">DisputeTrack</span>
        <Link to="/" className="text-sm text-slate-300 hover:text-white">Dashboard</Link>
        <Link to="/clients" className="text-sm text-slate-300 hover:text-white">Clients</Link>
        <Link to="/disputes" className="text-sm text-slate-300 hover:text-white">Disputes</Link>
        <Link to="/billing" className="text-sm text-slate-300 hover:text-white">Billing</Link>
        <button onClick={logout} className="ml-auto text-sm text-slate-400 hover:text-white">Log out</button>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Protected><Layout><Dashboard /></Layout></Protected>} />
      <Route path="/clients" element={<Protected><Layout><Clients /></Layout></Protected>} />
      <Route path="/disputes" element={<Protected><Layout><Disputes /></Layout></Protected>} />
      <Route path="/billing" element={<Protected><Layout><Billing /></Layout></Protected>} />
    </Routes>
  )
}

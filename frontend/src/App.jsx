import { Navigate, Route, Routes } from 'react-router-dom'
import './assets/css/bootstrap.min.css'
import './assets/css/common.css'
import './assets/css/main.css'
import './assets/css/responsive.css'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import RegisterForm from './pages/RegisterForm'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
      <Route path="/feed" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const [user] = useState(() => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-left">
          <h1>Imagix Admin</h1>
        </div>
        <div className="header-right">
          {user && (
            <>
              <span className="user-name">{user.username || user.email}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      <main className="admin-main">
        {children}
      </main>

      <footer className="admin-footer">
        <p>&copy; 2026 Imagix Cinema System - Admin Dashboard</p>
      </footer>
    </div>
  )
}

export default Layout

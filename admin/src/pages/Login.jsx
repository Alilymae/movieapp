import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'
import './Login.css'

// LOGIN
const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First try to signin with existing user
      try {
        console.log('Attempting signin with:', formData.email)
        const signinResponse = await axiosInstance.post('/user/signin', {
          username: formData.email,
          password: formData.password,
        })

        console.log('Signin response:', signinResponse.data)
        // Response structure: signinResponse.data has token, _id, displayName, username, id
        if (signinResponse.data && signinResponse.data.token) {
          const token = signinResponse.data.token
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(signinResponse.data))
          toast.success('Login successful!')
          navigate('/dashboard')
          return
        }
      } catch (signinError) {
        // If signin fails because user doesn't exist, try signup
        console.log('Signin failed:', signinError.response?.data?.message || signinError.message)
        console.log('Attempting signup with:', formData.email)
        
        const signupResponse = await axiosInstance.post('/user/signup', {
          username: formData.email,
          password: formData.password,
          displayName: formData.email.split('@')[0] || formData.email,
        })

        console.log('Signup response:', signupResponse.data)
        if (signupResponse.data && signupResponse.data.token) {
          const token = signupResponse.data.token
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(signupResponse.data))
          toast.success('Account created and logged in successfully!')
          navigate('/dashboard')
          return
        }
      }
    } catch (error) {
      console.error('Auth error full:', error)
      console.error('Error response:', error.response?.data)
      const errorMsg = error.response?.data?.message || error.message
      toast.error(`Authentication failed: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Imagix Cinema Admin</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your username (min 8 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

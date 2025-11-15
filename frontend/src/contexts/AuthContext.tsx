import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

export interface User {
  id: string
  email: string
  business?: {
    name?: string
    logoUrl?: string
    address?: string
    npwp?: string
  }
  settings?: {
    theme: string
    lang: string
    currency: string
  }
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  register: (email: string, password: string, business?: any) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        /* eslint-disable-next-line no-console */
        console.error('Failed to parse stored user:', e)
      }
    }
    setLoading(false)
  }, [])

  const register = async (email: string, password: string, business?: any) => {
    try {
      const response = await api.post('/auth/register', { email, password, business })
      const { user: newUser, tokens } = response.data.data
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Registration failed'
      throw new Error(message)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user: loginUser, tokens } = response.data.data
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('user', JSON.stringify(loginUser))
      setUser(loginUser)
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Login failed'
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

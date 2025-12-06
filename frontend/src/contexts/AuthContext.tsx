import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
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
  register: (email: string, password: string, business?: { name?: string }) => Promise<void>
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
        console.error('Failed to parse stored user')
      }
    }
    setLoading(false)
  }, [])

  const register = async (email: string, password: string, businessInfo?: { name?: string }) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        businessName: businessInfo?.name
      })
      
      const { user: newUser, tokens } = response.data.data
      
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      setUser(newUser)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.message
        
        if (status === 409) {
          throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.')
        } else if (status === 400) {
          throw new Error(message || 'Data tidak valid. Periksa kembali input Anda.')
        } else if (status === 429) {
          throw new Error('Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.')
        } else {
          throw new Error(message || 'Registrasi gagal. Silakan coba lagi.')
        }
      } else {
        throw new Error('Terjadi kesalahan jaringan. Periksa koneksi internet Anda.')
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      const { user: loginUser, tokens } = response.data.data
      
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('user', JSON.stringify(loginUser))
      
      setUser(loginUser)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const message = error.response?.data?.message
        
        if (status === 401) {
          throw new Error('Email atau password salah. Silakan coba lagi.')
        } else if (status === 404) {
          throw new Error('Akun tidak ditemukan. Silakan daftar terlebih dahulu.')
        } else if (status === 429) {
          throw new Error('Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.')
        } else if (!error.response) {
          throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
        } else {
          throw new Error(message || 'Login gagal. Silakan coba lagi.')
        }
      } else {
        throw new Error('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.')
      }
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

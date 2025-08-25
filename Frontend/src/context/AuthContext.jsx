import { createContext, useContext, useEffect, useState } from 'react'
import { me, login as apiLogin, logout as apiLogout } from '../api/authApi'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await me()
        setUser(data?.user || null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])
//   console.log(user)

  const login = async (email, password) => {
    const { data } = await apiLogin(email, password)
    setUser(data.user)  // backend returns { user } and sets cookie
    return data.user
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

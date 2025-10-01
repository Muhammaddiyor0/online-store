'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthStatus() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
    supabase.auth.onAuthStateChange(() => {
      getUser()
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {user ? (
        <div>
          <span>👤 Привет, {user.email}!</span>{' '}
          <button onClick={handleLogout} style={{
            marginLeft: 10,
            padding: '4px 10px',
            background: 'crimson',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Выйти
          </button>
        </div>
      ) : (
        <button onClick={() => router.push('/login')} style={{
          padding: '4px 10px',
          background: 'dodgerblue',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          🔑 Войти / Регистрация
        </button>
      )}
    </div>
  )
}

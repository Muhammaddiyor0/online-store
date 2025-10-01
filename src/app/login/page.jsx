'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loadingAction, setLoadingAction] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('') // для уведомлений

  const handleAuth = async () => {
    setLoadingAction(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError('Неправильный email или пароль или аккаунт не подтверждён')
        else setMessage('Вход успешен!')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) setError('Ошибка регистрации: ' + error.message)
        else setMessage('Регистрация успешна! Проверьте почту, чтобы подтвердить аккаунт.')
      }
    } catch (err) {
      setError('Ошибка: ' + err.message)
    } finally {
      setLoadingAction(false)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <button
        onClick={handleAuth}
        disabled={loadingAction}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {loadingAction ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}

      <p style={{ marginTop: 10, cursor: 'pointer', color: 'blue' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </p>
    </div>
  )
}

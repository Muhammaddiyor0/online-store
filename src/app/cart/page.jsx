'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../../lib/auth'

export default function CartPage() {
  const router = useRouter()
  const { user, loading } = useUser() // теперь правильно
  const [cart, setCart] = useState([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }

    if (!loading) {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) setCart(JSON.parse(storedCart))
    }
  }, [user, loading, router])

  // пока идёт загрузка user, показываем пустой экран или лоадер
  if (loading) return <p>Загрузка...</p>

  // если user не существует — рендер не показываем (редирект сработает)
  if (!user) return null

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.prise), 0)

  const handleBuy = () => {
    if (!user) return
    localStorage.removeItem('cart')
    router.push('/success')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🛒 Ваша корзина</h1>

      {cart.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
              <h3>{item.name}</h3>
              <p>Цена: {item.prise} $</p>
            </div>
          ))}

          <h3>💰 Общая сумма: {totalPrice} $</h3>

          <button
            onClick={handleBuy}
            style={{
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            ✅ Купить
          </button>
        </>
      )}
    </div>
  )
}

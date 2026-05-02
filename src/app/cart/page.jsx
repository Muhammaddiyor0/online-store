'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [paymentType, setPaymentType] = useState(null)

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '{}')
    setCart(storedCart)
  }, [])

  const updateCart = (product, change) => {
    const newCart = { ...cart }

    if (!newCart[product.id]) {
      newCart[product.id] = { ...product, quantity: 0 }
    }

    newCart[product.id].quantity += change
    if (newCart[product.id].quantity <= 0) {
      delete newCart[product.id]
    }

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const cartItems = Object.values(cart)
  const total = cartItems.reduce(
    (sum, item) => sum + (item.prise || item.price) * (item.quantity || 1),
    0
  )

  const handleCash = () => {
    alert('Ваш заказ скоро придет 🚚')
    setShowModal(false)
  }

  const handleCard = () => {
    setPaymentType('card')
  }

  const handleMBank = () => {
    setPaymentType('mbank')
  }

  if (!cartItems.length) {
    return (
      <div style={{ padding: 20 }}>
        <Link href="/">
          <button style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: '#7000FF',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: 20
          }}>
            ← Назад
          </button>
        </Link>
        <h2>Корзина пуста 😢</h2>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <Link href="/">
        <button style={{
          padding: '8px 16px',
          borderRadius: 8,
          border: 'none',
          background: '#7000FF',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: 20
        }}>
          ← Назад
        </button>
      </Link>

      <h1 style={{ marginBottom: 20, color: '#111' }}>🛒 Корзина</h1>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center'
      }}>
        {cartItems.map(product => (
          <div key={product.id} style={{
            border: '1px solid #EFEFEF',
            padding: 15,
            width: 210,
            borderRadius: 12,
            background: '#EFEFEF',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: '100%',
                height: 230,
                objectFit: 'cover',
                borderRadius: 10
              }}
            />

            <h3 style={{ color: '#111', margin: '10px 0 5px 0' }}>
              {product.name}
            </h3>

            <p style={{
              fontWeight: 'bold',
              color: '#7000FF',
              fontSize: 18,
              margin: '5px 0'
            }}>
              {product.prise} сом
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button onClick={() => updateCart(product, -1)}> - </button>

              <span style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: '#000'
              }}>
                {product.quantity}
              </span>

              <button onClick={() => updateCart(product, 1)}> + </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20,
        paddingTop: 10,
        borderTop: '2px solid #FFD700',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <h2>Итого: {total} сом</h2>

        <button
          onClick={() => {
            setShowModal(true)
            setPaymentType(null)
          }}
          style={{
            padding: '12px 24px',
            borderRadius: 12,
            border: 'none',
            background: '#00B300',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Оплатить
        </button>
      </div>

      {/* МОДАЛКА */}
      {showModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>

    <div style={{
      background: '#fff',
      padding: 25,
      borderRadius: 16,
      width: 320,
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      animation: 'fadeIn 0.3s ease'
    }}>

      {!paymentType && (
        <>
          <h3 style={{ marginBottom: 20 }}>Выберите оплату</h3>

          <button
            onClick={handleCash}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              border: 'none',
              background: '#FFD700',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: 10
            }}
          >
            💵 Наличка
          </button>

          <button
            onClick={handleCard}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              border: 'none',
              background: '#7000FF',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: 10
            }}
          >
            💳 Карта
          </button>

          <button
            onClick={handleMBank}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 10,
              border: 'none',
              background: '#00B300',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📱 MBank
          </button>
        </>
      )}

      {paymentType === 'card' && (
        <>
          <h3 style={{ marginBottom: 10 }}>💳 Оплата картой</h3>
          <p style={{ color: '#555' }}>Номер карты:</p>

          <div style={{
            background: '#f4f4f4',
            padding: 12,
            borderRadius: 10,
            fontWeight: 'bold',
            letterSpacing: 2,
            marginBottom: 15
          }}>
            1234 5678 9012 3456
          </div>
        </>
      )}

      {paymentType === 'mbank' && (
        <>
          <h3 style={{ marginBottom: 10    }}>📱 Сканируй QR</h3>

          <img
            src="/mbank-qr.png"
            alt="QR"
            style={{
              width: '100%',
              borderRadius: 12,
              marginBottom: 10
            }}
          />
        </>
      )}

      <button
        onClick={() => setShowModal(false)}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          borderRadius: 10,
          border: 'none',
          background: '#ddd',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Закрыть
      </button>
    </div>
  </div>
)}

    </div>
  )
}
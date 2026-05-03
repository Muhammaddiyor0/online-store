'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [paymentType, setPaymentType] = useState(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '{}')
    setCart(stored)
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

  const items = Object.values(cart)

  const total = items.reduce(
    (sum, item) => sum + item.prise * item.quantity,
    0
  )

  const handleCash = () => {
    alert('Ваш заказ скоро придет 🚚')
    setShowModal(false)
  }

  return (
    <div style={styles.page}>

      {/* BACK */}
      <Link href="/">
        <button style={styles.backBtn}>← Назад</button>
      </Link>

      <h1 style={styles.title}>🛒 Корзина</h1>

      {/* ITEMS */}
      <div style={styles.grid}>
        {items.map((p) => (
          <div key={p.id} style={styles.card}>

            <img src={p.image_url} style={styles.img} />

            <div style={styles.body}>
              <h3 style={styles.name}>{p.name}</h3>
              <p style={styles.price}>{p.prise} сом</p>

              <div style={styles.qtyRow}>
                <button
                  onClick={() => updateCart(p, -1)}
                  style={styles.qtyBtn}
                >
                  -
                </button>

                <span style={styles.qty}>{p.quantity}</span>

                <button
                  onClick={() => updateCart(p, 1)}
                  style={styles.qtyBtnPlus}
                >
                  +
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* TOTAL */}
        {items.length > 0 && (
          <div style={styles.footer}>
            <h2>Итого: {total} сом</h2>

            <button
              onClick={() => {
                setShowModal(true)
                setPaymentType(null)
              }}
              style={styles.payBtn}
            >
              Оплатить
            </button>
          </div>
        )}

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>

            {!paymentType && (
              <>
                <h3>Выберите оплату</h3>

                <button onClick={handleCash} style={styles.cash}>
                  💵 Наличка
                </button>

                <button
                  onClick={() => setPaymentType('card')}
                  style={styles.cardBtn}
                >
                  💳 Карта
                </button>

                <button
                  onClick={() => setPaymentType('mbank')}
                  style={styles.mbank}
                >
                  📱 MBank
                </button>
              </>
            )}

            {paymentType === 'card' && (
              <>
                <h3>💳 Карта</h3>
                <div style={styles.cardBox}>
                  1234 5678 9012 3456
                </div>
              </>
            )}

            {paymentType === 'mbank' && (
              <>
                <h3>📱 MBank QR</h3>
                <img
                  src="https://i.ibb.co/HTWSMtw7/qr.png"
                  style={styles.qr}
                />
              </>
            )}

            <button
              onClick={() => setShowModal(false)}
              style={styles.close}
            >
              Закрыть
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 20,
    minHeight: '100vh',
    background: '#f5f5f5',
    color: '#000'
  },

  backBtn: {
    padding: '8px 14px',
    borderRadius: 10,
    border: 'none',
    background: '#7000FF',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  title: {
    margin: '15px 0'
  },

  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center'
  },

  card: {
    width: 210,
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #eee'
  },

  img: {
    width: '100%',
    height: 290,
    objectFit: 'cover'
  },

  body: {
    padding: 10
  },

  name: {
    margin: 0
  },

  price: {
    color: '#7000FF',
    fontWeight: 'bold'
  },

  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  qtyBtn: {
    width: 35,
    height: 35,
    borderRadius: 8,
    border: 'none',
    background: '#4e4e4e',
    cursor: 'pointer'
  },

  qtyBtnPlus: {
    width: 35,
    height: 35,
    borderRadius: 8,
    border: 'none',
    background: '#7000FF',
    color: '#fff',
    cursor: 'pointer'
  },

  qty: {
    fontWeight: 'bold'
  },

  footer: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '2px solid #ddd',
    paddingTop: 10
  },

  payBtn: {
    padding: '10px 18px',
    borderRadius: 12,
    border: 'none',
    background: '#00B300',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal: {
    width: 320,
    background: '#fff',
    padding: 20,
    borderRadius: 16,
    textAlign: 'center'
  },

  cash: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    border: 'none',
    background: '#FFD700',
    borderRadius: 10
  },

  cardBtn: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    border: 'none',
    background: '#7000FF',
    color: '#fff',
    borderRadius: 10
  },

  mbank: {
    width: '100%',
    padding: 10,
    border: 'none',
    background: '#00B300',
    color: '#fff',
    borderRadius: 10
  },

  cardBox: {
    background: '#f4f4f4',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    fontWeight: 'bold'
  },

  qr: {
    width: '100%',
    marginTop: 10,
    borderRadius: 12
  },

  close: {
    marginTop: 10,
    padding: 8,
    border: 'none',
    background: '#ddd',
    borderRadius: 10,
    cursor: 'pointer'
  }
}
'use client'

import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()

  return (
    <div style={{ padding: 20 }}>
      <h1>✅ Спасибо за покупку!</h1>
      <p>Ваш заказ успешно оформлен.</p>
      <button
        onClick={() => router.push('/')}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        Вернуться в магазин
      </button>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthStatus from '../components/AuthStatus'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) console.log('Ошибка Supabase:', error)
      else setProducts(data || [])
    }

    fetchProducts()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <AuthStatus />
      <h1>Магазин</h1>

      <button
        onClick={() => router.push('/cart')}
        style={{
          margin: '10px 0 20px 0',
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
        }}
      >
        🛒 Перейти в корзину
      </button>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {products.map(product => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid #ccc',
                padding: 10,
                width: 200,
                borderRadius: 8,
                boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: '100%', borderRadius: 5 }}
              />
              <h3>{product.name}</h3>
              <p>{product.prise} $</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

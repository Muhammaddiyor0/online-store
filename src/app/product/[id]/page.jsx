'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) console.error('Ошибка при загрузке товара:', error)
      else setProduct(data)
    }

    fetchProduct()
  }, [id])

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    existingCart.push(product)
    localStorage.setItem('cart', JSON.stringify(existingCart))
    alert('Товар добавлен в корзину!')
    router.push('/')
  }

  if (!product) return <p>Загрузка...</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.name}</h1>
      <img
        src={product.image_url}
        alt={product.name}
        style={{ width: 300, borderRadius: 10 }}
      />
      <h3>{product.prise} $</h3>
      <p>{product.description}</p>
      <button
        onClick={addToCart}
        style={{
          padding: '10px 20px',
          fontSize: 16,
          cursor: 'pointer',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          marginTop: 10,
        }}
      >
        Добавить в корзину
      </button>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*')
    if (error) console.error('Ошибка загрузки товаров:', error.message)
    else setProducts(data)
  }

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      if (session?.user?.email === 'znekpast@gmail.com') {
        setEmail(session.user.email)
        setLoading(false)
        fetchProducts()
      } else {
        router.push('/')
      }
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user?.email === 'znekpast@gmail.com') {
          setEmail(session.user.email)
          setLoading(false)
          fetchProducts()
        } else {
          router.push('/')
        }
      }
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleAddProduct = async () => {
    setMessage('')

    if (!name || !price || !imageUrl || !description) {
      setMessage('Заполните все поля!')
      return
    }

    const { error } = await supabase.from('products').insert([
      {
        name,
        prise: parseFloat(price),
        image_url: imageUrl,
        description,
      },
    ])

    if (error) {
      console.error('Ошибка добавления товара:', error.message)
      setMessage('Ошибка при добавлении товара')
    } else {
      setMessage('Товар успешно добавлен!')
      setName('')
      setPrice('')
      setImageUrl('')
      setDescription('')
      fetchProducts() 
    }
  }

  const handleDeleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error('Ошибка удаления:', error.message)
    } else {
      fetchProducts() // Обновляем после удаления
    }
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div style={{
      padding: 20,
      color: '#000000b8',
      }}>
      <h1>Админ панель</h1>
      <p>Вы вошли как: {email}</p>

      <h3>Добавить товар</h3>
      <input
        placeholder="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <input
        placeholder="Цена"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        style={{ display: 'block', marginBottom: 10 }}
      />
      <input
        placeholder="Ссылка на изображение"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <button onClick={handleAddProduct}>Добавить товар</button>
      {message && <p>{message}</p>}

      <hr style={{ margin: '20px 0' }} />

      <h3>Товары</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              padding: 10,
              borderRadius: 8,
              width: 200,
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', borderRadius: 5 }}
            />
            <h4>{product.name}</h4>
            <p>{product.prise} $</p>
            <button onClick={() => handleDeleteProduct(product.id)}>
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

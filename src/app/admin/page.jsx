'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AdminPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [products, setProducts] = useState([])

  const categories = [
    'Напитки',
    'Молочные',
    'Консервы',
    'Мучные',
    'Сладости',
    'Фрукты',
    'Овощи',
    'Хозяйственные',
    'Заморозка',
    'Снеки'
  ]

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (data?.user?.email === 'znekpast@gmail.com') {
        setEmail(data.user.email)
        setLoading(false)
        fetchProducts()
      } else {
        router.push('/')
      }
    }

    checkUser()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  // 📁 выбор файла
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setImageUrl('')
  }

  // 📤 загрузка в storage
  const uploadImage = async () => {
    if (!imageFile) return imageUrl

    const fileName = `${Date.now()}-${imageFile.name}`

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile)

    if (error) {
      console.log('UPLOAD ERROR:', error.message)
      setMessage('Ошибка загрузки: ' + error.message)
      return null
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleAddProduct = async () => {
    setMessage('')

    if (!name || !price || !category || !description) {
      setMessage('Заполни все поля!')
      return
    }

    let finalImage = imageUrl

    if (imageFile) {
      finalImage = await uploadImage()
    }

    if (!finalImage) {
      setMessage('Нет картинки!')
      return
    }

    const { error } = await supabase.from('products').insert([
      {
        name,
        prise: Number(price),
        image_url: finalImage,
        category,
        description
      }
    ])

    if (error) {
      setMessage('Ошибка добавления товара')
      console.log(error.message)
    } else {
      setMessage('Товар добавлен!')
      setName('')
      setPrice('')
      setImageUrl('')
      setImageFile(null)
      setCategory('')
      setDescription('')
      fetchProducts()
    }
  }

  const handleDelete = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  if (loading) return <p style={{ padding: 20 }}>Загрузка...</p>

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1>Админ панель</h1>
        <p>Вход: {email}</p>

        {/* FORM */}
        <div style={styles.form}>
          <input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />

          <input placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} style={styles.input} />

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
            <option value="">Категория</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* FILE UPLOAD */}
          <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />

          {/* URL */}
          <input
            placeholder="или URL картинки"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setImageFile(null)
            }}
            style={styles.input}
          />

          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, height: 80, }}
          />

          <button onClick={handleAddProduct} style={styles.btn}>
            Добавить
          </button>

          {message && <p>{message}</p>}
        </div>

        {/* PRODUCTS */}
        <div style={styles.grid}>
          {products.map(p => (
            <div key={p.id} style={styles.card}>

              <img src={p.image_url} style={styles.img} />

              <div style={styles.body}>
                <h4 style={{ margin: 0 }}>{p.name}</h4>
                <p style={{ color: '#7000FF', fontWeight: 'bold' }}>{p.prise} сом</p>
                <p style={{ fontSize: 12 }}>{p.category}</p>
                <p style={{ fontSize: 12 }}>{p.description}</p>
              </div>

              <button onClick={() => handleDelete(p.id)} style={styles.del}>
                удалить
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: '#f5f5f5',
    minHeight: '100vh',
    padding: 20,
    color: '#000'
  },

  container: {
    maxWidth: 1200,
    margin: '0 auto'
  },

  form: {
    background: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },

  input: {
    padding: 10,
    borderRadius: 10,
    border: '1px solid #ddd',
    outline: 'none',
    color: '#fff'
  },

  btn: {
    padding: 10,
    background: '#7000FF',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer'
  },

  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 15
  },

  card: {
    width: 228,
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #eee'
  },

  img: {
    width: '100%',
    height: 300,
    objectFit: 'cover'
  },

  body: {
    padding: 10
  },

  del: {
    width: '100%',
    padding: 8,
    border: 'none',
    background: '#ffdddd',
    color: '#c00',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}
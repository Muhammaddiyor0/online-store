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
  const [discountPercent, setDiscountPercent] = useState('')
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

  const parsePercent = (value) => {
    if (value === '' || value === null || value === undefined) return 0
    const n = Number(String(value).replace(',', '.'))
    if (Number.isNaN(n) || n < 0 || n > 100) return null
    return n
  }

  const calcDiscountPrice = (basePrice, percent) => {
    return Math.round((Number(basePrice) * (100 - Number(percent))) / 100)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setImageUrl('')
  }

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

    const { data } = supabase.storage.from('products').getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleAddProduct = async () => {
    setMessage('')

    if (!name || !price || !category || !description) {
      setMessage('Заполни все поля!')
      return
    }

    const basePrice = Number(price)
    if (Number.isNaN(basePrice) || basePrice <= 0) {
      setMessage('Цена должна быть числом больше 0')
      return
    }

    const percent = parsePercent(discountPercent)
    if (percent === null) {
      setMessage('Скидка должна быть от 0 до 100')
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

    const finalPrice = percent > 0 ? calcDiscountPrice(basePrice, percent) : basePrice

    const { error } = await supabase.from('products').insert([
      {
        name,
        prise: finalPrice,
        original_prise: basePrice,
        discount_percent: percent,
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
      setDiscountPercent('')
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

  const handleDiscount = async (product) => {
    const value = prompt('Какой процент скидки?')
    if (value === null) return

    const percent = Number(String(value).replace(',', '.'))

    if (Number.isNaN(percent) || percent < 0 || percent > 100) {
      alert('Введите число от 0 до 100')
      return
    }

    const basePrice =
      Number(product.original_prise) > 0
        ? Number(product.original_prise)
        : Number(product.prise)

    const newPrice = calcDiscountPrice(basePrice, percent)
    console.log(basePrice, percent, newPrice)

    const { error } = await supabase
      .from('products')
      .update({
        original_prise: basePrice,
        discount_percent: percent,
        prise: newPrice
      })
      .eq('id', product.id)

    if (error) {
      alert('Не удалось применить скидку')
      console.log(error.message)
      return
    }

    fetchProducts()
  }

  if (loading) return <p style={{ padding: 20 }}>Загрузка...</p>

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>Админ панель</h1>
            <p style={styles.subtitle}>Вход: {email}</p>
          </div>
        </div>

        {/* FORM */}
        <div style={styles.form}>
          <input
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Скидка %"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            style={styles.input}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          >
            <option value="">Категория</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />

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
            style={{ ...styles.input, height: 90, resize: 'vertical' }}
          />

          <button onClick={handleAddProduct} style={styles.btn}>
            Добавить
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </div>

        {/* PRODUCTS */}
        <div className="productsGrid" style={styles.grid}>
          {products.map((p) => {
            const hasDiscount = Number(p.discount_percent) > 0
            const originalPrice = Number(p.original_prise ?? p.prise)
            const currentPrice = Number(p.prise)

            return (
              <div key={p.id} style={styles.card}>
                <div style={styles.imageWrap}>
                  <img src={p.image_url} style={styles.img} alt={p.name} />
                  {hasDiscount && (
                    <div style={styles.discountBadge}>
                      -{p.discount_percent}%
                    </div>
                  )}
                </div>

                <div style={styles.body}>
                  <h4 style={styles.name}>{p.name}</h4>

                  {hasDiscount ? (
                    <div style={styles.prices}>
                      <p style={styles.oldPrice}>{originalPrice} сом</p>
                      <p style={styles.newPrice}>{currentPrice} сом</p>
                    </div>
                  ) : (
                    <p style={styles.newPrice}>{p.prise} сом</p>
                  )}

                  <p style={styles.category}>{p.category}</p>
                  <p style={styles.description}>{p.description}</p>
                </div>

                <div style={styles.actions}>
                  <button onClick={() => handleDiscount(p)} style={styles.percentBtn}>
                    %
                  </button>

                  <button onClick={() => handleDelete(p.id)} style={styles.del}>
                    удалить
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
          @media (max-width: 768px) {
            .productsGrid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
          }

          @media (max-width: 480px) {
            .productsGrid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8px !important;
            }
          }
        `}</style>
    </div>
  )
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: 'linear-gradient(180deg, #f7f7fb 0%, #f3f3f3 100%)',
    minHeight: '100vh',
    padding: 20,
    color: '#000'
  },

  container: {
    maxWidth: 1200,
    margin: '0 auto'
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },

  title: {
    margin: 0,
    fontSize: 32,
    lineHeight: 1.1
  },

  subtitle: {
    margin: '6px 0 0',
    color: '#555'
  },

  form: {
    background: '#fff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    border: '1px solid #eee'
  },

  input: {
    padding: 11,
    borderRadius: 12,
    border: '1px solid #ddd',
    outline: 'none',
    color: '#111',
    background: '#fff',
    fontSize: 15
  },

  btn: {
    padding: 12,
    background: '#7000FF',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 15,
    boxShadow: '0 6px 16px rgba(112, 0, 255, 0.22)'
  },

  message: {
    margin: '4px 0 0',
    fontWeight: 'bold'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16
  },

  card: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid #c2c2c2',
    boxShadow: '0 8px 22px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column'
  },

  imageWrap: {
    position: 'relative'
  },

  img: {
    width: '100%',
    height: 260,
    objectFit: 'cover',
    display: 'block'
  },

  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    background: '#ff3b30',
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    padding: '6px 10px',
    borderRadius: 999,
    boxShadow: '0 6px 14px rgba(255,59,48,0.24)'
  },

  body: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1
  },

  name: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.25
  },

  prices: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },

  oldPrice: {
    margin: 0,
    color: '#c00',
    fontWeight: 'bold',
    textDecoration: 'line-through',
    fontSize: 13
  },

  newPrice: {
    margin: 0,
    color: '#7000FF',
    fontWeight: 'bold',
    fontSize: 18
  },

  category: {
    margin: 0,
    fontSize: 12,
    color: '#666',
    background: '#f4f4f4',
    width: 'fit-content',
    padding: '4px 8px',
    borderRadius: 999
  },

  description: {
    margin: 0,
    fontSize: 12,
    color: '#444',
    lineHeight: 1.4
  },

  actions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    padding: 12,
    paddingTop: 0
  },

  percentBtn: {
    padding: '10px 0',
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(180deg, #7000FF 0%, #5b00d1 100%)',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 6px 14px rgba(112, 0, 255, 0.18)'
  },

  del: {
    padding: '10px 0',
    border: 'none',
    borderRadius: 12,
    background: '#ffe3e3',
    color: '#c00',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 6px 14px rgba(255, 0, 0, 0.08)'
  }
}
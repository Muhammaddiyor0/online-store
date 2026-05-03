'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [showCategories, setShowCategories] = useState(false)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({})

  const categories = [
    'Все',
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
    fetchProducts()
  }, [selectedCategory, search])

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '{}')
    setCart(storedCart)
  }, [])

  const fetchProducts = async () => {
    let query = supabase.from('products').select('*')

    if (selectedCategory !== 'Все') {
      query = query.eq('category', selectedCategory)
    }

    if (search.trim() !== '') {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query
    if (!error) setProducts(data || [])
  }

  const updateCart = (product, change) => {
    let newCart = { ...cart }

    if (!newCart[product.id]) {
      newCart[product.id] = {
        ...product,
        quantity: 0
      }
    }

    newCart[product.id].quantity += change

    if (newCart[product.id].quantity <= 0) {
      delete newCart[product.id]
    }

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  return (
    <div className="page">
      {/* 🔥 HEADER */}
      <div
        className="header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 20,
          padding: '15px 25px',
          background: '#EDDF00',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}
      >
        <h2 className="logo" style={{ color: '#ff0000', margin: 0 }}>
          🛒 Долина
        </h2>

        {/* КАТЕГОРИИ */}
        <div
          className="categoryWrap"
          style={{
            position: 'relative',
            marginRight: 'auto'
          }}
        >
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="categoryBtn"
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              background: '#000000',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            {selectedCategory} ▼
          </button>

          {showCategories && (
            <div
              className="categoryDropdown"
              style={{
                position: 'absolute',
                top: 45,
                left: 0,
                width: 200,
                maxHeight: 300,
                overflowY: 'auto',
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                zIndex: 1000
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setShowCategories(false)
                  }}
                  className="categoryItem"
                  style={{
                    padding: '10px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    background: selectedCategory === cat ? '#000' : '#f3f3f3',
                    color: selectedCategory === cat ? '#fff' : '#000',
                    fontWeight: 'bold'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ПОИСК */}
        <input
          type="text"
          placeholder="🔍 Найти товар..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
          style={{
            padding: '10px 15px',
            borderRadius: 25,
            border: 'none',
            width: 560,
            outline: 'none',
            fontSize: 16
          }}
        />

        <div
          className="actions"
          style={{ display: 'flex', gap: 15 }}
        >
          <Link href="/login">
            <button
              className="actionBtn"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                background: '#EDDF00',
                color: '#000000'
              }}
            >
              👤 Войти
            </button>
          </Link>

          <Link href="/cart">
            <button
              className="actionBtn"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                background: '#EDDF00',
                color: '#000000'
              }}
            >
              🛒 Корзина
            </button>
          </Link>
        </div>
      </div>

      {/* 🔥 PRODUCTS */}
      <div
        className="productsGrid"
        style={{
          padding: 20,
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="card"
            style={{
              border: '1px solid #EFEFEF',
              padding: 15,
              width: 210,
              borderRadius: 12,
              transition: '0.2s',
              background: '#EFEFEF'
            }}
          >
            <Link href={`/product/${product.id}`}>
              <img
                src={product.image_url}
                alt={product.name}
                className="productImage"
                style={{
                  width: '100%',
                  height: 230,
                  objectFit: 'cover',
                  borderRadius: 10,
                  cursor: 'pointer'
                }}
              />
            </Link>

            <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
              <h3
                className="productName"
                style={{ color: '#111', cursor: 'pointer', marginBottom: 8 }}
              >
                {product.name}
              </h3>
            </Link>

            <p
              className="price"
              style={{
                fontWeight: 'bold',
                color: '#7000FF',
                fontSize: 18,
                marginTop: 0
              }}
            >
              {product.prise} сом
            </p>

            {!cart[product.id] ? (
              <button
                onClick={() => updateCart(product, 1)}
                className="addBtn"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#7000FF',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                В корзину
              </button>
            ) : (
              <div
                className="qtyWrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 5
                }}
              >
                <button
                  onClick={() => updateCart(product, -1)}
                  className="qtyBtn"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: 'none',
                    background: '#ddd',
                    fontSize: 20,
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>

                <span
                  className="qtyCount"
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: '#000000'
                  }}
                >
                  {cart[product.id].quantity}
                </span>

                <button
                  onClick={() => updateCart(product, 1)}
                  className="qtyBtn"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    border: 'none',
                    background: '#7000FF',
                    color: '#fff',
                    fontSize: 20,
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .header {
            gap: 10px !important;
            padding: 10px 12px !important;
            flex-wrap: wrap !important;
            align-items: center !important;
          }

          .logo {
            font-size: 18px !important;
            margin-right: auto !important;
          }

          .categoryWrap {
            margin-right: 0 !important;
          }

          .categoryBtn {
            padding: 8px 12px !important;
            font-size: 13px !important;
            border-radius: 14px !important;
          }

          .searchInput {
            width: 100% !important;
            order: 3 !important;
            flex: 1 1 100% !important;
            font-size: 14px !important;
            padding: 10px 12px !important;
          }

          .actions {
            width: 100% !important;
            order: 4 !important;
            justify-content: space-between !important;
            gap: 8px !important;
          }

          .actionBtn {
            padding: 9px 12px !important;
            font-size: 13px !important;
            width: 100% !important;
          }

          .productsGrid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            padding: 10px !important;
            justify-content: stretch !important;
          }

          .card {
            width: auto !important;
            padding: 10px !important;
            border-radius: 10px !important;
          }

          .productImage {
            height: 120px !important;
          }

          .productName {
            font-size: 13px !important;
            line-height: 1.2 !important;
            min-height: 32px !important;
          }

          .price {
            font-size: 15px !important;
          }

          .addBtn {
            padding: 9px !important;
            font-size: 13px !important;
          }

          .qtyWrap {
            gap: 8px !important;
          }

          .qtyBtn {
            width: 34px !important;
            height: 34px !important;
            font-size: 18px !important;
          }

          .qtyCount {
            font-size: 16px !important;
          }

          .categoryDropdown {
            width: 230px !important;
            max-width: calc(100vw - 24px) !important;
          }
        }
      `}</style>
    </div>
  )
}
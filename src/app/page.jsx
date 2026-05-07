'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [showCategories, setShowCategories] = useState(false)
  const [showCategoryLanding, setShowCategoryLanding] = useState(false)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({})
  const [user, setUser] = useState(null)
  

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

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }

    getUser()
  }, [])

  useEffect(() => {
  const visited = sessionStorage.getItem('visitedHome')

  if (!visited) {
    setShowCategoryLanding(true)
    sessionStorage.setItem('visitedHome', 'true')
  }
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

  const openCategory = (cat) => {
    setSelectedCategory(cat)
    setShowCategoryLanding(false)
    setShowCategories(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBackToCategories = () => {
    setSelectedCategory('Все')
    setShowCategoryLanding(true)
    setShowCategories(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page">
      {/* HEADER */}
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
          zIndex: 999,
          flexWrap: 'wrap'
        }}
      >
        <h2 className="logo" style={{ color: '#ff0000', margin: 0 }}>
          🛒 Долина
        </h2>

        {user?.email === 'znekpast@gmail.com' && (
          <div className="adminWrap">
            <Link href="/admin">
              <button
                className="adminBtn"
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  background: '#343434',
                  color: '#ffffff'
                }}
              >
                ⚙️ Админ
              </button>
            </Link>
          </div>
        )}

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
              background: '#343434',
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
                  onClick={() => openCategory(cat)}
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
            width: '100%',
            maxWidth: 560,
            minWidth: 240,
            flex: '1 1 420px',
            outline: 'none',
            fontSize: 16
          }}
        />

        <div className="actions" style={{ display: 'flex', gap: 15 }}>
          <div className="loginWrap">
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
          </div>

          <div className="cartWrap">
            <Link href="/cart">
              <button
                className="actionBtn"
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  background: '#343434',
                  color: '#ffffff'
                }}
              >
                🛒 Корзина
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* КНОПКА НАЗАД */}
      {!showCategoryLanding && (
        <div className="backRow">
          <button onClick={goBackToCategories} className="backBtn">
            ← Назад
          </button>
        </div>
      )}

      {/* ПЕРВЫЙ ЭКРАН С КАТЕГОРИЯМИ */}
      {showCategoryLanding && (
        <div className="landingWrap">
          <div className="landingBox">
            <h1 className="landingTitle">Выбери категорию</h1>
            <p className="landingText">
              Нажми на любую категорию, и ниже откроются только нужные товары.
            </p>

            <div className="landingGrid">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => openCategory(cat)}
                  className="landingCard"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {!showCategoryLanding && (
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
                background: '#EFEFEF',
                display: 'flex',
                flexDirection: 'column'
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

              <Link
                href={`/product/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <h3
                  className="productName"
                  style={{
                    color: '#111',
                    cursor: 'pointer',
                    marginBottom: 8,
                    minHeight: 43,
                  }}
                >
                  {product.name}
                </h3>
              </Link>

              <p
                className="price"
                style={{
                  fontWeight: 'bold',
                  color: '#7000FF',
                  fontSize: 22,
                  marginTop:-5,
                  marginBottom: 5
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
      )}

      <style jsx>{`
        .backRow {
          position: sticky;
          top: 78px;
          z-index: 998;
          display: flex;
          justify-content: flex-start;
          padding: 12px 20px 0 20px;
        }

        .backBtn {
          border: none;
          background: #343434;
          color: #fff;
          padding: 10px 16px;
          border-radius: 14px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .landingWrap {
          padding: 18px 20px 0 20px;
        }

        .landingBox {
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(180deg, #fff7a8 0%, #ffffff 100%);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .landingTitle {
          margin: 0 0 8px 0;
          font-size: 32px;
          color: #111;
        }

        .landingText {
          margin: 0 0 18px 0;
          color: #444;
          font-size: 16px;
        }

        .landingGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .landingCard {
          border: none;
          border-radius: 18px;
          background: #343434;
          color: #fff;
          padding: 18px 14px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
          min-height: 64px;
        }

        .landingCard:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        @media (max-width: 768px) {
          .header {
            display: grid !important;
            grid-template-columns: 1fr auto auto;
            grid-template-areas:
              'logo admin login'
              'category category cart'
              'search search search';
            gap: 10px !important;
            padding: 10px !important;
            align-items: center !important;
          }

          .logo {
            grid-area: logo;
            justify-self: start;
          }

          .adminWrap {
            grid-area: admin;
            justify-self: start;
          }

          .loginWrap {
            grid-area: login;
            justify-self: end;
          }

          .categoryWrap {
            grid-area: category;
            margin-right: 0 !important;
            justify-self: start;
          }

          .cartWrap {
            grid-area: cart;
            justify-self: end;
          }

          .searchInput {
            grid-area: search;
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
          }

          .actions {
            display: contents !important;
          }

          .productsGrid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            padding: 10px !important;
          }

          .card {
            width: 100% !important;
          }

          .productImage {
            height: 220px !important;
          }

          .landingWrap {
            padding: 12px 10px 0 10px;
          }

          .landingBox {
            padding: 16px;
            border-radius: 18px;
          }

          .landingTitle {
            font-size: 24px;
          }

          .landingText {
            font-size: 14px;
          }

          .landingGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .landingCard {
            padding: 14px 10px;
            font-size: 14px;
            min-height: 56px;
          }

          .backRow {
            top: 72px;
            padding: 10px 10px 0 10px;
          }

          .backBtn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
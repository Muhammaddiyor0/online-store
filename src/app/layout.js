import './globals.css'

export const metadata = {
  title: 'Долина',
  description: 'Магазин продуктов',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  )
}

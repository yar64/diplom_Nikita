// app/layout.js
import Header from '@/components/layout/Header.jsx'
import './globals.css'

export const metadata = {
  title: 'Skills Tracker - Learn and Grow',
  description: 'Track your skills progress with our modern learning platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
// app/layout.js
'use client';
import { usePathname } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/login') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password');

  return (
    <html lang="ru">
      <body>
        {/* Показываем Header ТОЛЬКО на обычных страницах */}
        {!isAdminPage && <Header />}

        <main>
          {children}
        </main>

        {/* Показываем Footer ТОЛЬКО на обычных страницах */}
        {!isAdminPage && !isAuthPage && <Footer />}
      </body>
    </html>
  );
}
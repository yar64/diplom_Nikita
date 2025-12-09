// app/layout.js
'use client';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../contexts/AuthContext';
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
        {/* ОБЕРТЫВАЕМ В AuthProvider */}
        <AuthProvider>
          {!isAdminPage && <Header />}

          <main>
            {children}
          </main>

          {/* Показываем Footer ТОЛЬКО на обычных страницах */}
          {!isAdminPage && !isAuthPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
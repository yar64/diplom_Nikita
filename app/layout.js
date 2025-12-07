// app/layout.js
'use client'; // Добавляем чтобы использовать usePathname
import { usePathname } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="ru">
      <body>
        {/* Показываем Header/Footer ТОЛЬКО на НЕ-админских страницах */}
        {!isAdminPage && <Header />}

        <main className={isAdminPage ? 'h-screen' : ''}>
          {children}
        </main>

        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
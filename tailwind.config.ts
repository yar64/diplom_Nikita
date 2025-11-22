/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          accent: '#f1f5f9',
          text: {
            primary: '#1e293b',
            secondary: '#64748b',
            muted: '#94a3b8'
          },
          emerald: {
            400: '#34d399',
            500: '#10b981', 
            600: '#059669'
          },
          blue: {
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb'
          },
          amber: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706'
          }
        }
      }
    },
  },
  plugins: [],
}
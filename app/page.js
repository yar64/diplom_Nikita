// app/page.js
import Hero from '../components/home/Hero'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      {/* Остальные секции будут добавляться позже */}
    </div>
  )
}
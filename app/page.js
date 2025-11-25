// app/page.js
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Categories from '../components/home/Categories';
import Courses from '../components/home/Courses';
import Instructors from '../components/home/Instructors';
import Testimonials from '../components/home/Testimonials';
import JoinSection from '../components/home/JoinSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Stats />
      <Categories />
      <Courses />
      <Instructors />
      <Testimonials />
      <JoinSection />
    </div>
  );
}
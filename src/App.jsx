import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between overflow-x-hidden">
      <Header />
      <Hero />
      <MainContent />
      <Footer />
    </div>
  );
}
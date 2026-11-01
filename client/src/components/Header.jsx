
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
          PULSE<span className="text-purple-600">-FITNESS</span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#classes" className="hover:text-purple-600 transition-colors">Classes</a>
          <a href="#schedule" className="hover:text-purple-600 transition-colors">Schedule</a>
          <a href="#trainers" className="hover:text-purple-600 transition-colors">Trainers</a>
        </nav>

        {/* Desktop Book Pass */}
        <a
          href="#classes"
          className="hidden md:inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
        >
          Book Pass
        </a>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-900 hover:bg-purple-50 transition-colors"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation menu */}
      <div
        id="mobile-navigation"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-64 opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-6 py-4 gap-4 text-sm font-semibold text-gray-700">
          <a href="#classes" onClick={closeMenu} className="hover:text-purple-600 py-2">
            Classes
          </a>
          <a href="#schedule" onClick={closeMenu} className="hover:text-purple-600 py-2">
            Schedule
          </a>
          <a href="#trainers" onClick={closeMenu} className="hover:text-purple-600 py-2">
            Trainers
          </a>
          <a
            href="#classes"
            onClick={closeMenu}
            className="bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold px-5 py-3 rounded-full transition-all"
          >
            Book Pass
          </a>
        </nav>
      </div>
    </header>
  );
}

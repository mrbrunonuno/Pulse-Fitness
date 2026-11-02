
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: 'Classes', href: '#classes' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Trainers', href: '#trainers' },
    { label: 'About', href: '#about' },
  ];

  const focusStyle =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">

        {/* Logo */}
        <a
          href="#"
          className={`text-xl font-black tracking-tight text-gray-900 transition-transform hover:scale-105 sm:text-2xl ${focusStyle}`}
          aria-label="Pulse Fitness homepage"
        >
          PULSE<span className="text-purple-600">-FITNESS</span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-gray-600 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative rounded-sm py-2 transition-colors duration-200 hover:text-purple-600 ${focusStyle}`}
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-purple-600 transition-all duration-300 ease-out group-hover:w-full"
              />
            </a>
          ))}
        </nav>

        {/* Desktop Book Pass */}
        <a
          href="#classes"
          className={`hidden rounded-full bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-md md:inline-block ${focusStyle}`}
        >
          Book Pass
        </a>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`rounded-lg p-2 text-gray-900 transition-colors hover:bg-purple-50 md:hidden ${focusStyle}`}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation menu */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen
            ? 'max-h-80 border-t border-gray-100 opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-2 px-6 py-4 text-sm font-semibold text-gray-700">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`rounded-lg py-2 transition-colors hover:bg-purple-50 hover:text-purple-600 ${focusStyle}`}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#classes"
            onClick={closeMenu}
            className={`mt-2 rounded-full bg-purple-600 px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-purple-700 ${focusStyle}`}
          >
            Book Pass
          </a>
        </nav>
      </div>
    </header>
  );
}

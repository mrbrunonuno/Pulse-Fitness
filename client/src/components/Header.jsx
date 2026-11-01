export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
          PULSE<span className="text-purple-600">-FITNESS</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#classes" className="hover:text-purple-600 transition-colors">Classes</a>
          <a href="#schedule" className="hover:text-purple-600 transition-colors">Schedule</a>
          <a href="#trainers" className="hover:text-purple-600 transition-colors">Trainers</a>
        </nav>
        <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all shadow-sm">
          Book Pass
        </button>
      </div>
    </header>
  );
}
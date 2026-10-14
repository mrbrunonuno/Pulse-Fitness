export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-8 sm:py-12 px-4 sm:px-6 mt-16 border-t border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-center sm:text-left">
        <div>
          <p className="font-bold text-white text-base mb-1">PULSE FITNESS</p>
          <p>&copy; {new Date().getFullYear()} Pulse Fitness. All rights reserved.</p>
        </div>
        <p className="text-gray-500">Built with React + Tailwind CSS v4</p>
      </div>
    </footer>
  );
}
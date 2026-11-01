export default function Hero() {
  return (
    <section className="relative w-full bg-gray-950 text-white py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-purple-900/40">
      {/* Decorative gradient blur background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-pink-900/20 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto">
        <span className="inline-block px-3.5 py-1 text-xs sm:text-sm font-bold text-purple-300 bg-purple-950/80 border border-purple-700/50 rounded-full mb-6 shadow-inner">
          ⚡ Transform Your Routine
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Elevate Your Energy at <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Pulse Fitness</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-light">
          Expert-led group sessions, high-energy workouts, and customizable training passes designed for all fitness levels.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="#classes" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg shadow-purple-600/30">
            Explore Classes
          </a>
        </div>
      </div>
    </section>
  );
}
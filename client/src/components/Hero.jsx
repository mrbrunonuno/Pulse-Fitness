
export default function Hero() {
  return (
    <section className="relative w-full bg-gray-950 text-white py-16 sm:py-20 px-4 sm:px-6 text-center overflow-hidden border-b border-purple-900/40">
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-pink-900/20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">

        <span className="inline-block px-4 py-2 text-xs sm:text-sm font-bold text-purple-300 bg-purple-950/80 border border-purple-700/50 rounded-full mb-6">
          ⚡ Transform Your Routine
        </span>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Elevate Your Energy at{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Pulse Fitness
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-light">
          Expert-led group sessions, high-energy workouts, and customizable
          training passes designed for all fitness levels.
        </p>

        {/* Explore Classes button */}
        <div className="mt-7">
          <a
            href="#classes"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg shadow-purple-600/30"
          >
            Explore Classes
          </a>
        </div>

        {/* Hero image */}
        <div className="mt-10 max-w-4xl mx-auto">
          <img
            src="/images/hero.jpg"
            alt="Athlete training in the gym"
            className="w-full h-64 sm:h-80 md:h-96 object-cover object-center rounded-2xl shadow-2xl border border-purple-500/20"
          />
        </div>

      </div>
    </section>
  );
}

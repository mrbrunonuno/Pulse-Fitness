export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-purple-50/50 to-white py-12 sm:py-20 px-4 sm:px-6 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block px-3 py-1 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-100 rounded-full mb-4">
          Transform Your Routine
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Elevate Your Energy at <span className="text-purple-600">Pulse Fitness</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Expert-led group sessions, high-energy workouts, and customizable training passes designed for all fitness levels.
        </p>
      </div>
    </section>
  );
}
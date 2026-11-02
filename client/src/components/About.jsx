
export default function About() {
  return (
    <section id="about" className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">

        {/* About introduction */}
        <div className="grid items-center gap-12 md:grid-cols-2">

          <div>
            <p className="mb-3 font-bold uppercase tracking-widest text-red-600">
              About Pulse Fitness
            </p>

            <h2 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900">
              Stronger Together.
              <span className="block text-red-600">
                Better Every Day.
              </span>
            </h2>

            <p className="mb-5 text-lg leading-8 text-gray-600">
              Pulse Fitness is designed to make your fitness journey easier.
              Explore a variety of fitness classes, discover new challenges
              and take steps towards a healthier lifestyle.
            </p>

            <p className="text-lg leading-8 text-gray-600">
              Whether you are starting your fitness journey or looking to
              improve your performance, Pulse Fitness gives you a place
              to stay active, motivated and focused on your goals.
            </p>

            <a
              href="#classes"
              className="mt-8 inline-block rounded-lg bg-red-600 px-7 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Explore Our Classes
            </a>
          </div>

          {/* Fitness image */}
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900"
              alt="Modern fitness gym with workout equipment"
              className="h-80 w-full object-cover md:h-[420px]"
              loading="lazy"
            />
          </div>

        </div>

        {/* Our values */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 text-4xl">🎯</div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Our Mission
            </h3>
            <p className="leading-7 text-gray-600">
              Encourage healthier lifestyles through fitness, movement
              and personal growth.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 text-4xl">🤝</div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Our Community
            </h3>
            <p className="leading-7 text-gray-600">
              Create a welcoming environment where everyone can learn,
              improve and grow together.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 text-4xl">💪</div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Our Goal
            </h3>
            <p className="leading-7 text-gray-600">
              Help members stay consistent, confident and motivated
              throughout their fitness journey.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

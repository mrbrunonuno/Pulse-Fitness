
export default function About() {
  return (
    <section id="about" className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-red-600">
            About Pulse Fitness
          </p>

          <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
            Stronger Together. Better Every Day.
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            Pulse Fitness is designed to make your fitness journey easier.
            Explore a variety of fitness classes, discover new challenges
            and take steps towards a healthier lifestyle.
          </p>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            Whether you are starting your fitness journey or looking to
            improve your performance, Pulse Fitness gives you a place
            to stay active, motivated and focused on your goals.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-bold">Our Mission</h3>
            <p className="text-gray-600">
              Encourage healthier lifestyles through fitness and movement.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-bold">Our Community</h3>
            <p className="text-gray-600">
              Create a welcoming environment where everyone can grow.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-bold">Our Goal</h3>
            <p className="text-gray-600">
              Help members stay consistent, confident and motivated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

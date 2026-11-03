
export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Classes', id: 'classes' },
    { label: 'Schedule', id: 'schedule' },
    { label: 'Trainers', id: 'trainers' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const focusStyle =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400';

  return (
    <footer className="mt-16 w-full overflow-hidden border-t-4 border-purple-600 bg-gray-950 px-6 pt-14 text-gray-400">
      <div className="mx-auto grid max-w-7xl gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-3">

        {/* Brand */}
        <div>
          <a
            href="/"
            aria-label="Pulse Fitness homepage"
            className={`text-2xl font-black tracking-tight text-white ${focusStyle}`}
          >
            PULSE<span className="text-purple-500">-FITNESS</span>
          </a>

          <p className="mt-4 max-w-sm text-sm leading-7">
            Stronger Together. Better Every Day.
            Discover fitness classes, challenge yourself
            and take the next step towards a healthier lifestyle.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Quick Links
          </h3>

          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate?.(link.id);
                  }}
                  className={`transition-colors hover:text-purple-400 ${focusStyle}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Get Started */}
        <div>
          <h3 className="mb-5 text-lg font-bold text-white">
            Start Your Fitness Journey
          </h3>

          <p className="mb-5 text-sm leading-7">
            Find a class that suits your goals and take
            the first step towards becoming stronger.
          </p>

          <a
            href="/#classes"
            onClick={(event) => {
              event.preventDefault();
              onNavigate?.('classes');
            }}
            className={`inline-block rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-purple-700 hover:shadow-lg ${focusStyle}`}
          >
            Explore Classes
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs sm:flex-row sm:text-left">

          <p>
            &copy; {currentYear} Pulse Fitness. All rights reserved.
          </p>

          <a
            href="/#top"
            onClick={(event) => {
              event.preventDefault();
              onNavigate?.('top');
            }}
            className={`transition-colors hover:text-purple-400 ${focusStyle}`}
          >
            Back to top ↑
          </a>

          <p className="text-gray-500">
            Built with React + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

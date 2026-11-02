
import { useEffect, useState } from 'react';
import QuantityStepper from './QuantityStepper';

const API_URL = 'http://localhost:5000/api';

export default function MainContent({ user, onShowLogin }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fitnessClasses, setFitnessClasses] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const categories = ['All', 'HIIT', 'Yoga', 'Strength', 'Cardio'];

  const trainerImages = [
    '/images/trainer1.jpg',
    '/images/trainer2.jpg',
    '/images/trainer3.jpg',
  ];

  // Fetch fitness classes from the backend
  async function fetchClasses() {
    try {
      const response = await fetch(`${API_URL}/classes`);

      if (!response.ok) {
        throw new Error('Unable to load fitness classes.');
      }

      const data = await response.json();
      setFitnessClasses(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingClasses(false);
    }
  }

  // Load classes when the page opens
  useEffect(() => {
    fetchClasses();
  }, []);

  // Get unique trainers
  const trainers = [
    ...new Set(
      fitnessClasses
        .map((item) => item.trainer)
        .filter(Boolean)
    ),
  ];

  // Filter classes by category
  const filteredClasses =
    selectedCategory === 'All'
      ? fitnessClasses
      : fitnessClasses.filter(
          (item) => item.category === selectedCategory
        );

  // Handle class booking
  async function handleBooking(classId) {
    if (!user) {
      onShowLogin();
      return;
    }

    const quantity = quantities[classId] || 1;

    setMessage('');
    setBooking(true);

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          classId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Booking failed. Please try again.'
        );
      }

      setMessage(
        'Booking successful! Your spots have been reserved.'
      );

      setQuantities((previous) => ({
        ...previous,
        [classId]: 1,
      }));

      // Refresh available spots from Neon
      await fetchClasses();
    } catch (error) {
      setMessage(
        error.message || 'Unable to complete your booking.'
      );
    } finally {
      setBooking(false);
    }
  }

  // Handle Stripe checkout
  async function handleCheckout(classId) {
    if (!user) {
      onShowLogin();
      return;
    }

    const quantity = quantities[classId] || 1;

    setMessage('');
    setCheckingOut(true);

    try {
      const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          classId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to start checkout.'
        );
      }

      if (!data.checkoutUrl) {
        throw new Error('Stripe did not return a checkout URL.');
      }

      // Redirect to Stripe's hosted checkout page
      window.location.href = data.checkoutUrl;
    } catch (error) {
      setMessage(
        error.message || 'Checkout failed. Please try again.'
      );
      setCheckingOut(false);
    }
  }

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full overflow-hidden bg-gradient-to-b from-purple-50/40 via-white to-gray-50"
      id="classes"
    >
      {/* Heading and category filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Available Classes
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Filter by category and reserve your spots
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-purple-200 shadow-md scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status message */}
      {message && (
        <p
          role="status"
          className="mb-6 rounded-lg bg-purple-50 p-4 text-sm font-medium text-purple-800"
        >
          {message}
        </p>
      )}

      {/* Loading message */}
      {loadingClasses && (
        <p className="text-center py-6">
          Loading fitness classes...
        </p>
      )}

      {/* Empty state */}
      {!loadingClasses && fitnessClasses.length === 0 && (
        <p className="text-center py-6 text-gray-600">
          No fitness classes are currently available.
        </p>
      )}

      {/* Fitness class cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-purple-100/60 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Trainer image */}
              <div className="mb-5 overflow-hidden rounded-2xl">
                <img
                  src={trainerImages[(item.id - 1) % trainerImages.length]}
                  alt={`${item.trainer} - ${item.title}`}
                  className="w-full h-56 sm:h-64 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Category and rating */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  {item.category}
                </span>

                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                  ⭐ {item.rating}
                </span>
              </div>

              {/* Class title */}
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {item.title}
              </h3>

              {/* Class description */}
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {item.description}
              </p>

              {/* Duration and trainer */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
                <span>⏱️ {item.duration}</span>
                <span>👤 {item.trainer}</span>
              </div>

              {/* Price */}
              <p className="mt-4 text-lg font-bold text-gray-900">
                R{Number(item.price || 150).toFixed(2)}
                <span className="text-xs font-medium text-gray-500">
                  {' '}per pass
                </span>
              </p>

              {/* Available spots */}
              <p className="mt-2 text-sm font-semibold text-purple-700">
                {item.spotsLeft} spots available
              </p>
            </div>

            {/* Booking controls */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Passes
                </span>

                <QuantityStepper
                  key={`${item.id}-${item.spotsLeft}`}
                  initial={1}
                  max={item.spotsLeft}
                  onChange={(value) =>
                    setQuantities((previous) => ({
                      ...previous,
                      [item.id]: value,
                    }))
                  }
                />
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {/* Stripe checkout button */}
                <button
                  onClick={() => handleCheckout(item.id)}
                  disabled={
                    checkingOut ||
                    booking ||
                    loadingClasses ||
                    item.spotsLeft < 1
                  }
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {item.spotsLeft < 1
                    ? 'Fully Booked'
                    : checkingOut
                      ? 'Redirecting...'
                      : 'Buy Now'}
                </button>

                {/* Existing booking button */}
                <button
                  onClick={() => handleBooking(item.id)}
                  disabled={
                    booking ||
                    checkingOut ||
                    loadingClasses ||
                    item.spotsLeft < 1
                  }
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? 'Booking...' : 'Reserve Spot'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Section */}
      <section id="schedule" className="scroll-mt-24 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">
            Class Schedule
          </h2>

          <p className="text-gray-600 mt-2">
            Find a class that fits your routine.
          </p>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="w-full text-left">
            <thead className="bg-purple-100 text-purple-900">
              <tr>
                <th className="p-4">Class</th>
                <th className="p-4">Trainer</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Schedule</th>
              </tr>
            </thead>

            <tbody>
              {fitnessClasses.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4 font-semibold">{item.title}</td>
                  <td className="p-4">{item.trainer}</td>
                  <td className="p-4">{item.duration}</td>
                  <td className="p-4">
                    {item.schedule || 'Schedule to be confirmed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="scroll-mt-24 mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900">
            Meet Our Trainers
          </h2>

          <p className="text-gray-600 mt-2">
            Learn from our experienced fitness instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer) => {
            const trainerClasses = fitnessClasses.filter(
              (item) => item.trainer === trainer
            );

            const trainerImagesByName = {
              'Alex Rivera': '/images/trainer1.jpg',
              'Elena Rostova': '/images/trainer2.jpg',
              'Marcus Vance': '/images/trainer3.jpg',
              'Sarah Jenkins': '/images/trainer4.jpg',
            };

            return (
              <div
                key={trainer}
                className="bg-white rounded-3xl shadow-md overflow-hidden border border-purple-100 hover:shadow-xl transition-all"
              >
                <img
                  src={trainerImagesByName[trainer] || '/images/trainer1.jpg'}
                  alt={trainer}
                  className="w-full h-64 object-cover object-top"
                  loading="lazy"
                />

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {trainer}
                  </h3>

                  <p className="text-sm text-purple-700 font-semibold mt-2">
                    Fitness Instructor
                  </p>

                  <p className="text-sm text-gray-600 mt-3 font-semibold">
                    Classes:
                  </p>

                  <ul className="mt-2 space-y-2">
                    {trainerClasses.map((item) => (
                      <li key={item.id} className="text-sm text-gray-700">
                        • {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

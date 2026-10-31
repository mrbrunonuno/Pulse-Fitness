
import { useEffect, useState } from 'react';
import QuantityStepper from './QuantityStepper';

const API_URL = 'https://pulse-fitness-01j6.onrender.com/api';

export default function MainContent({ user, onShowLogin }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fitnessClasses, setFitnessClasses] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const categories = ['All', 'HIIT', 'Yoga', 'Strength', 'Cardio'];

  // Fetch fitness classes directly from the database
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

  // Filter classes by category
  const filteredClasses = selectedCategory === 'All'
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

  return (
    <main
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full overflow-hidden bg-gradient-to-b from-purple-50/40 via-white to-gray-50"
      id="classes"
    >
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

      {message && (
        <p
          role="status"
          className="mb-6 rounded-lg bg-purple-50 p-4 text-sm font-medium text-purple-800"
        >
          {message}
        </p>
      )}

      {loadingClasses && (
        <p className="text-center py-6">
          Loading fitness classes...
        </p>
      )}

      {!loadingClasses && fitnessClasses.length === 0 && (
        <p className="text-center py-6 text-gray-600">
          No fitness classes are currently available.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-purple-100/60 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  {item.category}
                </span>

                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
                  ⭐ {item.rating}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500">
                <span>⏱️ {item.duration}</span>
                <span>👤 {item.trainer}</span>
              </div>

              <p className="mt-4 text-sm font-semibold text-purple-700">
                {item.spotsLeft} spots available
              </p>
            </div>

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

              <button
                onClick={() => handleBooking(item.id)}
                disabled={
                  booking ||
                  loadingClasses ||
                  item.spotsLeft < 1
                }
                className="flex-1 bg-gray-900 hover:bg-purple-600 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {item.spotsLeft < 1
                  ? 'Fully Booked'
                  : booking
                    ? 'Booking...'
                    : 'Reserve Spot'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

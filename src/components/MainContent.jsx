import { useState } from 'react';
import { fitnessClasses } from '../data/fitnessData';
import QuantityStepper from './QuantityStepper';

export default function MainContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'HIIT', 'Yoga', 'Strength', 'Cardio'];

  const filteredClasses = selectedCategory === 'All'
    ? fitnessClasses
    : fitnessClasses.filter((item) => item.category === selectedCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full overflow-hidden" id="classes">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Classes</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Filter by category and reserve your spots</p>
        </div>

        {/* Real filter built with useState */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid displaying filtered items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500 font-medium">⭐ {item.rating}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>⏱️ {item.duration}</span>
                <span>👤 {item.trainer}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div>
                <span className="block text-xs text-gray-400">Passes</span>
                <QuantityStepper initial={1} max={item.spotsLeft} />
              </div>
              <button className="flex-1 bg-gray-900 hover:bg-purple-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors">
                Reserve
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
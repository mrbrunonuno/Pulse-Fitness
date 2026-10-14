import { useState } from 'react';

export default function QuantityStepper({ initial = 1, max = 5 }) {
  const [count, setCount] = useState(initial);

  const decrement = () => setCount((prev) => Math.max(1, prev - 1));
  const increment = () => setCount((prev) => Math.min(max, prev + 1));

  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
      <button
        onClick={decrement}
        disabled={count <= 1}
        className="w-7 h-7 flex items-center justify-between justify-center rounded bg-white text-gray-700 font-bold border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        type="button"
      >
        -
      </button>
      <span className="w-6 text-center text-sm font-semibold text-gray-800">
        {count}
      </span>
      <button
        onClick={increment}
        disabled={count >= max}
        className="w-7 h-7 flex items-center justify-center rounded bg-white text-gray-700 font-bold border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        type="button"
      >
        +
      </button>
    </div>
  );
}
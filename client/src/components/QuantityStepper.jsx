
import { useState } from 'react';

export default function QuantityStepper({
  initial = 1,
  max = 5,
  onChange,
}) {
  const [count, setCount] = useState(initial);

  const decrement = () => {
    const nextCount = Math.max(1, count - 1);
    setCount(nextCount);
    onChange?.(nextCount);
  };

  const increment = () => {
    const nextCount = Math.min(max, count + 1);
    setCount(nextCount);
    onChange?.(nextCount);
  };

  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
      <button
        onClick={decrement}
        disabled={count <= 1}
        className="w-7 h-7 flex items-center justify-center rounded bg-white text-gray-700 font-bold border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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

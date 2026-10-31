
import { useState } from 'react';

export default function Login({ onLogin, onShowSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://pulse-fitness-api-apxs.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto my-12 w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        Welcome Back
      </h2>

      <p className="mb-6 text-gray-600">
        Log in to your Pulse Fitness account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1 block font-medium text-gray-700"
          >
            Email address
          </label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 p-3"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1 block font-medium text-gray-700"
          >
            Password
          </label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 p-3"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black p-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onShowSignup}
          className="font-semibold text-blue-600 hover:underline"
        >
          Sign up
        </button>
      </p>
    </section>
  );
}

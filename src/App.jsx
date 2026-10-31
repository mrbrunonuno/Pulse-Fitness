
import { useEffect, useState } from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(
          'https://pulse-fitness-01j6.onrender.com/api/auth/me',
          { credentials: 'include' }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Could not check login session:', error);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch(
        'https://pulse-fitness-01j6.onrender.com/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Logout failed.');
      }

      setUser(null);
      setPage('home');
    } catch (error) {
      console.error(error);
      alert('Unable to log out. Please try again.');
    }
  }

  function handleLogin(userData) {
    setUser(userData);
    setPage('home');
  }

  function handleSignup(userData) {
    setUser(userData);
    setPage('home');
  }

  if (checkingSession) {
    return <p className="p-8 text-center">Checking login session...</p>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between overflow-x-hidden">
      <Header />

      {page === 'login' ? (
        <Login
          onLogin={handleLogin}
          onShowSignup={() => setPage('signup')}
        />
      ) : page === 'signup' ? (
        <Signup
          onSignup={handleSignup}
          onShowLogin={() => setPage('login')}
        />
      ) : (
        <>
          <Hero />

          {user && (
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
              <p>
                Welcome, <strong>{user.name}</strong>!
              </p>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          )}

          {!user && (
            <div className="flex justify-center gap-3 px-4 py-4">
              <button
                onClick={() => setPage('login')}
                className="rounded-lg bg-black px-5 py-2 font-semibold text-white hover:bg-gray-800"
              >
                Log in
              </button>
              <button
                onClick={() => setPage('signup')}
                className="rounded-lg border border-gray-300 px-5 py-2 font-semibold hover:bg-gray-100"
              >
                Sign up
              </button>
            </div>
          )}

          <MainContent
  user={user}
  onShowLogin={() => setPage('login')}
/>
        </>
      )}

      <Footer />
    </div>
  );
}

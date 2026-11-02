
import { useEffect, useState } from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMessage, setPaymentMessage] = useState('');

  // Check login session
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: 'include',
        });

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

  // Check Stripe payment and poll for webhook confirmation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get('checkout');
    const orderId = params.get('order_id');

    if (checkoutStatus === 'cancelled') {
      setPaymentMessage('Your checkout was cancelled. No payment was completed.');
      window.history.replaceState({}, '', '/');
      return;
    }

    if (checkoutStatus !== 'success' || !orderId) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;

    async function checkOrder() {
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Could not retrieve your order.');
        }

        const data = await response.json();

        if (cancelled) return;

        setOrder(data.order);
        setOrderItems(data.items || []);

        if (data.order.status === 'paid') {
          setPaymentMessage('Your payment was successful!');
          window.history.replaceState({}, '', '/');
          return;
        }

        attempts++;

        if (attempts >= maxAttempts) {
          setPaymentMessage(
            'Your payment is being confirmed. Please refresh this page shortly.'
          );
          return;
        }

        setPaymentMessage('Waiting for payment confirmation...');
        setTimeout(checkOrder, 2000);
      } catch (error) {
        console.error('Order verification error:', error);

        if (!cancelled) {
          setPaymentMessage('Unable to verify your order. Please try again.');
        }
      }
    }

    checkOrder();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

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

          {paymentMessage && (
            <div className="mx-auto my-6 w-full max-w-4xl rounded-xl border border-green-200 bg-green-50 p-6">
              <h2 className="text-xl font-bold">
                {order?.status === 'paid'
                  ? 'Payment Successful!'
                  : 'Payment Status'}
              </h2>

              <p className="mt-2">{paymentMessage}</p>

              {order && (
                <div className="mt-4 space-y-2">
                  <p>Order number: #{order.id}</p>
                  <p>
                    Total: R{Number(order.total_amount).toFixed(2)}
                  </p>
                  <p>
                    Status: <strong>{order.status}</strong>
                  </p>

                  {orderItems.map((item) => (
                    <p key={item.class_id}>
                      {item.class_title} × {item.quantity}
                    </p>
                  ))}
                </div>
              )}
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

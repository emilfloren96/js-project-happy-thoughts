import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import ThoughtForm from './components/ThoughtForm';
import ThoughtList from './components/ThoughtList';
import AuthForm from './components/AuthForm';

const API_URL = `${import.meta.env.VITE_API_URL}/api/thoughts`;

export default function App() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [showAuth, setShowAuth] = useState(false);

  // Filter/sort state
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    fetchThoughts();
  }, [category, sort, order]);

  const handleAuthSuccess = (token, email, id) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userId', id);
    setAccessToken(token);
    setUserEmail(email);
    setUserId(id);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    setAccessToken(null);
    setUserEmail(null);
    setUserId(null);
    setTweets([]);
    fetchThoughts();
  };

  const fetchThoughts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('order', order);

    fetch(`${API_URL}?${params}`)
      .then((res) => res.json())
      .then((data) => {
        const adaptedTweets = data.thoughts.map((thought) => ({
          id: thought._id,
          text: thought.message,
          likes: thought.hearts,
          timestamp: new Date(thought.createdAt).getTime(),
          category: thought.category,
          userId: String(thought.userId),
        }));
        setTweets(adaptedTweets);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handlePostThought = (text, thoughtCategory) => {
    return fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({ message: text, category: thoughtCategory || 'general' })
    })
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
          throw new Error('Session expired, please log in again.');
        }
        return res.json();
      })
      .then((newThought) => {
        const adaptedTweet = {
          id: newThought._id,
          text: newThought.message,
          likes: newThought.hearts,
          timestamp: new Date(newThought.createdAt).getTime(),
          category: newThought.category,
          userId: String(newThought.userId),
        };
        setTweets((prev) => [adaptedTweet, ...prev]);
      })
      .catch((err) => console.error("Error posting:", err));
  };

  const handleLikeThought = (id) => {
    fetch(`${API_URL}/${id}/like`, { method: 'POST' })
      .then(() => {
        setTweets((currentTweets) =>
          currentTweets.map((t) =>
            t.id === id ? { ...t, likes: t.likes + 1 } : t
          )
        );
      })
      .catch((err) => console.error("Error liking:", err));
  };

  const handleDeleteThought = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': accessToken },
    })
      .then((res) => {
        if (res.status === 401) { handleLogout(); return; }
        if (res.ok) {
          setTweets((prev) => prev.filter((t) => t.id !== id));
        }
      })
      .catch((err) => console.error("Error deleting:", err));
  };

  const handleEditThought = (id, newText, newCategory) => {
    return fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({ message: newText, category: newCategory }),
    })
      .then((res) => {
        if (res.status === 401) { handleLogout(); throw new Error('Unauthorized'); }
        return res.json();
      })
      .then((updated) => {
        setTweets((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, text: updated.message, category: updated.category }
              : t
          )
        );
      })
      .catch((err) => console.error("Error editing:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-[500px]">
        <Header />

        {accessToken ? (
          <>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
              <span>Logged in as <strong>{userEmail}</strong></span>
              <button
                onClick={handleLogout}
                className="text-pink-600 hover:underline font-medium"
              >
                Logout
              </button>
            </div>
            <ThoughtForm onPostThought={handlePostThought} />
          </>
        ) : (
          <div className="mb-6">
            {showAuth ? (
              <div className="relative">
                <button
                  onClick={() => setShowAuth(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm z-10"
                >
                  ✕ Close
                </button>
                <AuthForm onAuthSuccess={handleAuthSuccess} />
              </div>
            ) : (
              <div className="bg-white border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
                <span className="text-gray-600 text-sm">Log in to post your happy thoughts</span>
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-pink-200 hover:bg-pink-300 text-black font-bold py-2 px-4 rounded-full text-sm transition-colors"
                >
                  Login / Sign up
                </button>
              </div>
            )}
          </div>
        )}

        <ThoughtList
          thoughts={tweets}
          loading={loading}
          onLike={handleLikeThought}
          onDelete={handleDeleteThought}
          onEdit={handleEditThought}
          currentUserId={userId}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          order={order}
          setOrder={setOrder}
        />
      </div>
    </div>
  );
}

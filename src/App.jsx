import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import ThoughtForm from './components/ThoughtForm';
import ThoughtList from './components/ThoughtList';

export default function App() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = 'https://happy-thoughts-api-4ful.onrender.com/thoughts';

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const adaptedTweets = data.map((thought) => ({
          id: thought._id,
          text: thought.message,
          likes: thought.hearts,
          timestamp: new Date(thought.createdAt).getTime(),
          username: 'Anonymous' 
        }));
        setTweets(adaptedTweets);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handlePostThought = (text) => {
    // Return the fetch promise so the form knows when it's done
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
      .then((res) => res.json())
      .then((newThought) => {
        const adaptedTweet = {
          id: newThought._id,
          text: newThought.message,
          likes: newThought.hearts,
          timestamp: new Date(newThought.createdAt).getTime(),
          username: 'Me'
        };
        setTweets((prev) => [adaptedTweet, ...prev]);
      })
      .catch((err) => console.error("Error posting:", err));
  };

  const handleLikeThought = (id) => {
    fetch(`${API_URL}/${id}/like`, {
      method: 'POST',
    })
      .then(() => {
        setTweets((currentTweets) =>
          currentTweets.map((t) =>
            t.id === id ? { ...t, likes: t.likes + 1 } : t
          )
        );
      })
      .catch((err) => console.error("Error liking:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-[500px]">
        <Header />
        
        <ThoughtForm onPostThought={handlePostThought} />
        
        <ThoughtList 
          thoughts={tweets} 
          loading={loading} 
          onLike={handleLikeThought} 
        />
      </div>
    </div>
  );
}
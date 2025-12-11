import React, { useState } from 'react';
import { Heart } from "lucide-react";


const ThoughtForm = ({ onPostThought }) => {
  const [text, setText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || text.length > 140) return;

    setIsPosting(true);
    // Skicka texten uppåt till App-komponenten
    onPostThought(text).then(() => {
      setText(''); // Rensa formuläret efter lyckad post
      setIsPosting(false);
    });
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h1 id="question-label" className="text-xl font-bold mb-4 text-black">
        What's making you happy right now?
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          aria-labelledby="question-label"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your thought here..."
          disabled={isPosting}
          className="w-full p-3 border border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-pink-500 resize-none h-24 placeholder-gray-500 text-gray-900 disabled:opacity-50"
        />
        
        <div className="flex justify-between items-center pt-2">
          <span className={`text-xs ${text.length > 140 ? 'text-red-500' : 'text-gray-600'}`}>
            {text.length} / 140
          </span>
          <button 
            type="submit"
            disabled={!text.trim() || text.length > 140 || isPosting}
            className="bg-pink-200 hover:bg-pink-300 text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart size={20} className="fill-pink-500 text-pink-500" aria-hidden="true" />
            <span>{isPosting ? 'Sending...' : 'Send Happy Thought'}</span>
            <Heart size={20} className="fill-pink-500 text-pink-500" aria-hidden="true" />
          </button>
        </div>
        {text.length > 140 && (
          <p className="text-red-500 text-xs mt-1">Your message is too long!</p>
        )}
      </form>
    </div>
  );
};

export default ThoughtForm;
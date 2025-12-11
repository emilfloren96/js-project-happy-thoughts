import React from 'react';
import { Heart } from 'lucide-react';
import { formatTimeAgo } from '../utils/formatDate';

const ThoughtItem = ({ thought, onLike }) => {
  return (
    <div className="bg-white border-2 border-black p-6 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-200">
      <p className="text-gray-900 text-lg font-medium mb-4 whitespace-pre-wrap break-words">
        {thought.text}
      </p>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onLike(thought.id)}
            aria-label={`Like thought, current likes: ${thought.likes}`}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-pink-100 transition-colors"
          >
            <Heart 
              size={20} 
              aria-hidden="true"
              className={`transition-colors ${thought.likes > 0 ? 'fill-pink-500 text-pink-500' : 'text-gray-400 group-hover:text-pink-500'}`} 
            />
          </button>
          <span className="text-gray-600 text-sm">x {thought.likes}</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-gray-500 text-xs flex items-center gap-1">
            {formatTimeAgo(thought.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThoughtItem;
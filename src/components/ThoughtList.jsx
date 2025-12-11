import React from 'react';
import { Loader2 } from 'lucide-react';
import ThoughtItem from './ThoughtItem';

const ThoughtList = ({ thoughts, loading, onLike }) => {
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-2">
        <Loader2 className="animate-spin" size={32} />
        <p>Loading happy thoughts...</p>
      </div>
    );
  }

  if (thoughts.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8 italic">
        No happy thoughts found. Check the API connection.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {thoughts.map((thought) => (
        <ThoughtItem 
          key={thought.id} 
          thought={thought} 
          onLike={onLike} 
        />
      ))}
    </div>
  );
};


export default ThoughtList;
import React from 'react';
import { Loader2 } from 'lucide-react';
import ThoughtItem from './ThoughtItem';

const CATEGORIES = ['', 'general', 'gratitude', 'nature', 'people', 'food', 'work', 'fun'];

const ThoughtList = ({
  thoughts, loading, onLike, onDelete, onEdit, currentUserId,
  category, setCategory, sort, setSort, order, setOrder,
}) => {
  return (
    <div>
      {/* Filter / sort controls */}
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-pink-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === '' ? 'All categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-pink-500"
        >
          <option value="createdAt">Sort by date</option>
          <option value="hearts">Sort by likes</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:border-pink-500"
        >
          <option value="desc">Newest / most first</option>
          <option value="asc">Oldest / least first</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 flex flex-col items-center gap-2">
          <Loader2 className="animate-spin" size={32} />
          <p>Loading happy thoughts...</p>
        </div>
      ) : thoughts.length === 0 ? (
        <div className="text-center text-gray-600 py-8 italic">
          No happy thoughts found. Check the API connection.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {thoughts.map((thought) => (
            <ThoughtItem
              key={thought.id}
              thought={thought}
              onLike={onLike}
              onDelete={onDelete}
              onEdit={onEdit}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ThoughtList;

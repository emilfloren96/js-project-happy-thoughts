import React, { useState } from 'react';
import { Heart, Pencil, Trash2, Check, X } from 'lucide-react';
import { formatTimeAgo } from '../utils/formatDate';

const CATEGORIES = ['general', 'gratitude', 'nature', 'people', 'food', 'work', 'fun'];

const ThoughtItem = ({ thought, onLike, onDelete, onEdit, currentUserId }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(thought.text);
  const [editCategory, setEditCategory] = useState(thought.category || 'general');
  const [saving, setSaving] = useState(false);

  const isOwner = currentUserId && thought.userId &&
    currentUserId.toString() === thought.userId.toString();

  const handleSaveEdit = () => {
    if (!editText.trim() || editText.length < 5 || editText.length > 140) return;
    setSaving(true);
    onEdit(thought.id, editText, editCategory).then(() => {
      setEditing(false);
      setSaving(false);
    });
  };

  const handleCancelEdit = () => {
    setEditText(thought.text);
    setEditCategory(thought.category || 'general');
    setEditing(false);
  };

  return (
    <div className="bg-white border-2 border-black p-6 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform duration-200">
      {editing ? (
        <div className="flex flex-col gap-2 mb-4">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 resize-none text-gray-900 text-sm"
            rows={3}
            disabled={saving}
          />
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            disabled={saving}
            className="w-full p-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700 text-sm focus:outline-none focus:border-pink-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <span className={`text-xs ${editText.length > 140 ? 'text-red-500' : 'text-gray-500'}`}>
            {editText.length} / 140
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={saving || editText.length < 5 || editText.length > 140}
              className="flex items-center gap-1 px-3 py-1 bg-pink-200 hover:bg-pink-300 rounded-full text-sm font-medium disabled:opacity-50"
            >
              <Check size={14} /> Save
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start mb-4">
          <p className="text-gray-900 text-lg font-medium whitespace-pre-wrap break-words flex-1">
            {thought.text}
          </p>
          {isOwner && (
            <div className="flex gap-1 ml-2 shrink-0">
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit thought"
                className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(thought.id)}
                aria-label="Delete thought"
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      )}

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
          {thought.category && thought.category !== 'general' && (
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
              {thought.category}
            </span>
          )}
          <span className="text-gray-500 text-xs">{formatTimeAgo(thought.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default ThoughtItem;

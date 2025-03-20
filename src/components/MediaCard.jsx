import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function MediaCard  ({ 
  item, 
  type, 
  onStatusChange, 
  onDelete, 
  statusLoading 
}) {
  const navigate = useNavigate();
  const isMovie = type === 'movie';
  
  return (
    <div 
      key={item._id} 
      className={`relative group cursor-pointer transition-all duration-300 rounded-lg overflow-hidden aspect-[2/3] w-[250px] mx-auto
        ${item.status === 'favorite' ? 'hover:shadow-[0_0_15px_rgba(255,0,0,0.7)]' : ''}
        ${item.status === 'viewed' ? 'hover:shadow-[0_0_15px_rgba(0,255,0,0.7)]' : ''}
        ${item.status === 'pending' ? 'hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]' : ''}
        ${!item.status ? 'hover:shadow-[0_0_15px_rgba(255,255,255,0.7)]' : ''}
      `}
      onClick={() => navigate(`/${isMovie ? 'movies' : 'series'}/${item._id}`)}
    >
      <img 
        src={item.poster} 
        alt={item.title}
        className="w-full h-full object-contain bg-black"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/default-poster.png';
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-between p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.title}
          </h2>
          <button 
            className="text-white text-2xl hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item._id, type);
            }}
          >
            <RiDeleteBin6Line className="text-red-500 hover:text-red-700" />
          </button>
        </div>
        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {statusLoading && statusLoading[item._id] ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <button 
                className="text-white text-2xl hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(item._id, type, item.status === 'favorite' ? null : 'favorite');
                }}
              >
                {item.status === 'favorite' ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
              </button>
              <button 
                className="text-white text-2xl hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(item._id, type, item.status === 'viewed' ? null : 'viewed');
                }}
              >
                {item.status === 'viewed' ? <MdVisibility className="text-green-500" /> : <MdVisibilityOff />}
              </button>
              <button 
                className="text-white text-2xl hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(item._id, type, item.status === 'pending' ? null : 'pending');
                }}
              >
                {item.status === 'pending' ? <BsBookmarkFill className="text-yellow-500" /> : <BsBookmark />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


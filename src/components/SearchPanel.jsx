import React, { useRef, useEffect } from 'react';
import MovieSearch from './MovieSearch';
import SeriesSearch from './SeriesSearch';

export default function SearchPanel ({ 
  activeTab, 
  onMovieAdded, 
  onSeriesAdded, 
  searchRef,
  onClose
}) {
  return (
    <div 
      ref={searchRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-base-300 rounded-lg shadow-xl p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {activeTab === 'movies' ? 'Buscar Película' : 'Buscar Serie'}
          </h2>
          <button 
            className="btn btn-sm btn-circle btn-ghost" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        {activeTab === 'movies' ? (
          <MovieSearch onMovieAdded={onMovieAdded} />
        ) : (
          <SeriesSearch onSeriesAdded={onSeriesAdded} />
        )}
      </div>
    </div>
  );
};
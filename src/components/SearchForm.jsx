import React from 'react';

export default function  SearchForm  ({ searchTerm, setSearchTerm, handleSearch })  {
  return (
    <div className="mb-8 max-w-md mx-auto">
      <form onSubmit={handleSearch} className="flex justify-center">
        <div className="join">
          <input 
            type="text" 
            className="input input-bordered join-item w-64" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar película o serie"
          />
          <button type="submit" className="btn join-item bg-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
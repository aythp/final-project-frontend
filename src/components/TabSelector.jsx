import React from 'react';

export default function TabSelector  ({ activeTab, setActiveTab })  {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="tabs tabs-boxed bg-base-300/50 p-1 rounded-xl">
        <button
          className={`tab text-lg font-medium transition-all duration-300 ${
            activeTab === 'movies' 
              ? 'bg-primary text-primary-content rounded-lg transform -translate-y-0.5' 
              : 'text-white hover:text-primary'
          }`}
          onClick={() => setActiveTab('movies')}
        >
          Películas
        </button>
        <button
          className={`tab text-lg font-medium transition-all duration-300 ${
            activeTab === 'series' 
              ? 'bg-primary text-primary-content rounded-lg transform -translate-y-0.5' 
              : 'text-white hover:text-primary'
          }`}
          onClick={() => setActiveTab('series')}
        >
          Series
        </button>
      </div>
    </div>
  );
};
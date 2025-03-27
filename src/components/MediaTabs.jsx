import React from 'react';
import TabSelector from './TabSelector';
import MediaGrid from './MediaGrid';

export default function MediaTabs ({ 
  movies, 
  series, 
  onStatusChange, 
  onDelete, 
  statusLoading,
  moviesEmptyMessage,
  seriesEmptyMessage,
  activeTab,
  setActiveTab
}) {
  return (
    <>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative flex-grow">
        <div className={`transition-opacity duration-300 ${activeTab === 'movies' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'}`}>
          <MediaGrid 
            items={movies}
            type="movie"
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            statusLoading={statusLoading}
            emptyMessage={moviesEmptyMessage}
          />
        </div>

        <div className={`transition-opacity duration-300 ${activeTab === 'series' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'}`}>
          <MediaGrid 
            items={series}
            type="series"
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            statusLoading={statusLoading}
            emptyMessage={seriesEmptyMessage}
          />
        </div>
      </div>
    </>
  );
};
import React, { useState } from 'react';
import MediaCard from './MediaCard';

export default function MediaGrid ({ 
  items,
  type,
  onStatusChange,
  onDelete,
  statusLoading,
  emptyMessage
})  {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-white">
        <p>{emptyMessage || `No hay ${type === 'movie' ? 'películas' : 'series'}.`}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 max-w-7xl mx-auto">
        {getCurrentItems().map((item) => (
          <MediaCard
            key={item._id}
            item={item}
            type={type}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            statusLoading={statusLoading}
          />
        ))}
      </div>

      {Math.ceil(items.length / itemsPerPage) > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
import React from 'react';

export default function SearchResults ({ 
  filteredMedia, 
  loading, 
  hasSearched, 
  bubbleStyles 
})  {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2 text-white">Cargando...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="text-center text-white text-xl mt-10">
        <p>Busca una película o serie para ver sus comentarios</p>
      </div>
    );
  }

  if (filteredMedia.length === 0) {
    return (
      <div className="alert alert-info max-w-md mx-auto">
        <span>No se encontraron películas o series con ese título.</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-base-100 rounded-box p-6 shadow-xl">
      <div className="flex flex-col items-center mb-6">
        <img 
          src={filteredMedia[0].poster} 
          alt={filteredMedia[0].title} 
          className="rounded-lg h-48 w-32 object-cover mb-3"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-poster.png';
          }}
        />
        <h2 className="text-2xl font-bold text-center">{filteredMedia[0].title}</h2>
      </div>
      
      <div className="space-y-2">
        {filteredMedia.map((item, index) => (
          <div key={item._id} className={`chat ${index % 2 === 0 ? 'chat-start' : 'chat-end'}`}>
            <div className="chat-header mb-1">
              {item.user?.name || 'Usuario'}
            </div>
            <div className={`chat-bubble ${bubbleStyles[index % bubbleStyles.length]}`}>
              {item.comment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
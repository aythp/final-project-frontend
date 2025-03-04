import React, { useEffect, useState } from 'react';
import { getCombinedMedia } from '../api/Api.jsx';

export default function Carousel() {
  const [media, setMedia] = useState([]);
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchMedia = async () => {
      const data = await getCombinedMedia();
      setMedia(data);
    };

    fetchMedia();
  }, []);

  return (
    <div className="overflow-hidden relative w-full">
      <div className="flex animate-scroll">
        {media.map((item) => (
          <div key={item.id} className="flex-shrink-0">
            <img 
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={item.title || item.name}
              
            />
          </div>
        ))}
      </div>
    </div>
  );
}
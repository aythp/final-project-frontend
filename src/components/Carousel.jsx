import React, { useEffect, useState } from 'react';
import { getCombinedMedia } from '../api/Api';

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
      <div className="flex animate-scroll w-max">
        {[...media, ...media].map((item, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={item.title || item.name}
              className="w-auto h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
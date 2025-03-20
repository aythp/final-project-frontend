import React from 'react';

export default function UserProfile ({ user }) {
  return (
    <div className="flex flex-col items-center gap-2 md:gap-4 mb-4">
      <div className="avatar">
        <div className="w-24 md:w-32 rounded-full">
          <img 
            src={user?.profileImage || "https://picsum.photos/id/402/200/300"} 
            alt="profile" 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-2xl md:text-4xl font-bold text-white text-center">
        {user?.name}
      </h1>
    </div>
  );
};
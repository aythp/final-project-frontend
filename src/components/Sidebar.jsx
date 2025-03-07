import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 left-0 h-full flex items-center z-50">
      {/* Menu Trigger */}
      <div
        className="w-12 h-12 flex items-center justify-center cursor-pointer bg-base-200 rounded-r-lg shadow-lg hover:bg-base-300 transition-colors duration-300"
        onClick={toggleSidebar}
      >
        <div className="space-y-1.5">
          <span className="block w-6 h-0.5 bg-base-content"></span>
          <span className="block w-6 h-0.5 bg-base-content"></span>
          <span className="block w-6 h-0.5 bg-base-content"></span>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full flex items-center transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="bg-base-200 rounded-r-lg shadow-lg p-4">
          <ul className="space-y-4">
            <li
              className="px-6 py-3 bg-base-100 rounded-lg text-base-content cursor-pointer hover:bg-base-300 hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/likes')}
            >
              Likes
            </li>
            <li
              className="px-6 py-3 bg-base-100 rounded-lg text-base-content cursor-pointer hover:bg-base-300 hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/pending')}
            >
              Pending
            </li>
            <li
              className="px-6 py-3 bg-base-100 rounded-lg text-base-content cursor-pointer hover:bg-base-300 hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/viewed')}
            >
              Viewed
            </li>
            <li
              className="px-6 py-3 bg-base-100 rounded-lg text-base-content cursor-pointer hover:bg-base-300 hover:text-primary transition-colors duration-300"
              onClick={() => navigate('/settings')}
            >
              User Settings
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
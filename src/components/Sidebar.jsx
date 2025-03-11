import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaClock, FaEye, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: <FaHeart className="w-5 h-5" />, text: 'Favoritos', path: '/likes' },
    { icon: <FaClock className="w-5 h-5" />, text: 'Pendientes', path: '/pending' },
    { icon: <FaEye className="w-5 h-5" />, text: 'Vistos', path: '/viewed' },
    { icon: <FaCog className="w-5 h-5" />, text: 'Ajustes', path: '/settings' }
  ];

  return (
    <div className="fixed top-0 left-0 h-full flex items-center z-50">
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

      <div
        className={`fixed top-0 left-0 h-full flex items-center transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav
          className={`bg-base-200 rounded-r-lg shadow-lg p-4 transition-all duration-300 ${
            isHovered ? 'w-64' : 'w-16'
          }`}
        >
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center px-4 py-3 bg-base-100 rounded-lg text-base-content cursor-pointer hover:bg-base-300 hover:text-primary transition-colors duration-300"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center w-full">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className={`ml-3 whitespace-nowrap ${isHovered ? 'opacity-100' : 'opacity-0 w-0'} transition-all duration-300`}>
                    {item.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
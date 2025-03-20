import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function AddContentButton({ onClick }) {
  return (
    <button
      className="btn btn-circle btn-lg bg-primary text-white hover:bg-primary-focus fixed bottom-20 right-8 shadow-lg z-10"
      onClick={onClick}
    >
      <FaPlus className="text-xl" />
    </button>
  );
};
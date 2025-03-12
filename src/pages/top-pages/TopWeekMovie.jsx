import React from 'react';
import ManualCarousel from '../../components/ManualCarousel';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

export default function TopWeekMovie() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-600">
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white p-6">Películas Populares de la Semana</h1>
          <ManualCarousel mediaType="movie" timeWindow="week" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
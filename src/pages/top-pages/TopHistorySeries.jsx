import React from 'react';
import ManualCarousel from '../../components/ManualCarousel';
import Footer from '../../components/Footer';

export default function TopHistorySeries() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-600">
      <div className="flex flex-grow">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white p-6">Series Mejor Valoradas</h1>
          <ManualCarousel mediaType="tv" timeWindow="all" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
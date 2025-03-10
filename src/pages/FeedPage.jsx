import React from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function FeedPage() {
  return (
    <>
      <div className="flex justify-start min-h-screen bg-slate-600">
        <Sidebar />
        <div className="flex flex-col w-full p-6">
          <h1 className="text-3xl font-bold text-white mb-8">Feed</h1>
        </div>
      </div>
      <Footer />
    </>
  );
}
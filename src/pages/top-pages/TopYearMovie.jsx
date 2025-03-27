import React from 'react';
import ManualCarousel from '../../components/ManualCarousel';
import { motion } from 'framer-motion';

export default function TopYearMovie() {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Películas Populares del Año
          </h1>
          <div className="h-1 w-32 bg-primary rounded-full mb-4"></div>
          <p className="text-slate-300 text-lg">
            Descubre las películas más populares de este año
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ManualCarousel mediaType="movie" timeWindow="year" />
        </motion.div>
      </div>
    </motion.div>
  );
}
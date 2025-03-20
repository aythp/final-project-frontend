import React from 'react';

export default function StatsPanel  ({ stats })  {
  return (
    <div className="stats shadow bg-base-200 flex-col sm:flex-row w-full max-w-3xl">
      <div className="stat">
        <div className="stat-title">Total Películas</div>
        <div className="stat-value text-xl md:text-2xl lg:text-3xl">{stats.totalMovies}</div>
        <div className="stat-desc text-xs md:text-sm">
          {stats.watchedMovies} vistas • {stats.favoriteMovies} favoritas
        </div>
      </div>
      
      <div className="stat">
        <div className="stat-title">Total Series</div>
        <div className="stat-value text-xl md:text-2xl lg:text-3xl">{stats.totalSeries}</div>
        <div className="stat-desc text-xs md:text-sm">
          {stats.watchedSeries} vistas • {stats.favoriteSeries} favoritas
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Pendientes</div>
        <div className="stat-value text-xl md:text-2xl lg:text-3xl">{stats.pendingMovies + stats.pendingSeries}</div>
        <div className="stat-desc text-xs md:text-sm">
          {stats.pendingMovies} películas • {stats.pendingSeries} series
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import styles from '../page.module.css';

const WeatherMap = ({ lat, lon, layer, apiKey }) => {
  const urlTemplate = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`;

  return (
    <div className={styles.mapContainer}>
      <iframe
        title="Weather Map"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}`}
        style={{ width: '100%', height: '500px', border: 'none' }}
        allowFullScreen
      ></iframe>
      <div className={styles.overlay}>
        <img
          src={`https://tile.openweathermap.org/map/${layer}/10/0/0.png?appid=${apiKey}`}
          alt="Weather Layer"
          style={{ opacity: 0.7 }}
        />
      </div>
    </div>
  );
};

export default WeatherMap;

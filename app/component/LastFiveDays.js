import React from "react";
import styles from "../page.module.css";

const Forecast = ({ forecast }) => {
  // Fonction pour grouper les prévisions par jour
  const groupByDay = (data) => {
    const groups = {};

    data.forEach((item) => {
      // Utiliser la date sans l'heure pour grouper les données
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split("T")[0]; // Format YYYY-MM-DD pour le tri
      const formattedDate = date.toLocaleDateString("fr-FR");

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: formattedDate,
          timestamp: date.getTime(), // Stocker le timestamp pour le tri
          items: [],
        };
      }
      groups[dateKey].items.push(item);
    });

    // Convertir l'objet en tableau et trier par timestamp
    return Object.values(groups)
      .sort((a, b) => a.timestamp - b.timestamp) // Tri par ordre chronologique
      .map((group) => {
        const items = group.items;
        // Calcule les moyennes/max/min pour la journée
        return {
          date: group.date,
          timestamp: group.timestamp,
          temp_min: Math.min(...items.map((item) => item.main.temp)),
          temp_max: Math.max(...items.map((item) => item.main.temp)),
          icon: items[Math.floor(items.length / 2)].weather[0].icon,
          description:
            items[Math.floor(items.length / 2)].weather[0].description,
        };
      })
      .slice(0, 5); // Limite à 5 jours
  };

  const dailyForecast = groupByDay(forecast);

  return (
    <div className={styles.forecastContainer}>
      <h3>Prévisions des 5 prochains jours</h3>
      <div className={styles.forecastGrid}>
        {dailyForecast.map((day, index) => (
          <div key={index} className={styles.forecastDay}>
            <h4>
              {new Date(day.timestamp).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
              })}
            </h4>
            <div className={styles.imageContainer}>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                width={50}
                height={50}
              />
            </div>
            <p className={styles.forecastTemp}>
              {(day.temp_min - 273.15).toFixed(1)}°C /{" "}
              {(day.temp_max - 273.15).toFixed(1)}°C
            </p>
            <p className={styles.forecastDesc}>{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;

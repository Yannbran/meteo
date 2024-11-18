'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Loading from './component/Load'; // Assure-toi que le chemin est correct
import WeatherMap from './component/WeatherMap'; // Assure-toi que le chemin est correct

export default function Home() {
  const [datas, setDatas] = useState(null);
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs

  const meteo = async () => {
    if (city.trim() === '') return; // N'effectue pas la recherche si la ville est vide
    setLoading(true); // Commence le chargement
    setError(null); // Réinitialise l'erreur
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Ta clé API valide
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=fr`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Ville non trouvée');
      }
      const data = await response.json();
      console.log('Data:', data);
      setDatas(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message); // Définit l'erreur
    } finally {
      setLoading(false); // Termine le chargement
    }
  };

  const fetchSuggestions = async (value) => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.map(place => place.display_name));
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions :', error);
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
    fetchSuggestions(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (city) {
      meteo();
    }
  };

  return (
    <section className={styles.div}>
      <h1 className={styles.h1}>Météo</h1>
      <div className={styles.recherche}>
        <input
          type="text"
          name="ville"
          id={styles.ville}
          value={city}
          onChange={handleCityChange}
          placeholder="Entrez le nom d'une ville"
          autoComplete="off"
        />
        <button className={styles.button} onClick={handleSearch}>Rechercher</button>
        {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div>
        {loading ? (
          <Loading />
        ) : (
          <>
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              datas && (
                <p>{`${datas.name}: ${(datas.main.temp - 273.15).toFixed(2)}°C`}</p>
              )
            )}
          </>
        )}
      </div>
      <div className={styles.temp}>
        {datas && datas.weather && (
          <div>
            <div className={styles.weatherIconContainer}>
              <img
                src={`https://openweathermap.org/img/wn/${datas.weather[0].icon}@2x.png`}
                alt={datas.weather[0].description}
              />
            </div>
            <p>{datas.weather[0].description}</p>
          </div>
        )}
      </div>

      {datas && !error && (
        <div className={styles.detail}>
          <h3>{`Plus en détail à ${datas.name}`}</h3>
          <ul>
            <li>Coordonnées : {`Longitude: ${datas.coord.lon}, Latitude: ${datas.coord.lat}`}</li>
            <li>Température : {`${(datas.main.temp - 273.15).toFixed(2)}°C`}</li>
            <li>Ressenti : {`${(datas.main.feels_like - 273.15).toFixed(2)}°C`}</li>
            <li>Température Min : {`${(datas.main.temp_min - 273.15).toFixed(2)}°C`}</li>
            <li>Température Max : {`${(datas.main.temp_max - 273.15).toFixed(2)}°C`}</li>
            <li>Pression : {`${datas.main.pressure} hPa`}</li>
            <li>Humidité : {`${datas.main.humidity}%`}</li>
            <li>Niveau de la mer : {`${datas.main.sea_level} hPa`}</li>
            <li>Niveau du sol : {`${datas.main.grnd_level} hPa`}</li>
            <li>Visibilité : {`${datas.visibility} mètres`}</li>
            <li>Vent : {`Vitesse: ${datas.wind.speed} m/s, Direction: ${datas.wind.deg}°, Rafales: ${datas.wind.gust} m/s`}</li>
            <li>Nuages : {`${datas.clouds.all}%`}</li>
            <li>Lever du soleil : {new Date(datas.sys.sunrise * 1000).toLocaleTimeString()}</li>
            <li>Coucher du soleil : {new Date(datas.sys.sunset * 1000).toLocaleTimeString()}</li>
          </ul>
          <WeatherMap lat={datas.coord.lat} lon={datas.coord.lon} layer="clouds_new" apiKey={process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY} />
          
        </div>
      )}
    </section>
  );
}


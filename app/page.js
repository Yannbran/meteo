"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Loading from "./component/Load"; // Assure-toi que le chemin est correct
import WeatherMap from "./component/WeatherMap"; // Assure-toi que le chemin est correct

export default function Home() {
  const [datas, setDatas] = useState(null);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // État pour déterminer si le composant est monté côté client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marquer que le composant est monté côté client
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formater la date en français (seulement la date)
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  // Formater l'heure
  const formatTime = (date) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleTimeString("fr-FR", options);
  };

  const meteo = async () => {
    if (city.trim() === "") return; // N'effectue pas la recherche si la ville est vide
    setLoading(true); // Commence le chargement
    setError(null); // Réinitialise l'erreur

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.error("Clé API OpenWeather manquante");
      setError(
        "Clé API OpenWeather manquante. Veuillez configurer la variable d'environnement."
      );
      setLoading(false);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=fr`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Ville non trouvée");
      }
      const data = await response.json();
      console.log("Data:", data);
      setDatas(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message); // Définit l'erreur
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
      setSuggestions(data.map((place) => place.display_name));
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions :", error);
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
      <h1 className={styles.h1}>La météo en temps réel</h1>
      <p className={styles.dateTime}>{formatDate(currentDateTime)}</p>
      {/* N'afficher l'heure que lorsque le composant est monté côté client */}
      {isClient && (
        <p className={styles.timeDisplay}>{formatTime(currentDateTime)}</p>
      )}
      <Image
        className={styles.img}
        src="/favicon-32x32.png"
        alt="Météo"
        width={42}
        height={42}
        priority={true} // Ajout de l'attribut priority
      />
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
        <button className={styles.button} onClick={handleSearch}>
          Rechercher
        </button>
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
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              datas && (
                <p className={styles.temp}>{`${datas.name}: ${(
                  datas.main.temp - 273.15
                ).toFixed(2)}°C`}</p>
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
          <div className={styles.weatherDetails}>
            <div className={styles.weatherGroup}>
              <h4>Informations générales</h4>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Coordonnées</span>
                <span className={styles.weatherValue}>
                  {`Lon: ${datas.coord.lon}`}
                  <br />
                  {`Lat: ${datas.coord.lat}`}
                </span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Visibilité</span>
                <span
                  className={styles.weatherValue}
                >{`${datas.visibility} mètres`}</span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Nuages</span>
                <span
                  className={styles.weatherValue}
                >{`${datas.clouds.all}%`}</span>
              </div>
            </div>

            <div className={styles.weatherGroup}>
              <h4>Températures</h4>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Température</span>
                <span className={styles.weatherValue}>{`${(
                  datas.main.temp - 273.15
                ).toFixed(2)}°C`}</span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Ressenti</span>
                <span className={styles.weatherValue}>{`${(
                  datas.main.feels_like - 273.15
                ).toFixed(2)}°C`}</span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Min / Max</span>
                <span className={styles.weatherValue}>
                  {`${(datas.main.temp_min - 273.15).toFixed(2)}°C / ${(
                    datas.main.temp_max - 273.15
                  ).toFixed(2)}°C`}
                </span>
              </div>
            </div>

            <div className={styles.weatherGroup}>
              <h4>Conditions atmosphériques</h4>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Pression</span>
                <span
                  className={styles.weatherValue}
                >{`${datas.main.pressure} hPa`}</span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Humidité</span>
                <span
                  className={styles.weatherValue}
                >{`${datas.main.humidity}%`}</span>
              </div>
              {datas.main.sea_level && (
                <div className={styles.weatherItem}>
                  <span className={styles.weatherLabel}>Niveau de la mer</span>
                  <span
                    className={styles.weatherValue}
                  >{`${datas.main.sea_level} hPa`}</span>
                </div>
              )}
              {datas.main.grnd_level && (
                <div className={styles.weatherItem}>
                  <span className={styles.weatherLabel}>Niveau du sol</span>
                  <span
                    className={styles.weatherValue}
                  >{`${datas.main.grnd_level} hPa`}</span>
                </div>
              )}
            </div>

            <div className={styles.weatherGroup}>
              <h4>Vent</h4>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Vitesse</span>
                <span
                  className={styles.weatherValue}
                >{`${datas.wind.speed} m/s`}</span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Direction</span>
                <span
                  className={styles.weatherValue}
                >{`${datas.wind.deg}°`}</span>
              </div>
              {datas.wind.gust && (
                <div className={styles.weatherItem}>
                  <span className={styles.weatherLabel}>Rafales</span>
                  <span
                    className={styles.weatherValue}
                  >{`${datas.wind.gust} m/s`}</span>
                </div>
              )}
            </div>

            <div className={styles.weatherGroup}>
              <h4>Soleil</h4>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Lever</span>
                <span className={styles.weatherValue}>
                  {new Date(datas.sys.sunrise * 1000).toLocaleTimeString()}
                </span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherLabel}>Coucher</span>
                <span className={styles.weatherValue}>
                  {new Date(datas.sys.sunset * 1000).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <WeatherMap
            lat={datas.coord.lat}
            lon={datas.coord.lon}
            layer="clouds_new"
            apiKey={process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}
          />
        </div>
      )}
    </section>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerWrapper}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h4>
                <button onClick={openModal} className={styles.modalButton}>
                  A propos de Météo App
                </button>
              </h4>
            </div>
            <div className={styles.footerSection}>
              <h4>Liens utiles</h4>
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenWeather API
              </a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>
              &copy; {new Date().getFullYear()} Météo App. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>

            <div className={styles.modalContent}>
              <h3>Bienvenue sur Météo App</h3>
              <p>Votre application météo complète et intuitive.</p>

              <h4>Fonctionnalités principales :</h4>
              <ul>
                <li>Prévisions météo en temps réel</li>
                <li>Recherche de villes dans le monde entier</li>
                <li>Informations météorologiques détaillées</li>
                <li>Prévisions sur 5 jours</li>
                <li>Carte météo interactive</li>
              </ul>

              <h4>Technologies utilisées :</h4>
              <p>
                Développée avec Next.js, cette application utilise l'API
                OpenWeather pour des données météorologiques précises et
                fiables.
              </p>
              <h4>Crédits :</h4>
              <p>
                Les icônes météo sont fournies par OpenWeather. Les images sont
                optimisées par Next.js.
              </p>
              <h4>À propos de l'auteur :</h4>
              <p>
                Cette application a été développée par{" "}
                <Link
                  href="https://portfolio-next-js-red-omega.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  yannbranjonneau.fr.
                </Link>
                <br />
                N'hésitez pas à me contacter pour toute question ou suggestion.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Ajout de display swap pour améliorer la performance
  preload: true, // Préchargement explicite
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap", // Ajout de display swap pour améliorer la performance
  preload: true, // Préchargement explicite
});

export const metadata = {
  title: "Météo App | Prévisions météorologiques en temps réel",
  description:
    "Application météo moderne fournissant des prévisions météorologiques précises en temps réel pour toutes les villes du monde.",
};

// Nouvel export pour le viewport selon les recommandations de Next.js
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#4361ee" />
        {/* Ajout de la balise recommandée pour les appareils Android */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Conservation de la balise pour la compatibilité iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

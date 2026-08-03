// src/app/layout.jsx
import "./globals.scss";
import "@styles/variables.scss";

export const metadata = {
  title: "Sivasakthi Science Foundation™",
  description: "Advancing Research, Training & Education",
  keywords: ["Sivasakthi Science Foundation", "Deep Learning Biology", "Multi-Omics", "Sequence Transformers", "Bharat Genome Database"],

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts Preconnect and Optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome v6 CSS CDN link matching original code setup */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
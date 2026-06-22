// src/app/layout.jsx
import "./globals.scss";
import "@styles/variables.scss";

export const metadata = {
  title: "Sivasakthi Science Foundation™",
  description: "Advancing Research, Training & Education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
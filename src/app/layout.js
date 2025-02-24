// src/app/layout.jsx
import './globals.css'; // Asegúrate de importar aquí tu archivo de CSS global
import { Inter } from 'next/font/google';

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontHeading.variable} ${fontBody.variable} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}

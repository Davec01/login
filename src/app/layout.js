// src/app/layout.js
"use client";
import './globals.css'; // Importa tu archivo de CSS global
import { Inter } from 'next/font/google';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '../auth0Config'; // Corrige la ruta de importación a un nivel más arriba

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
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
    >
      <html lang="en">
        <body className={`${fontHeading.variable} ${fontBody.variable} bg-background text-foreground`}>
          {children}
        </body>
      </html>
    </Auth0Provider>
  );
}

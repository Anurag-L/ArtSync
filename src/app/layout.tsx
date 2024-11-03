// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Find your Art Twin!',
  description: 'Arcade-style art affinity matcher',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Press Start 2P', cursive" }}>{children}</body>
    </html>
  );
}

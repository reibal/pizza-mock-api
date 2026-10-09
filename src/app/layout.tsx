import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Pizza Mock API',
  description: 'API mock de gestión de pizzas para el curso de testing con Bruno',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

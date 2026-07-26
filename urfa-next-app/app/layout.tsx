import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Urfa',
  description: 'Fresh food and memorable hospitality.',
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
};

export default Layout;

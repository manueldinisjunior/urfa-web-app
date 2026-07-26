import React from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import '../styles/globals.css';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
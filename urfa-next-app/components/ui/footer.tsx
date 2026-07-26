import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Your Brand Name. All rights reserved.
                </p>
                <div className="mt-2">
                    <a href="/about" className="text-gray-400 hover:text-white mx-2">About</a>
                    <a href="/menu" className="text-gray-400 hover:text-white mx-2">Menu</a>
                    <a href="/contact" className="text-gray-400 hover:text-white mx-2">Contact</a>
                    <a href="/careers" className="text-gray-400 hover:text-white mx-2">Careers</a>
                    <a href="/faq" className="text-gray-400 hover:text-white mx-2">FAQ</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
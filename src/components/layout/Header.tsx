import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container header-inner">
                <div className="logo">
                    <Link to="/">Urfa</Link>
                </div>
                <nav className="navigation">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                    </ul>
                </nav>
                <button className="mobile-menu" aria-label="Open menu">☰</button>
            </div>
        </header>
    );
};

export default Header;
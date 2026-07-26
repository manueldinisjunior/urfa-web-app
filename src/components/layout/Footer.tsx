import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <div>
                    <h3>Urfa Grill</h3>
                    <p>&copy; {new Date().getFullYear()} Crafted for modern restaurant experiences.</p>
                </div>
                <nav>
                    <ul>
                        <li><a href="#/">Home</a></li>
                        <li><a href="#/cart">Cart</a></li>
                        <li><a href="#/product/1">Menu</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
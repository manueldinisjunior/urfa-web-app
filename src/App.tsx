import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductPage from './pages/ProductPage';
import NotFound from './pages/NotFound';
import CartView from './features/cart/CartView';
import ProductList from './components/product/ProductList';
import useProductLoader from './hooks/useProductLoader';

const App: React.FC = () => {
    const { products, loading, error } = useProductLoader();

    return (
        <HashRouter>
            <div className="app-shell">
                <Header />
                <main className="main-content">
                    <Switch>
                        <Route path="/" exact>
                            <section className="hero-section">
                                <div className="hero-copy">
                                    <p className="eyebrow">Fresh flavors, modern experience</p>
                                    <h1>Discover the next generation of Urfa dining.</h1>
                                    <p className="hero-text">
                                        A polished, fast, and elegant way to explore signature dishes, discover favorites,
                                        and order with confidence.
                                    </p>
                                    <div className="hero-actions">
                                        <a className="btn btn-primary" href="#/cart">View cart</a>
                                        <a className="btn btn-secondary" href="#/product/1">Explore dishes</a>
                                    </div>
                                </div>
                                <div className="hero-card">
                                    <p className="hero-card-label">Today’s favorite</p>
                                    <h3>Urfa Grill Mix Plate</h3>
                                    <p className="hero-card-price">€14.90</p>
                                    <ul>
                                        <li>Chargrilled meats</li>
                                        <li>Fresh herbs & sauces</li>
                                        <li>Fast pickup or delivery</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="content-section">
                                <div className="section-heading">
                                    <p className="eyebrow">Why people love it</p>
                                    <h2>Clean design, premium feel, and quick access.</h2>
                                    <p>Everything is crafted to feel modern, reassuring, and delightfully simple.</p>
                                </div>
                                <div className="feature-grid">
                                    <article className="feature-card">
                                        <h3>Beautiful browsing</h3>
                                        <p>Cards, spacing, and motion feel polished on every screen size.</p>
                                    </article>
                                    <article className="feature-card">
                                        <h3>Fast order flow</h3>
                                        <p>Move from discovery to checkout in a few bright, confident steps.</p>
                                    </article>
                                    <article className="feature-card">
                                        <h3>Built for delivery</h3>
                                        <p>Prepared to support modern restaurant experiences with ease.</p>
                                    </article>
                                </div>
                            </section>

                            <section className="content-section">
                                <div className="section-heading">
                                    <p className="eyebrow">Featured dishes</p>
                                    <h2>Some of the most popular picks.</h2>
                                </div>
                                {loading && <p className="status-pill">Loading featured dishes...</p>}
                                {error && <p className="status-pill">Unable to load menu right now.</p>}
                                {!loading && !error && <ProductList products={products.slice(0, 4)} />}
                            </section>
                        </Route>
                        <Route path="/product/:id" component={ProductPage} />
                        <Route path="/cart" component={CartView} />
                        <Route component={NotFound} />
                    </Switch>
                </main>
                <Footer />
            </div>
        </HashRouter>
    );
};

export default App;
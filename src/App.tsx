import { useEffect } from 'react';
import { HashRouter, Route, Switch, useLocation } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CartView from './features/cart/CartView';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';
import ProductPage from './pages/ProductPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

const App = () => (
  <HashRouter>
    <ScrollToTop />
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); document.getElementById("main-content")?.focus(); }}>Zum Inhalt springen</a>
      <Header />
      <main id="main-content" tabIndex={-1} className="main-content">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/menu" exact component={Menu} />
          <Route path="/about" exact component={About} />
          <Route path="/contact" exact component={Contact} />
          <Route path="/careers" exact component={Careers} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/cart" component={CartView} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  </HashRouter>
);

export default App;

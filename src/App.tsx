import { HashRouter, Route, Switch } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import CartView from './features/cart/CartView';
import Home from './pages/Home';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';
import ProductPage from './pages/ProductPage';

const App = () => (
  <HashRouter>
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
      <Header />
      <main id="main-content" className="main-content">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/menu" exact component={Menu} />
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

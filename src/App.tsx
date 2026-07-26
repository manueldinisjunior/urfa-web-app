import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import NotFound from './pages/NotFound';
import CartView from './features/cart/CartView';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/product/:id" component={ProductPage} />
                <Route path="/cart" component={CartView} />
                <Route component={NotFound} />
            </Switch>
            <Footer />
        </Router>
    );
};

export default App;
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ProductList from '../components/product/ProductList';
import { products } from '../data/products';
import { addItem } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';
import type { Product } from '../types';

const categories = ['Alle', 'Grill', 'Wraps', 'Vegetarisch', 'Beilagen'] as const;
type CategoryFilter = (typeof categories)[number];

const Menu = () => {
  const [category, setCategory] = useState<CategoryFilter>('Alle');
  const dispatch = useDispatch<AppDispatch>();
  const visibleProducts = useMemo(
    () => category === 'Alle' ? products : products.filter((product) => product.category === category),
    [category],
  );

  const addToCart = (product: Product) => {
    dispatch(addItem({ ...product, quantity: 1 }));
  };

  return (
    <section className="content-section menu-page" aria-labelledby="menu-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow dark">Speisekarte</p>
          <h1 id="menu-title">Worauf hast du Appetit?</h1>
          <p>Alle Preise inklusive gesetzlicher Mehrwertsteuer.</p>
        </div>
      </div>
      <div className="filters" aria-label="Speisekarte filtern">
        {categories.map((entry) => (
          <button
            className={entry === category ? 'filter active' : 'filter'}
            key={entry}
            type="button"
            aria-pressed={entry === category}
            onClick={() => setCategory(entry)}
          >
            {entry}
          </button>
        ))}
      </div>
      <ProductList products={visibleProducts} onAddToCart={addToCart} />
    </section>
  );
};

export default Menu;

import { BowlFood, Fire, ForkKnife, Leaf, SquaresFour } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import { products } from '../data/products';
import { addItem } from '../features/cart/cartSlice';
import type { AppDispatch } from '../store';
import type { Product } from '../types';

const categories = [
  { name: 'Alle', icon: SquaresFour },
  { name: 'Grill', icon: Fire },
  { name: 'Wraps', icon: ForkKnife },
  { name: 'Vegetarisch', icon: Leaf },
  { name: 'Beilagen', icon: BowlFood },
] as const;
type CategoryFilter = (typeof categories)[number]['name'];

const Menu = () => {
  const [category, setCategory] = useState<CategoryFilter>('Alle');
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const search = new URLSearchParams(location.search).get('search')?.trim().toLocaleLowerCase('de') ?? '';
  const visibleProducts = useMemo(() => products.filter((product) => {
    const categoryMatches = category === 'Alle' || product.category === category;
    const searchMatches = !search || `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase('de').includes(search);
    return categoryMatches && searchMatches;
  }), [category, search]);

  const addToCart = (product: Product) => dispatch(addItem({ ...product, quantity: 1 }));

  return (
    <div className="menu-page">
      <header className="page-intro">
        <div>
          <h1>Speisekarte</h1>
          <p><Link to="/">Startseite</Link> <span>›</span> Speisekarte</p>
        </div>
        <p>{visibleProducts.length} Gerichte verfügbar{search ? ` für „${search}“` : ''}</p>
      </header>
      <section className="menu-catalog" aria-labelledby="menu-catalog-title">
        <h2 id="menu-catalog-title" className="visually-hidden">Gerichte</h2>
        <div className="category-tabs" aria-label="Speisekarte filtern">
          {categories.map(({ name, icon: Icon }) => (
            <button
              className={name === category ? 'active' : ''}
              key={name}
              type="button"
              aria-pressed={name === category}
              onClick={() => setCategory(name)}
            >
              <Icon weight="thin" />
              <span>{name}</span>
            </button>
          ))}
        </div>
        <ProductList products={visibleProducts} onAddToCart={addToCart} />
      </section>
    </div>
  );
};

export default Menu;

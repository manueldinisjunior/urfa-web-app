import {
  BeerBottle,
  BowlFood,
  Fire,
  ForkKnife,
  Leaf,
  SquaresFour,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import categoryNames from "../data/categories.json";
import { useDispatch } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import ProductList from "../components/product/ProductList";
import ProductModal from "../components/product/ProductModal";
import { useCatalog } from "../hooks/useCatalog";
import { Notice } from "../components/OperationsUI";
import { addItem } from "../features/cart/cartSlice";
import type { AppDispatch } from "../store";
import type { Product } from "../types";
import { createCartItem } from "../utils/cartItem";

const WrapIcon = (_props: unknown) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d="M7 11 15 29 26 8M7 11l15 9M11 18l9-7" />
    <ellipse cx="16.5" cy="9" rx="10" ry="5" transform="rotate(-12 16.5 9)" />
    <path d="m11 8 3-2 3 3 3-3 3 2M14 11l3-2" />
  </svg>
);
const categories = [
  { name: "Alle", icon: SquaresFour },
  ...categoryNames.map((name) => ({
    name,
    icon: /dürüm|wrap/i.test(name)
      ? WrapIcon
      : /getränk/i.test(name)
        ? BeerBottle
        : /salat/i.test(name)
          ? Leaf
          : /grill/i.test(name)
            ? Fire
            : /suppe/i.test(name)
              ? BowlFood
              : ForkKnife,
  })),
];
type CategoryFilter = string;

const Menu = () => {
  const { products, loading, error } = useCatalog();

  const [limit, setLimit] = useState(24);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const history = useHistory();
  const requestedCategory = new URLSearchParams(location.search).get(
    "category",
  );
  const category: CategoryFilter =
    categories.find(({ name }) => name === requestedCategory)?.name ?? "Alle";
  const setCategory = (name: CategoryFilter) => {
    const params = new URLSearchParams(location.search);
    if (name === "Alle") params.delete("category");
    else params.set("category", name);
    history.push(`/menu${params.toString() ? `?${params}` : ""}`);
  };
  const search =
    new URLSearchParams(location.search)
      .get("search")
      ?.trim()
      .toLocaleLowerCase("de") ?? "";
  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatches =
          category === "Alle" || product.category === category;
        const searchMatches =
          !search ||
          `${product.name} ${product.description} ${product.category}`
            .toLocaleLowerCase("de")
            .includes(search);
        return categoryMatches && searchMatches;
      }),
    [category, search, products],
  );

  useEffect(() => setLimit(24), [category, search]);
  const addToCart = (product: Product) => {
    if (
      product.variants?.length ||
      product.configurationPending ||
      product.optionGroups?.length ||
      product.extras?.length
    )
      setSelectedProduct(product);
    else dispatch(addItem(createCartItem(product)));
  };

  return (
    <div className="menu-page">
      <header className="page-intro">
        <div>
          <h1>{category === "Alle" ? "Speisekarte" : category}</h1>
          <nav className="breadcrumbs" aria-label="Brotkrümelnavigation">
            <Link to="/">Startseite</Link>
            <span aria-hidden="true">›</span>
            {category === "Alle" ? (
              <span aria-current="page">Speisekarte</span>
            ) : (
              <>
                <Link to="/menu">Speisekarte</Link>
                <span aria-hidden="true">›</span>
                <span aria-current="page">{category}</span>
              </>
            )}
          </nav>
        </div>
        <p>
          {visibleProducts.length} Produkte verfügbar
          {search ? ` für „${search}“` : ""}
        </p>
      </header>
      <section className="menu-catalog" aria-labelledby="menu-catalog-title">
        <h2 id="menu-catalog-title" className="visually-hidden">
          Gerichte
        </h2>
        <div className="category-tabs" aria-label="Speisekarte filtern">
          {categories.map(({ name, icon: Icon }) => (
            <button
              className={name === category ? "active" : ""}
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
        <div className="catalog-transition" key={`${category}-${search}`}>
          {loading && <Notice>Speisekarte wird geladen …</Notice>}
          {error && <Notice error>{error}</Notice>}
          <ProductList
            products={visibleProducts.slice(0, limit)}
            onAddToCart={addToCart}
            onViewProduct={setSelectedProduct}
          />
        </div>
        {visibleProducts.length > limit && (
          <button className="red-button" onClick={() => setLimit(limit + 24)}>
            Weitere Gerichte anzeigen ({visibleProducts.length - limit})
          </button>
        )}
      </section>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Menu;

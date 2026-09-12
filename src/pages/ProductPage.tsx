import { Link, useParams } from 'react-router-dom';
import ProductConfigurator from '../components/product/ProductConfigurator';
import { getProductById } from '../data/products';
import { assetUrl } from '../utils/assetUrl';
import { formatPrice } from '../utils/formatPrice';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);

  if (!product) {
    return (
      <section className="message-page">
        <p className="section-kicker">404</p>
        <h1>Gericht nicht gefunden.</h1>
        <Link className="red-button" to="/menu">Zur Speisekarte</Link>
      </section>
    );
  }

  return (
    <section className="product-detail-page">
      <div className="product-detail-image">
        <img src={assetUrl(product.imageUrl)} alt={product.name} />
      </div>
      <div className="product-detail-copy">
        <p className="breadcrumb"><Link to="/menu">Speisekarte</Link> <span>›</span> {product.category}</p>
        <p className="section-kicker">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong>{formatPrice(product.price)}</strong>
        <ProductConfigurator key={product.id} product={product} formId={`product-page-${product.id}`} />
      </div>
    </section>
  );
};

export default ProductPage;

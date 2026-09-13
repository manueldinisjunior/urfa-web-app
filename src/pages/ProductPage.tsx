import { Link, useParams } from 'react-router-dom';
import ProductConfigurator from '../components/product/ProductConfigurator';
import { FavoriteButton } from '../features/CustomerAccount';
import { useCatalog } from '../hooks/useCatalog';
import { Notice } from '../components/OperationsUI';
import ProductPhoto, { hasProductPhoto } from '../components/product/ProductPhoto';
import { formatPrice } from '../utils/formatPrice';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const {products,loading,error}=useCatalog();
  const product = products.find(product=>product.id===id);
  if(loading)return <Notice>Produkt wird geladen …</Notice>;
  if(error)return <Notice error>{error}</Notice>;

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
    <section className={`product-detail-page ${hasProductPhoto(product)?'':'without-image'}`}>
      <div className="product-detail-image">
        <ProductPhoto product={product} />
      </div>
      <div className="product-detail-copy">
        <p className="breadcrumb"><Link to="/menu">Speisekarte</Link> <span>›</span> {product.category}</p>
        <p className="section-kicker">{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <strong>{formatPrice(product.price)}</strong>
        {product.productInfo && <p className="muted">{product.productInfo}</p>}
          {!!product.ingredients?.length && <div><h3>Zutaten</h3><p>{product.ingredients.join(', ')}</p></div>}
          {!!product.allergenCodes?.length && <p className="muted">Allergenkennzeichnung der Quelle: {product.allergenCodes.join(', ')}. Details bitte beim Restaurant erfragen.</p>}
          <ProductConfigurator key={product.id} product={product} formId={`product-page-${product.id}`} />
          <FavoriteButton id={product.id}/>
      </div>
    </section>
  );
};

export default ProductPage;

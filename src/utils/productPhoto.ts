import type { Product } from '../types';
// Representative serving suggestions, never advertised as restaurant photographs.
export function withProductPhoto(product: Product): Product {
 if(product.imageUrl)return product;
 const name=product.name.toLocaleLowerCase('de');
 const imageUrl = product.category==='Schnitzel' ? 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Wiener_Schnitzel_in_Wien.JPG/960px-Wiener_Schnitzel_in_Wien.JPG'
 : product.category==='Pizza' ? 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/960px-Pizza-3007395.jpg'
 : /mercimek/.test(name) ? 'assets/product-mercimek.webp'
 : /ayran/.test(name) ? 'assets/product-ayran.webp'
 : /salgam|şalgam/.test(name) ? 'assets/product-salgam.webp'
 : /dürüm/.test(product.category.toLowerCase()) ? 'assets/product-adana-wrap.webp'
 : /tavuk/.test(name)&&/Grill/.test(product.category) ? 'assets/product-tavuk-sis.webp'
 : /karisik|karışık/.test(name) ? 'assets/product-urfa-mix.webp'
 : /falafel/.test(name) ? 'assets/product-falafel-bowl.webp'
 : /mezze/.test(name) ? 'assets/product-mezze.webp' : '';
 return {...product,imageUrl};
}

import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 'urfa-mix',
    name: 'Urfa Grill Mix',
    description: 'Lammspieß, Hähnchen, Köfte, Bulgur, Salat und zwei hausgemachte Saucen.',
    price: 16.9,
    category: 'Grill',
    imageUrl: 'assets/product-urfa-mix.jpg',
    featured: true,
  },
  {
    id: 'adana-wrap',
    name: 'Adana Wrap',
    description: 'Würziges Hackfleisch, Tomate, Petersilie, Sumach-Zwiebeln und Lavash.',
    price: 8.9,
    category: 'Wraps',
    imageUrl: 'assets/product-adana-wrap.jpg',
    featured: true,
  },
  {
    id: 'tavuk-sis',
    name: 'Tavuk Şiş',
    description: 'Marinierter Hähnchenspieß vom Grill mit Bulgur, Salat und Joghurt.',
    price: 13.5,
    category: 'Grill',
    imageUrl: 'assets/product-tavuk-sis.jpg',
    featured: true,
  },
  {
    id: 'falafel-bowl',
    name: 'Falafel Bowl',
    description: 'Knusprige Falafel, Hummus, Bulgur, Kräuter, Gemüse und Tahini.',
    price: 10.9,
    category: 'Vegetarisch',
    imageUrl: 'assets/product-falafel-bowl.jpg',
    featured: true,
  },
  {
    id: 'mercimek',
    name: 'Mercimek Çorbası',
    description: 'Cremige rote Linsensuppe mit Zitrone, Minze und frischem Fladenbrot.',
    price: 5.5,
    category: 'Vegetarisch',
    imageUrl: 'assets/product-mercimek.jpg',
  },
  {
    id: 'mezze',
    name: 'Mezze Teller',
    description: 'Hummus, Acılı Ezme, Haydari, Oliven, Salat und warmes Fladenbrot.',
    price: 9.5,
    category: 'Beilagen',
    imageUrl: 'assets/product-mezze.jpg',
  },
];

export const getProductById = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

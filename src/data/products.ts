import type { Product } from '../types';

export const products: Product[] = [
  {
    id: 'urfa-mix',
    name: 'Urfa Grill Mix',
    description: 'Lammspieß, Hähnchen, Köfte, Bulgur, Salat und zwei hausgemachte Saucen.',
    price: 16.9,
    category: 'Grill',
    imageUrl: 'assets/product-urfa-mix.webp',
    featured: true,
    optionGroups: [{
      id: 'garstufe',
      name: 'Garstufe',
      required: true,
      options: [
        { id: 'saftig', name: 'Saftig gegrillt' },
        { id: 'durch', name: 'Gut durchgegrillt' },
      ],
    }],
    extras: [
      { id: 'brot', name: 'Extra Fladenbrot', price: 1.5 },
      { id: 'ezme', name: 'Acılı Ezme', price: 1.9 },
      { id: 'sauce', name: 'Knoblauchsauce', price: 1.2 },
    ],
  },
  {
    id: 'adana-wrap',
    name: 'Adana Wrap',
    description: 'Würziges Hackfleisch, Tomate, Petersilie, Sumach-Zwiebeln und Lavash.',
    price: 8.9,
    category: 'Wraps',
    imageUrl: 'assets/product-adana-wrap.webp',
    featured: true,
    optionGroups: [{
      id: 'schaerfe',
      name: 'Schärfegrad',
      required: true,
      options: [
        { id: 'mild', name: 'Mild' },
        { id: 'pikant', name: 'Pikant' },
        { id: 'urfa', name: 'Urfa scharf', price: 0.5 },
      ],
    }],
    extras: [
      { id: 'kaese', name: 'Schafskäse', price: 1.8 },
      { id: 'sauce', name: 'Knoblauchsauce', price: 1.2 },
    ],
  },
  {
    id: 'tavuk-sis',
    name: 'Tavuk Şiş',
    description: 'Marinierter Hähnchenspieß vom Grill mit Bulgur, Salat und Joghurt.',
    price: 13.5,
    category: 'Grill',
    imageUrl: 'assets/product-tavuk-sis.webp',
    featured: true,
    optionGroups: [{
      id: 'beilage',
      name: 'Beilage',
      required: true,
      options: [
        { id: 'bulgur', name: 'Bulgur' },
        { id: 'reis', name: 'Reis' },
        { id: 'salat', name: 'Großer Salat', price: 1.5 },
      ],
    }],
    extras: [
      { id: 'brot', name: 'Extra Fladenbrot', price: 1.5 },
      { id: 'sauce', name: 'Knoblauchsauce', price: 1.2 },
    ],
  },
  {
    id: 'falafel-bowl',
    name: 'Falafel Bowl',
    description: 'Knusprige Falafel, Hummus, Bulgur, Kräuter, Gemüse und Tahini.',
    price: 10.9,
    category: 'Vegetarisch',
    imageUrl: 'assets/product-falafel-bowl.webp',
    featured: true,
    optionGroups: [{
      id: 'sauce',
      name: 'Sauce',
      required: true,
      options: [
        { id: 'tahini', name: 'Tahini' },
        { id: 'joghurt', name: 'Kräuterjoghurt' },
        { id: 'scharf', name: 'Scharfe Sauce' },
      ],
    }],
    extras: [
      { id: 'falafel', name: '2 extra Falafel', price: 2.4 },
      { id: 'hummus', name: 'Extra Hummus', price: 1.9 },
    ],
  },
  {
    id: 'mercimek',
    name: 'Mercimek Çorbası',
    description: 'Cremige rote Linsensuppe mit Zitrone, Minze und frischem Fladenbrot.',
    price: 5.5,
    category: 'Vegetarisch',
    imageUrl: 'assets/product-mercimek.webp',
    extras: [{ id: 'brot', name: 'Extra Fladenbrot', price: 1.5 }],
  },
  {
    id: 'mezze',
    name: 'Mezze Teller',
    description: 'Hummus, Acılı Ezme, Haydari, Oliven, Salat und warmes Fladenbrot.',
    price: 9.5,
    category: 'Beilagen',
    imageUrl: 'assets/product-mezze.webp',
    extras: [{ id: 'brot', name: 'Extra Fladenbrot', price: 1.5 }],
  },
  {
    id: 'ayran',
    name: 'Ayran',
    description: 'Klassischer türkischer Joghurtdrink, kalt serviert · 0,3 l.',
    price: 2.9,
    category: 'Getränke',
    imageUrl: 'assets/product-ayran.webp',
  },
  {
    id: 'salgam',
    name: 'Şalgam',
    description: 'Würzig-säuerlicher türkischer Rübensaft, kalt serviert · 0,3 l.',
    price: 3.2,
    category: 'Getränke',
    imageUrl: 'assets/product-salgam.webp',
  },
];

export const getProductById = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

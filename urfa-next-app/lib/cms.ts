export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
}

export interface JobOpening {
  id: string;
  title: string;
  description: string;
  applyLink: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'urfa-special',
    name: 'Urfa Special',
    description: 'Chargrilled house specialty served with seasonal sides.',
    image: '/images/menu/urfa-special.jpg',
    price: '€18.90',
  },
  {
    id: 'vegetable-plate',
    name: 'Vegetable Plate',
    description: 'Grilled vegetables, herbs, and a house dressing.',
    image: '/images/menu/vegetable-plate.jpg',
    price: '€13.50',
  },
];

const jobOpenings: JobOpening[] = [
  {
    id: 'service-team',
    title: 'Service Team Member',
    description: 'Help us create a welcoming and memorable guest experience.',
    applyLink: 'mailto:careers@example.com?subject=Service%20Team%20Application',
  },
];

export async function fetchMenuItems(): Promise<MenuItem[]> {
  return menuItems;
}

export async function fetchJobOpenings(): Promise<JobOpening[]> {
  return jobOpenings;
}

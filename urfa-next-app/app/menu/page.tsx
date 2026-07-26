import React from 'react';
import MenuGrid from '@/components/sections/menu-grid';
import { fetchMenuItems } from '@/lib/cms';

const MenuPage = async () => {
  const menuItems = await fetchMenuItems();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
      <MenuGrid items={menuItems} />
    </div>
  );
};

export default MenuPage;
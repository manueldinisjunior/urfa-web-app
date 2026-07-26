import React from 'react';

const MenuGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 shadow-md">
          <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-t-lg" />
          <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
          <span className="text-xl font-bold">{item.price}</span>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
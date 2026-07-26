import React from 'react';

const features = [
  {
    title: 'Feature One',
    description: 'Description of feature one.',
    icon: '🌟',
  },
  {
    title: 'Feature Two',
    description: 'Description of feature two.',
    icon: '🚀',
  },
  {
    title: 'Feature Three',
    description: 'Description of feature three.',
    icon: '💡',
  },
];

const FeatureCards = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
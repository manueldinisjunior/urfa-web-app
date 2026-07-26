import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="relative bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-4">Welcome to Kasushi</h1>
                <p className="text-lg mb-8">Experience the best sushi in town, crafted with fresh ingredients and authentic techniques.</p>
                <a href="#menu" className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                    View Menu
                </a>
            </div>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/your/image.jpg)' }} />
        </section>
    );
};

export default Hero;
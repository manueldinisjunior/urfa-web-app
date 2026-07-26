import React from 'react';

const Gallery: React.FC<{ images: string[] }> = ({ images }) => {
    return (
        <section className="py-10">
            <h2 className="text-3xl font-bold text-center mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                        <img src={image} alt={`Gallery image ${index + 1}`} className="w-full h-auto" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
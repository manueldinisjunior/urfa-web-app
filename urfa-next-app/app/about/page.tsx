import React from 'react';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg mb-4">
                Welcome to our brand! We are dedicated to providing the best products and services to our customers. Our story began with a passion for quality and a commitment to excellence.
            </p>
            <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Quality: We prioritize the highest standards in everything we do.</li>
                <li>Integrity: We believe in honesty and transparency with our customers.</li>
                <li>Innovation: We strive to bring new ideas and solutions to the market.</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-lg">
                Our mission is to create exceptional experiences for our customers through our products and services. We aim to inspire and connect with our community.
            </p>
        </div>
    );
};

export default AboutPage;
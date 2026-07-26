import React from 'react';
import Hero from '../components/ui/hero';
import FeatureCards from '../components/sections/feature-cards';
import MenuGrid from '../components/sections/menu-grid';
import Gallery from '../components/sections/gallery';
import TeamSection from '../components/sections/team-section';
import { fetchMenuItems } from '../lib/cms';

const galleryImages = [
  '/images/gallery/restaurant.jpg',
  '/images/gallery/food.jpg',
  '/images/gallery/team.jpg',
];

const HomePage = async () => {
    const menuItems = await fetchMenuItems();

    return (
        <main className="flex flex-col items-center">
            <Hero />
            <FeatureCards />
            <MenuGrid items={menuItems} />
            <Gallery images={galleryImages} />
            <TeamSection />
        </main>
    );
};

export default HomePage;

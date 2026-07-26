import React from 'react';
import Hero from '../components/ui/hero';
import FeatureCards from '../components/sections/feature-cards';
import MenuGrid from '../components/sections/menu-grid';
import Gallery from '../components/sections/gallery';
import TeamSection from '../components/sections/team-section';

const HomePage = () => {
    return (
        <main className="flex flex-col items-center">
            <Hero />
            <FeatureCards />
            <MenuGrid />
            <Gallery />
            <TeamSection />
        </main>
    );
};

export default HomePage;
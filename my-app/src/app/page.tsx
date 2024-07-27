import React, { useEffect, useState } from 'react';
import AdCard from './components/AdCard';
import { fetchAds } from './services/adService';
import { Ad } from './models/Ad';

const HomePage: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await fetchAds();
        setAds(data);
      } catch (error) {
        console.error('Error loading ads:', error);
      }
    };

    loadAds();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Ads</h1>
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default HomePage;

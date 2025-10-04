import React from 'react';
import HeroBanner from '../components/HeroBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import BrandValues from '../components/BrandValues';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <BrandValues />
      <Footer />
    </>
  );
};

export default Home;

import React from 'react';
import Carousel from '../../components/Carousel';
import "./HomePage.css";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer';
export default function HomePage() {
  return (
    <>
    <Navbar />
      <Carousel />
    <Footer/>
    </>
  );
}
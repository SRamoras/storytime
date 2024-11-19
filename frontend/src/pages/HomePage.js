import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './HomePage.css';
import BlackButton from '../components/BlackButton';    
import Image1 from '../Assets/pc.png';
import FeaturesSection from '../components/FeaturesSection';
import ScrollToTopButton from '../components/ScrollToTopButton';
import Testimonials from '../components/Testimonials';
import { FaRegLightbulb } from 'react-icons/fa';
import LampComponent from '../components/InfoSection';
 import WalletComponent from '../components/WalletComponent';
import TabletComponent from '../components/TabletComponent';
import ReviewCard from '../components/ReviewCard';

const reviews = [
    {
      initials: "JL",
      title: "Product Review",
      stars: 4,
      text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born...",
    },
    {
      initials: "SM",
      title: "Great Experience",
      stars: 5,
      text: "This product has changed my life completely! I cannot recommend it enough for everyone out there.",
    },
  ];
const HomePage = () => {
    return (
        <div className="homepage-container-main">
           <div className='Intro-container'>
            <div className="text-section">
                <h1>Explore <br />diverse stories</h1>
                <p>Discover captivating stories and connect with others.</p>
                <BlackButton text="Get started" to="/StorysPage" />
            </div>
            <div className="image-section">
                <div className="image-wrapper">
                    
                </div>
            </div>
</div>
            {/* Nova seção de explorações */}
             <LampComponent />
              <ScrollToTopButton /> 
           
       <TabletComponent />
<WalletComponent />
   
       <div>
      <ReviewCard/>
     
    </div>
        
        </div>
    );
};

export default HomePage;

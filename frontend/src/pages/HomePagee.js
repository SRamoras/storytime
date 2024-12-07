// src/pages/HomePage.js

import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';  
import ScrollToTopButton from '../components/ScrollToTopButton';
import InfoSection from '../components/InfoSectionn';
import WalletComponent from '../components/WalletComponent';
import TabletComponent from '../components/TabletComponent';
import ReviewCard from '../components/ReviewCard';
import HomeImg from '../assets/Home.png';
import LoomFeatureComponent from '../components/LoomFeatureComponent';
import CardsSection from '../components/CardsSection';
import LoomFeatureComponentInverse from '../components/LoomFeatureComponentInverse';

const HomePage = () => {
    return (
        <div className="homepage-container-main">
            {/* New Parent Div */}
            <div className="background-container">
                <div className='Intro-container' id="home">
                    <div className="text-section">
                        <p>Uncover Tales That Inspire and Build Connections.</p> 
                        <h1>Discover captivating <br />stories and connect <br /> with others.</h1>

                        <div className='button-section'>
                            <Link to="/login">
                                <button className='first-button'>Start for free</button>
                            </Link>
                            <Link to="/about">
                                <button className='second-button'>About us</button>
                            </Link>
                        </div>
                    </div>
                    <img src={HomeImg} alt="Home" />
                </div>    
            </div>
            
            {/* InfoSection now inside the background container */}
            <div className='main-container-home-page'>
                <InfoSection id="info" />
                <LoomFeatureComponent id="features" />
                <ScrollToTopButton /> 
                <CardsSection id="cards" />
                <LoomFeatureComponentInverse id="features-inverse" />
                <ReviewCard id="reviews"/>
            </div>
        </div>
    );
};

export default HomePage;

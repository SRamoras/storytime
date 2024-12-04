import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import BlackButton from '../components/BlackButton';    
import ScrollToTopButton from '../components/ScrollToTopButton';
import InfoSection from '../components/InfoSection';
import WalletComponent from '../components/WalletComponent';
import TabletComponent from '../components/TabletComponent';
import ReviewCard from '../components/ReviewCard';
import HomeImg from '../Assets/Home.png';
const HomePage = () => {
    return (
        <div className="homepage-container-main">
            {/* New Parent Div */}
            <div className="background-container">
                <div className='Intro-container'>
                    
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
            
                  
                            <img src={HomeImg} alt="" />
                 
           
                </div>    
                </div>
                {/* InfoSection now inside the background container */}
                <InfoSection />
        
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

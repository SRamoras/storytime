import React from 'react';
import './HomePage.css';
import BlackButton from '../components/BlackButton';    
import ScrollToTopButton from '../components/ScrollToTopButton';
import InfoSection from '../components/InfoSection';
import WalletComponent from '../components/WalletComponent';
import TabletComponent from '../components/TabletComponent';
import ReviewCard from '../components/ReviewCard';

const HomePage = () => {
    return (
        <div className="homepage-container-main">
            {/* New Parent Div */}
            <div className="background-container">
                <div className='Intro-container'>
                    <div className="text-section">
                        <h1>Explore <br />diverse stories</h1>
                        <p>Discover captivating stories and connect with others.</p>
                        <BlackButton text="Get started" to="/login" />
                    </div>
                    <div className="image-section">
                        <div className="image-wrapper">
                            {/* Your image or content */}
                        </div>
                    </div>
                </div>
                {/* InfoSection now inside the background container */}
                <InfoSection />
            </div>
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

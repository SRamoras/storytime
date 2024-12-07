import React from 'react';
import './LoomFeatureComponent.css';
import { Link } from 'react-router-dom';  
import ler2 from '../assets/ler5.png'; // Update this if you have a more relevant image

const StoryHubFeatureComponent = ({ id }) => {
  return (
    <div id={id} className="main-storyhub-container">
        
        
        <div className='subtitle-section-container'>
        
        <h1 className='subtitle-main-section'>Unleash Your Creativity.</h1></div>
    <div className="storyhub-container">
        
      <div className="storyhub-content">
        {/* Image Container */}
        <div className="text-container">
          <h1>Unleash Your Creativity with StoryHub.</h1>
          <p>
          Step into a world where your imagination comes to life. With StoryHub, you have the power to turn your ideas into masterpieces. Whether you're a budding writer or a seasoned storyteller, our cutting-edge tools are here to guide you every step of the way. From immersive novels to engaging screenplays, StoryHub empowers you to create stories that captivate and connect. Start your journey today and transform your passion for storytelling into unforgettable experiences.
          </p>
          <Link to="/login">
          <button className="try-storyhub-button">Try StoryHub</button>
          </Link>
        </div> <div className="image-container">
          <img src={ler2} alt="Story Creation" />
        </div>

        {/* Text Container */}
       
      </div>
    </div></div>
  );
};

export default StoryHubFeatureComponent;

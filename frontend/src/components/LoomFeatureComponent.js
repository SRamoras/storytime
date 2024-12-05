import React from 'react';
import './LoomFeatureComponent.css';
import { Link } from 'react-router-dom';  
import ler2 from '../Assets/ler2.png'; // Update this if you have a more relevant image

const StoryHubFeatureComponent = ({ id }) => {
  return (
    <div id={id} className="main-storyhub-container">
        
        
        <div className='subtitle-section-container'>
        
        <h1 className='subtitle-main-section'>Create Amazing Stories</h1></div>
    <div className="storyhub-container">
        
      <div className="storyhub-content">
        {/* Image Container */}
        <div className="image-container">
          <img src={ler2} alt="Story Creation" />
        </div>

        {/* Text Container */}
        <div className="text-container">
          <h1>Create Amazing Stories with StoryHub. </h1>
          <p>
            Transform your ideas into captivating narratives with StoryHub's intelligent tools. Whether you're drafting a novel, scripting a screenplay, or crafting engaging content, StoryHub AI streamlines the creative process, allowing you to focus on what truly matters: telling unforgettable stories.
          </p>
          <Link to="/login">
          <button className="try-storyhub-button">Try StoryHub</button>
          </Link>
        </div>
      </div>
    </div></div>
  );
};

export default StoryHubFeatureComponent;

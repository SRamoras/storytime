import React from 'react';
import './InfoSection.css';
import YourImage from '../Assets/ler.png'; // Ensure the path is correct

const InfoSection = ({ id }) => {
  return (
    <section id={id} className="info-section">
      <h1 className='subtitle-main-section'>What we have to offer</h1>
      <div className="info-columns">
        {/* Left Column */}
        <div className="info-left">
          <div className="flex-container">
            {/* First Container */}
            <div className="first-container">
              <div className="info-item">
                <h4>Discover Endless Stories.</h4>
                <p>
                  Immerse yourself in a world of creativity. From heartwarming romances to thrilling adventures, our platform is your gateway to endless storytelling.
                </p>
                <div className="info-stats">
                  <div className="time-class number-text">
                    <h2>100K+</h2>
                    <p>stories shared by users worldwide</p>
                  </div>
                  <div className="time-class number-text2">
                    <h2>24/7</h2>
                    <p>access to your favorite genres</p>
                  </div>
                </div>
              </div>
              <div className="info-center">
                <h1>
                  Your story. <br />
                  Your imagination.
                </h1>
              </div>
            </div>

            {/* Second Container */}
            <div className="sec-container-component">
              <div className="info-item">
                <h4>Connect with Authors.</h4>
                <p>Join a community of passionate storytellers and readers.</p>
              </div>
              <div className="info-item">
                <h4>Share Your Creativity.</h4>
                <p>Write your own stories and inspire others with your imagination.</p>
              </div>
              <div className="info-item">
                <h4>Explore New Genres.</h4>
                <p>From fantasy to biographies, there’s something for everyone.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="info-right">
          <img src={YourImage} alt="Reading illustration" className="info-image" />
        </div>
      </div>
    </section>
  );
};

export default InfoSection;

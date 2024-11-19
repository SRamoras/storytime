import React from 'react';
import './InfoSection.css';

const InfoSection = () => {
  return (
    <section className="info-section">
      <div className="info-columns">
        {/* Coluna da esquerda */}
        <div className="info-left">
          <div className="info-item">
            <h4>Discover Endless Stories.</h4>
            <p>
              Immerse yourself in a world of creativity. From heartwarming romances to thrilling adventures, our platform is your gateway to endless storytelling.
            </p>
            <span className="highlight">Highlights</span>
            <div className="info-stats">
              <div className="time-class">
                <h2>100K+</h2>
                <p>stories shared by users worldwide</p>
              </div>
              <div className="time-class">
                <h2>24/7</h2>
                <p>access to your favorite genres</p>
              </div>
            </div>
          </div>
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

        {/* Coluna da direita */}
        <div className="info-right">
          <h2>
            A platform <br />
            designed to <br />
            unleash creativity.
          </h2>
          <p>
            With tools to help writers and a vast library for readers, our platform is the ultimate destination for storytelling enthusiasts. Share your journey, connect with a global audience, and make your mark in the world of stories.
          </p>
        </div>
      </div>

      {/* Texto centralizado */}
      <div className="info-center">
        <h1>
          Your story. <br />
          Your imagination.
   
        </h1>
      </div>
    </section>
  );
};

export default InfoSection;

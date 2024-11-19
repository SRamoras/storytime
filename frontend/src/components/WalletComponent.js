import React from 'react';
import './WalletComponent.css';

const WalletComponent = () => {
  return (
    <section className="wallet-container">
      <div className="container-sec-wallet">
        <div className="wallet-header">
        <h2>The magic of stories.<br />All in one place.</h2>
        </div>
        <div className="wallet-features">
          <div className="wallet-feature green">
          <h3>Explore Endless Worlds</h3>
          <p>Discover a universe of stories crafted by creators around the globe.</p>
          </div>
          <div className="wallet-feature white">
          <h3>Share Your Creativity</h3>
          <p>Bring your imagination to life by publishing your own stories.</p>
          </div>
          <div className="wallet-feature gradient">
          <h3>Connect With<br />Other Dreamers </h3>
          <p>Join a vibrant community of readers and writers who inspire each other.</p>
          </div>
          <div className="wallet-feature white">
          <h3>Your Journey,<br />Your Stories</h3>
          <p>Whether you read or write, the story is yours to tell.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletComponent;

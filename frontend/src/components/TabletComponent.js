import React from "react";
import "./TabletComponent.css";

const TabletComponent = () => {
  return (
    <section className="tablet-container">
      {/* Primeira coluna */}
      <div className="tablet-left">
        <h3 className="tablet-heading">The magic <br />of storytelling.</h3>
        <p className="tablet-subtext">
          Dive into a world of imagination, one story at a time.
        </p>
      </div>

      {/* Segunda coluna */}
      <div className="tablet-right">
        <p className="tablet-feature gradient-text" style={{ transform: "translateY(-0)" }}>
          Connect with every genre imaginable.
        </p>  <p className="tablet-feature gradient-text" style={{ transform: "translateY(0)" }}>
          Explore  heartwarming romances.
        </p>
        <p className="tablet-feature gradient-text" style={{ transform: "translateY(-0)" }}>
          Discover thrilling adventures.
        </p>
      
        <p className="tablet-feature gradient-text" style={{ transform: "translateY(-0)" }}>
          Immerse in fantastical worlds.
        </p>
       
         <p className="tablet-feature gradient-text" style={{ transform: "translateY(-0)" }}>
          Learn from 
          inspiring biographies.
        </p>
      </div>
    </section>
  );
};

export default TabletComponent;

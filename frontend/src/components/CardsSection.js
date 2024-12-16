

import React from 'react';
import './CardsSection.css';
import storytellingImage1 from '../assets/ler4.png'; 
import storytellingImage2 from '../assets/ler3.png'; 


import { FaBook, FaUsers, FaPalette, FaBell, FaPen, FaShareAlt } from 'react-icons/fa';

const items = [
  
  { 
    id: 1, 
    type: 'image', 
    src: storytellingImage1, 
    alt: 'Storytelling Image 1', 
    area: 'image1' 
  },
  { 
    id: 2, 
    type: 'card', 
    title: "Explore New Worlds", 
    description: "Dive into an expansive library of stories and discover new favorites crafted by talented writers from around the globe.", 
    icon: <FaBook />,
    area: 'card2' 
  },
  { 
    id: 3, 
    type: 'card', 
    title: "Join a Community", 
    description: "Connect with fellow readers and writers. Share feedback, discuss plot twists, and become part of a vibrant storytelling community.", 
    icon: <FaUsers />,
    area: 'card3' 
  },
  { 
    id: 4, 
    type: 'card', 
    title: "Customize Your Experience", 
    description: "Personalize your reading journey with custom themes, fonts, and layouts to suit your preferences.", 
    icon: <FaPalette />,
    area: 'card4' 
  },
  { 
    id: 5, 
    type: 'card', 
    title: "Stay Updated", 
    description: "Follow your favorite authors and get notified when they release new chapters or stories.", 
    icon: <FaBell />,
    area: 'card5' 
  },
  { 
    id: 6, 
    type: 'card', 
    title: "Write Effortlessly", 
    description: "Our intuitive writing tools help you focus on your story, offering a seamless writing experience.", 
    date: "February 22, 2024",
    icon: <FaPen />,
    area: 'card6' 
  },
  
  { 
    id: 7, 
    type: 'image', 
    src: storytellingImage2, 
    alt: 'Storytelling Image 2', 
    area: 'image2' 
  }
];

const Card = ({ title, description, date, icon, area, id }) => (
  <div className="card" style={{ gridArea: area }} id={id}>
    <div className="card-header">
      {date ? (
        <span className="card-date">{date}</span>
      ) : (
        <span className="card-date empty-date"></span>
      )}
      <h3>{title}</h3>
    </div>
    <p>{description}</p>
    {icon && <span className="card-icon">{icon}</span>}
  </div>
);

const CardsSection = ({ id }) => (
  <div className="cards-section" id={id}>
    <h1 className='subtitle-main-section'>More about us.</h1>
    <div className="cards-container">
      {items.map(item => {
        if (item.type === 'card') {
          return (
            <Card 
              key={item.id} 
              title={item.title} 
              description={item.description} 
              date={item.date}
              icon={item.icon}
              area={item.area}
              id={`card-${item.id}`} 
            />
          );
        } else if (item.type === 'image') {
          return (
            <div key={item.id} className="image-item" style={{ gridArea: item.area }} id={`image-${item.id}`}>
              <img src={item.src} alt={item.alt} />
            </div>
          );
        }
        return null;
      })}
    </div>
  </div>
);

export default CardsSection;

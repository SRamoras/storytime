import React from 'react';
import './ReviewCard.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import perfil1 from '../Assets/person1.jpg';
import perfil2 from '../Assets/person2.jpg';
import perfil3 from '../Assets/person3.jpg';
import perfil4 from '../Assets/person4.jpg';
import perfil6 from '../Assets/person5.jpg';

const reviews = [
  {
    id: 1,
    image: perfil4,
    name: 'John Smith',
    testimonial: 'Excellent service and customer support! From the moment I placed my order, the team was responsive and ensured that all my questions were answered promptly. The product quality exceeded my expectations, and the delivery was swift and secure. I will definitely be returning for future purchases.',
    rating: 5,
    isMerged: false,
    date: 'April 15, 2024',
  },
  {
    id: 2,
    image: perfil2,
    name: 'Emily Johnson',
    testimonial: ' From start to finish, my experience with this platform has been nothing short of phenomenal. The intuitive design and user-friendly interface made navigating and exploring the features an absolute breeze. The team behind this service has clearly put immense thought and effort into every detail, ensuring that even the smallest of needs are met with precision. What truly stood out was the unparalleled quality of the products offered. Each item was crafted to perfection, exuding excellence in every aspect – from the packaging to the intricate details of the product itself. The seamless ordering process was complemented by a lightning-fast delivery, arriving well ahead of schedule and in pristine condition. Moreover, their customer support team deserves special recognition. Not only were they prompt in addressing my queries, but they also went above and beyond to ensure I felt valued as a customer. They provided clear, concise answers and even offered additional tips and advice that enhanced my overall experience.',
   

    
    rating: 5,
    isMerged: true, // Este card será mesclado
    date: 'March 22, 2024',
  },
  {
    id: 3,
    image: perfil3,
    name: 'Sophie Brown',
    testimonial: 'Loved the shopping experience! The website is user-friendly, and the checkout process was seamless. My order arrived on time, and the packaging was impeccable. I appreciate the variety of products available and the competitive pricing. Will definitely recommend to friends and family.',
    rating: 4,
    isMerged: false,
    date: 'May 5, 2024',
  },
  {
    id: 4,
    image: perfil1,
    name: 'Sarah Davis',
    testimonial: 'I recommend it to all my friends. The customer service team went above and beyond to ensure my satisfaction. The products are of high quality and exactly as described. The entire purchasing process was smooth and hassle-free. I am extremely pleased with my experience and will continue to support this company.',
    rating: 5,
    isMerged: false,
    date: 'February 10, 2024',
  },
  {
    id: 6,
    image: perfil6,
    name: 'Kate Wilson',
    testimonial: 'Impeccable and very attentive service. The team was proactive in keeping me informed about my order status and promptly addressed any issues that arose. The products arrived in perfect condition and have been performing exceptionally well. I am thoroughly satisfied and look forward to future transactions.',
    rating: 4,
    isMerged: false,
    date: 'January 28, 2024',
  },
];

const ReviewCard = ({ id }) => {
  // Função para renderizar as estrelas com base na avaliação
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#FFD700" />); // Estrela preenchida
      } else {
        stars.push(<FaRegStar key={i} color="#FFD700" />); // Estrela vazia
      }
    }
    return stars;
  };

  return (
    <div id={id} className="main-review-container">
      <h1 className="subtitle-main-section">Some Reviews</h1>
      <div className="grid-container">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`card card${review.id}`}
            style={review.isMerged ? { gridRow: '1 / span 2' } : {}}
          >
            <div className='container-main-review-content'>
            <div className="card-header-review">
              <img src={review.image} alt={`Profile ${review.id}`} className="profile-pic" />
              <div className="header-info">
                <h3 className="name">{review.name}</h3>
                <span className="date">{review.date}</span>
              </div>
            </div>
            <p className="testimonial">"{review.testimonial}"</p></div>
            <div className="stars">{renderStars(review.rating)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;

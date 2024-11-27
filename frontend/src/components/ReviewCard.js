import React from "react";
import "./ReviewCard.css";
import BlackButton from "./BlackButton";

const ReviewCards = () => {
  const reviews = [
    {
      initials: "EM",
      title: "Absolutely Engaging!",
      stars: 5,
      text: "I can't get enough of this site! The stories are so captivating that I lose track of time every time I visit.",
    },
    {
      initials: "LR",
      title: "A Reader's Paradise",
      stars: 4,
      text: "This platform has reignited my passion for reading. I spend hours here exploring new stories every day.",
    },
  ];


  return (
    <section className="review-cards-container">
      <div className="div-total">
      
        <div className="review-cards">
          <div className="review-card-wrapper left">
            <div className="review-card light">
              <div className="profile-avatar">
                <span>{reviews[0].initials}</span>
              </div>
              <div className="review-content">
                <h3>{reviews[0].title}</h3>
                <div className="stars">
                  {"★".repeat(reviews[0].stars)}
                  {"☆".repeat(5 - reviews[0].stars)}
                </div>
                <p>{reviews[0].text}</p>
              </div>
            </div>
          </div>

          <div className="review-card-wrapper right">
            <div className="review-card dark">
              <div className="profile-avatar">
                <span>{reviews[1].initials}</span>
              </div>
              <div className="review-content">
                <h3>{reviews[1].title}</h3>
                <div className="stars">
                  {"★".repeat(reviews[1].stars)}
                  {"☆".repeat(5 - reviews[1].stars)}
                </div>
                <p>{reviews[1].text}</p>
              </div>
            </div>
          </div>
        </div> <div>
        <h1 className="review-title">What <br />People Say</h1>
        <p className="review-description">
          Read what our users have to say about our product. We're proud to
           have <br />
          helped thousands of people improve their lives and businesses.
          </p>
          <BlackButton text="Review" to="/StorysPage" />
        </div>
      </div>
    </section>
  );
};

export default ReviewCards;

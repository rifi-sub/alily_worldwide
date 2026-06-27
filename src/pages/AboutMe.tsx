import React from 'react';
import './AboutMe.css';
import aboutImg from '../assets/about.jpg';

export const AboutMe: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container about-grid">
        <div className="about-image-wrapper">
          <img 
            src={aboutImg} 
            alt="Goddess A Lilly" 
            className="about-img" 
          />
        </div>
        
        <div className="about-content">
          <h2 className="about-title">The Architect of a Remote Life</h2>
          <p className="about-text">
            My transition from a traditional job to a high-performance remote lifestyle was not a sudden shift, but a deliberate evolution of my identity.
          </p>
          <p className="about-text">
            It all started for me in 2017 - when a 'sub' approached me. This introduced me into the World of Femdom/Findom. I made some income passively, but 3 years later, I started taking it seriously and realised I actually enjoy putting men in their place, and getting paid well to do it!
          </p>
          <p className="about-text">
            From there, the money began to grow - and now I live completely independently and have a life I could only have dreamed of as a child.
          </p>
          <p className="about-text">
            Many women I talk to are intrigued about my lifestyle and how they can get involved, so I'm here to teach you how to use your inner mean girl energy to take control, establish boundaries, and build a highly profitable online business.
          </p>
          <p className="about-text">
            This mentorship is designed to shortcut your learning curve, bypass the common pitfalls, and set you on a direct path to financial freedom and self-mastery.
          </p>
        </div>
      </div>
    </div>
  );
};

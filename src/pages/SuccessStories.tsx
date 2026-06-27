import React from 'react';
import './SuccessStories.css';

export const SuccessStories: React.FC = () => {
  const stories = [
    {
      quote: "The transition from financial uncertainty to absolute financial domination was seamless. Goddess A Lilly didn't just teach me a strategy; she redefined my reality.",
      author: "Alumni 01"
    },
    {
      quote: "Building a remote lifestyle that feels luxurious and effortless. The mentorship provided the structure I needed to thrive while maintaining my creative soul.",
      author: "Alumni 02"
    },
    {
      quote: "Empowerment isn't just about money; it's about the confidence to lead. Goddess A Lilly's mentorship gave me the authority to build my dream life from anywhere.",
      author: "Alumni 03"
    }
  ];

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80', alt: 'Horse riding lifestyle' },
    { url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80', alt: 'Ocean blue waters' },
    { url: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=600&q=80', alt: 'Private flight view' },
    { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80', alt: 'Luxury beachside resort' },
    { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80', alt: 'Jet ski adventure' },
    { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', alt: 'Designer fashion items' },
    { url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80', alt: 'Elegant lunch in Monaco' },
    { url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80', alt: 'Independent entrepreneur selfie' }
  ];

  return (
    <div className="stories-page">
      <div className="container">
        <h2 className="stories-title">Mentee Results</h2>
        
        <div className="stories-list">
          {stories.map((story, idx) => (
            <div key={idx} className="story-item">
              <p className="story-quote">"{story.quote}"</p>
              <div className="story-author">{story.author}</div>
            </div>
          ))}
        </div>

        <section className="gallery-section">
          <h2 className="gallery-title">The Lifestyle Achieved</h2>
          
          <div className="gallery-grid">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="gallery-card">
                <img 
                  src={img.url} 
                  alt={img.alt} 
                  className="gallery-img" 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

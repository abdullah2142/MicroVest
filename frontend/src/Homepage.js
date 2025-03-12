import React from 'react';
import './Homepage.css'; // Import your CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Empowering Small Businesses and Investors</h1>
        <p>Join MicroVest to invest in promising startups or pitch your business idea to potential investors.</p>
        <div className="cta-buttons">
          <button className="cta-button">Start Investing</button>
          <button className="cta-button">Pitch Your Business</button>
        </div>
      </div>

      {/* Featured Businesses Section */}
      <div className="featured-businesses">
        <h2>Featured Businesses</h2>
        <div className="business-list">
          <div className="business-card">
            <h3>Business Name 1</h3>
            <p>Funding Goal: $30,000</p>
            <p>Equity Offered: 20%</p>
            <button className="invest-button">Invest Now</button>
          </div>
          <div className="business-card">
            <h3>Business Name 2</h3>
            <p>Funding Goal: $50,000</p>
            <p>Equity Offered: 15%</p>
            <button className="invest-button">Invest Now</button>
          </div>
          {/* Add more business cards as needed */}
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="success-stories">
        <h2>Success Stories</h2>
        <div className="story-list">
          <div className="story-card">
            <h3>Business Name A</h3>
            <p>Raised $50,000 and scaled to 3 new locations!</p>
          </div>
          <div className="story-card">
            <h3>Business Name B</h3>
            <p>Secured $30,000 and doubled their revenue in 6 months!</p>
          </div>
          {/* Add more success stories as needed */}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>$1,000,000+</h3>
            <p>Total Funds Raised</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Successful Projects</p>
          </div>
          <div className="stat-card">
            <h3>200+</h3>
            <p>Happy Investors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
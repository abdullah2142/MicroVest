import React from 'react';

const HomePage = () => {
  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="bg-light text-center py-5">
        <h1 className="display-4">Empowering Small Businesses and Investors</h1>
        <p className="lead">Join MicroVest to invest in promising startups or pitch your business idea to potential investors.</p>
        <div className="mt-4">
          <button className="btn btn-primary btn-lg mx-2">Start Investing</button>
          <button className="btn btn-success btn-lg mx-2">Pitch Your Business</button>
        </div>
      </div>

      {/* Featured Businesses Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Featured Businesses</h2>
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="card-title">Business Name 1</h3>
                <p className="card-text">Funding Goal: $30,000</p>
                <p className="card-text">Equity Offered: 20%</p>
                <button className="btn btn-primary">Invest Now</button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="card-title">Business Name 2</h3>
                <p className="card-text">Funding Goal: $50,000</p>
                <p className="card-text">Equity Offered: 15%</p>
                <button className="btn btn-primary">Invest Now</button>
              </div>
            </div>
          </div>
          {/* Add more business cards as needed */}
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Success Stories</h2>
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Business Name A</h3>
                  <p className="card-text">Raised $50,000 and scaled to 3 new locations!</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Business Name B</h3>
                  <p className="card-text">Secured $30,000 and doubled their revenue in 6 months!</p>
                </div>
              </div>
            </div>
            {/* Add more success stories as needed */}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Our Impact</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">$1,000,000+</h3>
                <p className="card-text">Total Funds Raised</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">50+</h3>
                <p className="card-text">Successful Projects</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">200+</h3>
                <p className="card-text">Happy Investors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
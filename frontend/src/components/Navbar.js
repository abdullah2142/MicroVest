import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isLoggedIn, userRole, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MicroVest</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/browse-businesses">Browse Businesses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/how-it-works">How It Works</Link>
            </li>
            {isLoggedIn && userRole === 'investor' && (
              <li className="nav-item">
                <Link className="nav-link" to="/investor-dashboard">Investor Dashboard</Link>
              </li>
            )}
            {isLoggedIn && userRole === 'entrepreneur' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/entrepreneur-dashboard">Entrepreneur Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/find-consultant">Find Consultant</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="fa-lg" /> {/* Profile icon */}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/user-profile">Profile</Link>
                  </li>
                  {userRole === 'investor' && (
                    <li>
                      <Link className="dropdown-item" to="/investor-dashboard">Investor Dashboard</Link>
                    </li>
                  )}
                  {userRole === 'entrepreneur' && (
                    <li>
                      <Link className="dropdown-item" to="/entrepreneur-dashboard">Entrepreneur Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
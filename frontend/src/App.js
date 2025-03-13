import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BrowseBusinessesPage from './pages/BrowseBusinessesPage';
import InvestorDashboardPage from './pages/InvestorDashboardPage';
import EntrepreneurDashboardPage from './pages/EntrepreneurDashboardPage';
import FindConsultantPage from './pages/FindConsultantPage';
import UserProfilePage from './pages/UserProfilePage';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const [userRole, setUserRole] = useState(''); // Simulate user role (investor/entrepreneur)

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse-businesses" element={<BrowseBusinessesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/investor-dashboard" element={<InvestorDashboardPage />} />
        <Route path="/entrepreneur-dashboard" element={<EntrepreneurDashboardPage />} />
        <Route path="/find-consultant" element={<FindConsultantPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
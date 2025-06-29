import { Routes, Route } from 'react-router-dom'
// import { useState } from 'react'
import './App.css'

import BlossomLanding from './pages/Landing_page/landingPage'
import LoginPage from './pages/Login_page/loginPage'
import SignupPage from './pages/Signup_page/signupPage'

import Dashboard from './pages/Dashboard_page/dashboard'
import ProfilePage from './pages/Profile/profile'

// Business Pages
import CataloguePage from './pages/BusinessPages/CataloguePage'
import BusinessDetailPage from './pages/BusinessPages/BusinessDetailPage'
import BusinessPitchPage from './pages/BusinessPages/BusinessPitchPage'
import MyBusinessesPage from './pages/Dashboard_page/myBusinessesPage'
import CreateLogPage from './pages/BusinessPages/CreateLogPage'
import BusinessLogsPage from './pages/BusinessPages/BusinessLogsPage'
import FundStatisticsPage from './pages/BusinessPages/FundStatisticsPage'
import ProfitDistributionsDashboard from './pages/BusinessPages/ProfitDistributionsDashboard'

// Documentation
import DocumentationPage from './pages/Documentation_logs/DocumentationPage'

// Messaging
import MessagingPage from './pages/MessagingPage'

// Consultants
import ConsultantsPage from './pages/ConsultantsPage'

// Layout
import MainLayout from './components/MainLayout'
import AddFund from './pages/addfunds'

function App() {

  return (
    <Routes>
      {/* Routes without the main navbar */}
      <Route path='/' element={<BlossomLanding />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      {/* Routes with the main navbar */}
      <Route element={<MainLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/catalogue' element={<CataloguePage />} />
        <Route path='/business/:id' element={<BusinessDetailPage />} />
        <Route path='/pitch' element={<BusinessPitchPage />} />
        <Route path='/my-businesses' element={<MyBusinessesPage />} />
        <Route path='/edit-business/:id' element={<BusinessPitchPage editMode={true} />} />
        <Route path='/documentation' element={<DocumentationPage />} />
        <Route path='/messages' element={<MessagingPage />} />
        <Route path='/businesses/:id/logs/create' element={<CreateLogPage />} />
        <Route path='/businesses/:id/logs' element={<BusinessLogsPage />} />
        <Route path='/business/:businessId/fund-statistics' element={<FundStatisticsPage />} />
        <Route path='/profit-distributions' element={<ProfitDistributionsDashboard />} />
        <Route path='/consultants' element={<ConsultantsPage />} />
        <Route path="/add-funds" element={<AddFund />} />
      </Route>
    </Routes>
  )
}

export default App

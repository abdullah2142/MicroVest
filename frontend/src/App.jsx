import { Route, Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import SignUpPage from './pages/Sign up/sign-up-page';
import ConsultantPage from './pages/ConsultantPage/consultant-page';
import MessagingPage from './pages/MessagingPage/messaging-page';
import SignInPage from './pages/Log in/sign-in-page';
import CataloguePage from './pages/BusinessPages/CataloguePage';
import BusinessDetailPage from './pages/BusinessPages/BusinessDetailPage';
import BusinessPitchPage from './pages/BusinessPages/BusinessPitchPage';
import EntrepreneurDashboard from './pages/Dashboard/EntrepreneurDashboard';
import InvestorDashboard from './pages/Dashboard/InvestorDashboard';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/login' element={<SignInPage />} />
      <Route path='/consultant' element={<ConsultantPage />} />
      <Route path='/messaging' element={<MessagingPage />} />
      <Route path='/catalogue' element={<CataloguePage />} />
      <Route path='/business-detail/' element={<BusinessDetailPage />} />
      <Route path='/business-pitch' element={<BusinessPitchPage />} />
      <Route path='/entrepreneur-dashboard' element={<EntrepreneurDashboard />} />
      <Route path='/investor-dashboard' element={<InvestorDashboard />} />
    </Routes>
  )
}

export default App;

"use client"

import { useState, useEffect } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import EntrepreneurDashboard from './entrepreneurDash'
import InvestorDashboard from './investorDash'
import EntrepreneurProfileForm from '../../components/EntrepreneurProfileForm'

import {
  BarChart3,
  DollarSign,
  TrendingUp,
  User,
  Wallet,
  Building2,
  Target,
  ArrowUpRight,
  Settings,
  Home,
  Briefcase,
  LogOut
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, Tooltip } from "recharts"

import Footer from '../../components/footer';

// Define user state interface
interface UserState {
  isAuthenticated: boolean;
  authToken: string | null;
  userType: 'investor' | 'entrepreneur' | null;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface EntrepreneurMetrics {
  total_businesses_created: number;
  total_funding_raised: number;
  total_investors: number;
  total_profit_generated: number;
  success_rate: number;
  average_investment_size: number;
  annual_revenue: number;
  total_assets: number;
}

// Sample data (keep as is)
const investmentData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 2400 },
  { month: "Apr", value: 3200 },
  { month: "May", value: 2800 },
  { month: "Jun", value: 3600 },
]

const ventureData = [
  { month: "Jan", revenue: 5000, expenses: 3000 },
  { month: "Feb", revenue: 7500, expenses: 4200 },
  { month: "Mar", revenue: 9200, expenses: 5100 },
  { month: "Apr", revenue: 11800, expenses: 6300 },
  { month: "May", revenue: 10500, expenses: 5800 },
  { month: "Jun", revenue: 14200, expenses: 7200 },
]

const portfolioData = [
  { name: "Tech Startups", value: 45, color: "#10b981" },
  { name: "Healthcare", value: 25, color: "#3b82f6" },
  { name: "Fintech", value: 20, color: "#8b5cf6" },
  { name: "E-commerce", value: 10, color: "#f59e0b" },
]

type ActiveSection = "overview" | "investments" | "analytics" | "profile"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [user, setUser] = useState<UserState>({
    isAuthenticated: false,
    authToken: null,
    userType: null,
    username: null,
    email: null,
    first_name: null,
    last_name: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [entrepreneurMetrics, setEntrepreneurMetrics] = useState<EntrepreneurMetrics | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken');
    const storedUserType = localStorage.getItem('userType') as 'investor' | 'entrepreneur' | null;
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedFirstName = localStorage.getItem('first_name');
    const storedLastName = localStorage.getItem('last_name');

    console.log('Dashboard: Checking localStorage:', {
      storedAuthToken,
      storedUserType,
      storedUsername,
      storedEmail,
      storedFirstName,
      storedLastName
    });

    if (storedAuthToken && storedUsername) {
      console.log('Dashboard: Setting user as authenticated');
      setUser({
        isAuthenticated: true,
        authToken: storedAuthToken,
        userType: storedUserType || 'investor',
        username: storedUsername,
        email: storedEmail || '',
        first_name: storedFirstName || '',
        last_name: storedLastName || '',
      });
    } else {
      console.log('Dashboard: Missing required data, user not authenticated');
    }
    
    setIsLoading(false);
  }, []);

  // Fetch entrepreneur metrics when user is entrepreneur
  useEffect(() => {
    const fetchEntrepreneurMetrics = async () => {
      if (user.userType === 'entrepreneur' && user.authToken) {
        try {
          const response = await fetch('http://localhost:8000/api/entrepreneur/metrics/', {
            headers: {
              'Authorization': `Bearer ${user.authToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setEntrepreneurMetrics(data);
          }
        } catch (error) {
          console.error('Error fetching entrepreneur metrics:', error);
        }
      }
    };

    fetchEntrepreneurMetrics();
  }, [user.userType, user.authToken]);

  const userType = user.userType || "investor";

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('prof_pic');

    // Reset user state
    setUser({
      isAuthenticated: false,
      authToken: null,
      userType: null,
      username: null,
      email: null,
      first_name: null,
      last_name: null,
    });

    navigate('/login');
  };

  const handleLoginNav = () => {
    navigate('/login');
  };

  const handleSignUpNav = () => {
    navigate('/signup');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleProfileUpdate = (updatedData: EntrepreneurMetrics) => {
    setEntrepreneurMetrics(updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is not authenticated
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render appropriate dashboard based on user type
  if (user.userType === 'investor') {
    return <InvestorDashboard />;
  } else if (user.userType === 'entrepreneur') {
    return <EntrepreneurDashboard />;
  }

  // Fallback for unknown user types
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">Invalid user type. Please contact support.</p>
        <button 
          onClick={handleLogout} 
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
// frontend/src/pages/InvestorDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  DollarSign,
  Eye,
  Settings,
  TrendingUp,
  Users,
  Building,
  BarChart3,
  Plus,
  Wallet,
  Target,
  ArrowUpRight,
  Briefcase,
  User,
  LogOut,
  Landmark,
  Coins,
  Banknote
} from "lucide-react"
import { useUser } from "../../context/UserContext";

// Interface for individual recent investment
interface RecentInvestment {
  id: number; // Assuming each investment has an ID
  business_name: string;
  category_name: string;
  amount_invested: number;
  investment_date: string; // Or Date if you parse it
  entrepreneur_name: string; // Name of the entrepreneur associated with the business
}

// Interface for combined user and investor data
interface UserData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  fund?: number; // From CustomUser
  prof_pic?: string; // From CustomUser
  total_investments_count?: number; // From InvestorProfile
  total_money_invested?: number; // From InvestorProfile
}

interface DashboardStats {
  total_invested: number;
  total_returns: number;
  active_investments: number;
  portfolio_value: number;
}

function Sidebar({ active = "Overview", onAddFundsClick }: { active?: string; onAddFundsClick: () => void }) {
  const navigate = useNavigate();

  const nav = [
    { label: "Overview", icon: Home, action: () => navigate('/dashboard') }, // Navigating to /dashboard for overview
    { label: "Add Funds", icon: DollarSign, action: onAddFundsClick },
    // { label: "View Details", icon: Eye, action: () => navigate('/investment-details') },
    { label: "Settings", icon: Settings, action: () => navigate('/profile') },
  ];

  return (
    <aside className="hidden md:flex flex-col w-80 min-h-full bg-white py-8 px-6 gap-3 shadow-[2px_0_20px_rgba(0,0,0,0.08)]">
      {nav.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className={`flex items-center gap-4 px-5 py-3 rounded-xl text-base font-medium transition-colors ${
            active === item.label
              ? "bg-gray-100 text-black"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <item.icon className="w-6 h-6" />
          {item.label}
        </button>
      ))}
    </aside>
  );
}

export default function InvestorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // State for profile picture URL
  const [recentInvestments, setRecentInvestments] = useState<RecentInvestment[]>([]);
  const { openAddFundsModal } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          // Redirect to login if no token
          navigate("/login");
          return; // Stop execution
        }

        let fetchedUserData: UserData = {
          username: "User",
          first_name: "",
          last_name: "",
          email: "",
          user_type: "investor",
          fund: 0,
          total_investments_count: 0,
          total_money_invested: 0,
        };

        // --- 1. Fetch User Profile Data (for username, first_name, fund, prof_pic) ---
        try {
          const profileResponse = await fetch("http://localhost:8000/api/users/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (profileResponse.ok) {
            const data = await profileResponse.json();
            fetchedUserData = {
              ...fetchedUserData, // Start with current defaults/fallbacks
              username: data.username || fetchedUserData.username,
              first_name: data.first_name || fetchedUserData.first_name,
              last_name: data.last_name || fetchedUserData.last_name,
              email: data.email || fetchedUserData.email,
              user_type: data.user_type || fetchedUserData.user_type,
              // Ensure fund is parsed as float, handle Decimal from Django (which often comes as string)
              fund: data.fund !== undefined && data.fund !== null ? parseFloat(data.fund) : fetchedUserData.fund,
              prof_pic: data.prof_pic || fetchedUserData.prof_pic,
            };

            // Update profile picture state and localStorage
            if (fetchedUserData.prof_pic) {
                setProfilePicture(fetchedUserData.prof_pic);
                localStorage.setItem('prof_pic', fetchedUserData.prof_pic);
            } else if (localStorage.getItem('prof_pic')) {
                setProfilePicture(localStorage.getItem('prof_pic'));
            }

          } else {
            console.warn(
              `Failed to fetch user profile: ${profileResponse.statusText}. Using fallback data.`
            );
            // Fallback to localStorage if API call fails
            fetchedUserData = {
              username: localStorage.getItem("username") || "User",
              first_name: localStorage.getItem("first_name") || "",
              last_name: localStorage.getItem("last_name") || "",
              email: localStorage.getItem("email") || "",
              user_type: localStorage.getItem("userType") || "investor",
              fund: parseFloat(localStorage.getItem("userFund") || "0"),
              total_investments_count: 0, // Ensure these are reset on profile fetch failure
              total_money_invested: 0,
            };
            if (localStorage.getItem('prof_pic')) {
                setProfilePicture(localStorage.getItem('prof_pic'));
            }
          }
        } catch (profileError) {
          console.error("Error fetching user profile data:", profileError);
          // Fallback if network error or malformed JSON
          fetchedUserData = {
            username: localStorage.getItem("username") || "User",
            first_name: localStorage.getItem("first_name") || "",
            last_name: localStorage.getItem("last_name") || "",
            email: localStorage.getItem("email") || "",
            user_type: localStorage.getItem("userType") || "investor",
            fund: parseFloat(localStorage.getItem("userFund") || "0"),
            total_investments_count: 0,
            total_money_invested: 0,
          };
          if (localStorage.getItem('prof_pic')) {
                setProfilePicture(localStorage.getItem('prof_pic'));
            }
        }

        // --- 2. Fetch Investor Profile Data (for total_investments_count, total_money_invested) ---
        // This is where investor-specific aggregated data comes from
        try {
          const investorProfileResponse = await fetch(
            "http://localhost:8000/api/investors/profile/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (investorProfileResponse.ok) {
            const data = await investorProfileResponse.json();
            // Merge investor-specific data into fetchedUserData
            fetchedUserData.total_investments_count =
              data.total_investments_count !== undefined && data.total_investments_count !== null
                ? data.total_investments_count
                : fetchedUserData.total_investments_count;
            fetchedUserData.total_money_invested =
              data.total_money_invested !== undefined && data.total_money_invested !== null
                ? parseFloat(data.total_money_invested) // Parse as float
                : fetchedUserData.total_money_invested;
          } else {
            console.warn(
              "Could not fetch investor profile data. Using default/mock values."
            );
            // Fallback for investor profile specific stats if API fails
            fetchedUserData.total_investments_count = 0;
            fetchedUserData.total_money_invested = 0;
          }
        } catch (investorError) {
          console.error("Error fetching investor profile data:", investorError);
          // Fallback for investor profile specific stats on network/parse error
          fetchedUserData.total_investments_count = 0;
          fetchedUserData.total_money_invested = 0;
        }

        // --- 3. Fetch Recent Investments ---
        try {
          const recentInvestmentsResponse = await fetch(
            "http://localhost:8000/api/investments-tracking/recent-investments/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (recentInvestmentsResponse.ok) {
            const data: RecentInvestment[] = await recentInvestmentsResponse.json();
            setRecentInvestments(data);
          } else {
            console.warn("Could not fetch recent investments. Using empty array.");
            setRecentInvestments([]);
          }
        } catch (investmentsError) {
          console.error("Error fetching recent investments:", investmentsError);
          setRecentInvestments([]);
        }

        // Set the combined user data to state
        setUserData(fetchedUserData);
      } catch (err) {
        console.error("Main error in fetchDashboardData:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); // navigate is in dependency array as it's used inside useEffect

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || isNaN(amount)) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    if (isNaN(value)) return "0%";
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar active="Overview" onAddFundsClick={() => openAddFundsModal()} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row lg:gap-8 p-6 lg:p-8">
          {/* Center Main Area */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4"> 
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex gap-4">
                <button onClick={() => navigate('/my-investments')} className="bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-gray-200 transition">View My Investments</button>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 mb-10">
              <div className="flex items-center gap-6">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userData?.first_name?.charAt(0) || userData?.username?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {userData?.first_name || userData?.username}!
                  </h2>
                  <p className="text-gray-600">Here's your investment portfolio overview</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {/* Total no of investments */}
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Landmark className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total No. of Investments</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {userData?.total_investments_count || 0}
                </div>
                <div className="text-sm text-gray-600">Businesses invested in</div>
              </div>

              {/* Total money invested */}
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Coins className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Money Invested</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(userData?.total_money_invested)}
                </div>
                <div className="text-sm text-gray-600">Sum across all investments</div>
              </div>

              {/* Current fund */}
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Banknote className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Current Fund</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(userData?.fund)}
                </div>
                <div className="text-sm text-gray-600">Your available balance</div>
              </div>
            </div>

            {/* Recent Investments Table */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Investments (Business & Amount)</h3>
                <button
                  onClick={() => navigate("/my-investments")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Business</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount Invested</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Entrepreneur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvestments.length > 0 ? (
                      recentInvestments.map((investment) => (
                        <tr
                          key={investment.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">
                              {investment.business_name}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${
                                investment.category_name === "Technology"
                                  ? "bg-blue-100 text-blue-800"
                                  : investment.category_name === "Healthcare"
                                  ? "bg-green-100 text-green-800"
                                  : investment.category_name === "Agriculture"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800" // Default color
                              }`}
                            >
                              {investment.category_name}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-900">
                            {formatCurrency(investment.amount_invested)}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {new Date(investment.investment_date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {investment.entrepreneur_name}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 px-6 text-center text-gray-500">
                          No recent investments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Portfolio Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Portfolio Diversity by Business Category
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Technology</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-24 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Healthcare</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Finance</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-20 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Agriculture</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div className="w-10 h-2 bg-orange-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">10%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Investment Size</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        userData?.total_money_invested && userData.total_investments_count
                          ? userData.total_money_invested / userData.total_investments_count
                          : 0
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Investments</span>
                    <span className="font-semibold text-gray-900">
                      {userData?.total_investments_count || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Portfolio Companies</span>
                    <span className="font-semibold text-gray-900">
                      {userData?.total_investments_count || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-semibold text-gray-900">{formatPercentage(15)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
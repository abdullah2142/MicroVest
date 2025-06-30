"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Landmark,
  Coins,
  Banknote,
  BookOpen,
} from "lucide-react"
import { useUser } from "../../context/UserContext";
import Sidebar from "../../components/Sidebar"; // Import the new Sidebar component

// Interface for individual recent investment
interface RecentInvestment {
  id: number;
  business_id: number;
  business_name: string;
  category_name: string;
  amount_invested: number;
  investment_date: string;
  entrepreneur_name: string;
  share_percentage: number;
}

// Interface for combined user and investor data
interface UserData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  fund?: number;
  prof_pic?: string;
  total_investments_count?: number;
  total_money_invested?: number;
}

interface DashboardStats {
  total_invested: number;
  total_returns: number;
  active_investments: number;
  portfolio_value: number;
}

// Blog Post Interface
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  link: string;
}

// Blog Card Component
const BlogCard: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] overflow-hidden">
      <img src={blog.imageUrl} alt={blog.title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <h4 className="font-semibold text-[#2A363B] mb-2 leading-tight">{blog.title}</h4>
        <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{blog.date}</span>
          <a
            href={blog.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#CF4647] hover:text-[#2A363B] font-medium inline-flex items-center"
          >
            Read More <ArrowRight className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Helper function for category colors (now using the palette's accent and primary dark colors)
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Technology': return '#CF4647';
    case 'Healthcare': return '#F5D061';
    case 'Finance': return '#2A363B';
    case 'Agriculture': return '#CF4647';
    default: return '#2A363B';
  }
};


export default function InvestorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [recentInvestments, setRecentInvestments] = useState<RecentInvestment[]>([]);
  const { openAddFundsModal } = useUser();
  const navigate = useNavigate();
  // Removed savedBusinesses state as it's no longer used in Sidebar

  // States for dynamic data
  const [portfolioDiversity, setPortfolioDiversity] = useState<Map<string, { investedAmount: number, percentage: number }>>(new Map());
  const [uniqueBusinessesCount, setUniqueBusinessesCount] = useState<number>(0);


  // Mock Blog Data - UPDATED TO USE LOCAL ASSET PATHS
  const mockBlogs: BlogPost[] = [
    {
      id: 1,
      title: "The Future of Sustainable Investing",
      excerpt: "Explore the growing trends in sustainable investments and how they shape the future of finance.",
      date: "June 25, 2025",
      imageUrl: "/src/assets/1.jpg",
      link: "https://example.com/blog/sustainable-investing"
    },
    {
      id: 2,
      title: "Understanding Venture Capital for Startups",
      excerpt: "A comprehensive guide for startups looking to secure venture capital funding.",
      date: "June 20, 2025",
      imageUrl: "/src/assets/2.jpg",
      link: "https://example.com/blog/venture-capital-startups"
    },
    {
      id: 3,
      title: "Diversifying Your Portfolio with Alternative Assets",
      excerpt: "Learn how alternative assets can enhance your investment portfolio's diversification.",
      date: "June 15, 2025",
      imageUrl: "/src/assets/3.jpg",
      link: "https://example.com/blog/alternative-assets"
    },
  ];


  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
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
              ...fetchedUserData,
              username: data.username || fetchedUserData.username,
              first_name: data.first_name || fetchedUserData.first_name,
              last_name: data.last_name || fetchedUserData.last_name,
              email: data.email || fetchedUserData.email,
              user_type: data.user_type || fetchedUserData.user_type,
              fund: data.fund !== undefined && data.fund !== null ? parseFloat(data.fund) : fetchedUserData.fund,
              prof_pic: data.prof_pic || fetchedUserData.prof_pic,
            };

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
        } catch (profileError) {
          console.error("Error fetching user profile data:", profileError);
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
            
            fetchedUserData.total_investments_count =
              data.total_investments_count !== undefined && data.total_investments_count !== null
                ? data.total_investments_count
                : fetchedUserData.total_investments_count;
            fetchedUserData.total_money_invested =
              data.total_money_invested !== undefined && data.total_money_invested !== null
                ? parseFloat(data.total_money_invested)
                : fetchedUserData.total_money_invested;
          } else {
            console.warn(
              "Could not fetch investor profile data. Using default/mock values."
            );
            fetchedUserData.total_investments_count = 0;
            fetchedUserData.total_money_invested = 0;
          }
        } catch (investorError) {
          console.error("Error fetching investor profile data:", investorError);
          fetchedUserData.total_investments_count = 0;
          fetchedUserData.total_money_invested = 0;
        }

        let fetchedRecentInvestments: RecentInvestment[] = [];
        try {
          const recentInvestmentsResponse = await fetch(
            "http://localhost:8000/api/investments-tracking/investor-recent/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (recentInvestmentsResponse.ok) {
            const data: RecentInvestment[] = await recentInvestmentsResponse.json();
            fetchedRecentInvestments = data;
            setRecentInvestments(fetchedRecentInvestments);
          } else {
            console.warn("Could not fetch recent investments. Using empty array.");
            setRecentInvestments([]);
          }
        } catch (investmentsError) {
          console.error("Error fetching recent investments:", investmentsError);
          setRecentInvestments([]);
        }

        setUserData(fetchedUserData);

        if (fetchedUserData.total_money_invested && fetchedUserData.total_money_invested > 0 && fetchedRecentInvestments.length > 0) {
            const diversityMap = new Map<string, number>();
            fetchedRecentInvestments.forEach(inv => {
                const currentAmount = diversityMap.get(inv.category_name) || 0;
                diversityMap.set(inv.category_name, currentAmount + inv.amount_invested);
            });

            const calculatedDiversity = new Map<string, { investedAmount: number, percentage: number }>();
            diversityMap.forEach((amount, category) => {
                const percentage = (amount / fetchedUserData.total_money_invested!) * 100;
                calculatedDiversity.set(category, { investedAmount: amount, percentage: parseFloat(percentage.toFixed(1)) });
            });
            setPortfolioDiversity(calculatedDiversity);
        } else {
            setPortfolioDiversity(new Map());
        }

        const uniqueBusinessIds = new Set(fetchedRecentInvestments.map(inv => inv.business_id));
        setUniqueBusinessesCount(uniqueBusinessIds.size);


      } catch (err) {
        console.error("Main error in fetchDashboardData:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Removed useEffect for fetching saved businesses as it's no longer needed for the sidebar

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
      <div className="min-h-screen bg-[#F8F6F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A363B] mx-auto mb-4"></div>
          <p className="text-[#2A363B]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F6F6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#CF4647] mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2A363B] text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F6] flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar Component */}
        <Sidebar active="Overview" onAddFundsClick={() => openAddFundsModal()} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row lg:gap-8 p-6 lg:p-8 ml-80">
          {/* Left Column - Existing Dashboard Content */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4"> 
              <h1 className="text-4xl font-bold text-[#2A363B]">Dashboard</h1>
              <div className="flex gap-4">
                <button onClick={() => navigate('/my-investments')} className="bg-[#F8F6F6] text-[#2A363B] px-6 py-3 rounded-full font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-gray-200 transition">View My Investments</button>
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
                  <div className="w-20 h-20 bg-[#2A363B] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userData?.first_name?.charAt(0) || userData?.username?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#2A363B] mb-2">
                    Welcome back, {userData?.first_name || userData?.username}!
                  </h2>
                  <p className="text-gray-600">Here's your investment portfolio overview</p>
                </div>
            </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {/* Total no of investments */}
              <div 
                className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow"
                onClick={() => navigate('/my-investments')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#F8F6F6] rounded-xl">
                    <Landmark className="w-6 h-6 text-[#CF4647]" />
                  </div>
                  <span className="text-sm text-gray-500">Total No. of Investments</span>
                </div>
                <div className="text-3xl font-bold text-[#2A363B] mb-2">
                  {userData?.total_investments_count || 0}
                </div>
                <div className="text-sm text-gray-600">Businesses invested in</div>
              </div>

              {/* Total money invested */}
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#F8F6F6] rounded-xl">
                    <Coins className="w-6 h-6 text-[#F5D061]" />
                  </div>
                  <span className="text-sm text-gray-500">Total Money Invested</span>
                </div>
                <div className="text-3xl font-bold text-[#2A363B] mb-2">
                  {formatCurrency(userData?.total_money_invested)}
                </div>
                <div className="text-sm text-gray-600">Sum across all investments</div>
              </div>

              {/* Current fund */}
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#F8F6F6] rounded-xl">
                    <Banknote className="w-6 h-6 text-[#CF4647]" />
                  </div>
                  <span className="text-sm text-gray-500">Current Fund</span>
                </div>
                <div className="text-3xl font-bold text-[#2A363B] mb-2">
                  {formatCurrency(userData?.fund)}
                </div>
                <div className="text-sm text-gray-600">Your available balance</div>
              </div>
            </div>

            {/* Recent Investments Table */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2A363B]">Recent Investments (Business & Amount)</h3>
                <button
                  onClick={() => navigate("/my-investments")}
                  className="text-[#CF4647] hover:text-[#2A363B] font-medium"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-[#2A363B]">Business</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2A363B]">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2A363B]">Amount Invested</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2A363B]">Share %</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2A363B]">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2A363B]">Entrepreneur</th>
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
                            <div 
                              className="font-medium text-[#2A363B] cursor-pointer hover:text-[#CF4647] hover:underline"
                              onClick={() => navigate(`/business/${investment.business_id}`)}
                            >
                              {investment.business_name}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8F6F6] text-[#2A363B]`}
                            >
                              {investment.category_name}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-[#2A363B]">
                            {formatCurrency(investment.amount_invested)}
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            {formatPercentage(investment.share_percentage)}
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
                        <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
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
                <h3 className="text-xl font-bold text-[#2A363B]">
                  Portfolio Diversity by Business Category
                </h3>
                <div className="space-y-4">
                  {portfolioDiversity.size > 0 ? (
                    Array.from(portfolioDiversity.entries()).map(([category, data]) => (
                      <div className="flex items-center justify-between" key={category}>
                        <span className="text-gray-600">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 rounded-full" style={{ width: `${data.percentage}%`, backgroundColor: getCategoryColor(category) }}></div>
                          </div>
                          <span className="text-sm font-medium text-[#2A363B]">{data.percentage}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No investment data to display diversity.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8">
                <h3 className="text-xl font-bold text-[#2A363B]">Investment Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Investment Size</span>
                    <span className="font-semibold text-[#2A363B]">
                      {formatCurrency(
                        userData?.total_money_invested && userData.total_investments_count && userData.total_investments_count > 0
                          ? userData.total_money_invested / userData.total_investments_count
                          : 0
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Investments</span>
                    <span className="font-semibold text-[#2A363B]">
                      {userData?.total_investments_count || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Portfolio Companies</span>
                    <span className="font-semibold text-[#2A363B]">
                      {uniqueBusinessesCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-semibold text-[#2A363B]">{formatPercentage(15)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column - Blogs & Articles */}
          <aside className="w-full lg:w-96 mt-10 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-[#CF4647]" />
                <h3 className="text-xl font-bold text-[#2A363B]">Blogs & Articles</h3>
              </div>
              <div className="space-y-6">
                {mockBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
              <a
                href="https://medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full text-center text-[#CF4647] hover:text-[#2A363B] font-medium flex items-center justify-center py-2"
              >
                View All Articles <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
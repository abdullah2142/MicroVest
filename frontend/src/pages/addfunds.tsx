// frontend/src/pages/add-fund.tsx (or appropriate path in your frontend structure)
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, ArrowLeft, CheckCircle, XCircle } from "lucide-react"; // Import necessary icons

// You might still want a Sidebar for navigation consistent with your dashboard
// import Sidebar from '../components/Sidebar'; // Assuming Sidebar is now in components folder or adjust path
// 
export default function AddFund() {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  // Basic check for authentication token on component load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login'); 
    }
  }, [navigate]);

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    const fundAmount = parseFloat(amount);

    if (isNaN(fundAmount) || fundAmount <= 0) {
      setMessage({ type: 'error', text: "Please enter a valid positive amount." });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      // Simulate API call for adding funds
      // Replace with your actual backend endpoint
      const response = await fetch('http://localhost:8000/api/users/add_fund/', { // Example endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: fundAmount }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || `Successfully added ${formatCurrency(fundAmount)} to your fund!` });
        // Optionally update the local storage fund value if your API returns the new total
        // localStorage.setItem('userFund', data.new_fund_total.toString()); 
        // Or re-fetch user data on dashboard if you navigate back immediately
        setAmount(""); // Clear the input field
        // Navigate back to dashboard after a short delay for user to read the message
        setTimeout(() => {
          navigate('/dashboard'); 
        }, 2000); 

      } else {
        throw new Error(data.detail || data.error || "Failed to add funds. Please try again.");
      }
    } catch (err: any) {
      console.error("Error adding fund:", err);
      setMessage({ type: 'error', text: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar - Make sure the path is correct based on your project structure */}
        {/* <Sidebar active="Add Funds" />  */}

        <main className="flex-1 p-6 lg:p-8">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                Add Funds to Your Account
              </h2>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Enter the amount you wish to add to your available fund.
            </p>

            <form onSubmit={handleAddFund} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Add (USD)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-2"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
              </div>

              {message && (
                <div 
                  className={`flex items-center gap-2 p-3 rounded-md ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? "Adding Funds..." : "Add Funds"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
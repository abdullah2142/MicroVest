// frontend/src/pages/add-fund.tsx (or appropriate path in your frontend structure)
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, X, CheckCircle, XCircle, CreditCard, Smartphone, Wallet } from "lucide-react";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFundsAdded?: (newAmount: number) => void;
}

type PaymentMethod = 'bkash' | 'debit_card' | 'google_pay';

export default function AddFundsModal({ isOpen, onClose, onFundsAdded }: AddFundsModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const paymentMethods = [
    {
      id: 'bkash' as PaymentMethod,
      name: 'bKash',
      icon: Smartphone,
      description: 'Mobile Banking'
    },
    {
      id: 'debit_card' as PaymentMethod,
      name: 'Debit Card',
      icon: CreditCard,
      description: 'Credit/Debit Card'
    },
    {
      id: 'google_pay' as PaymentMethod,
      name: 'Google Pay',
      icon: Wallet,
      description: 'Digital Wallet'
    }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setSelectedPaymentMethod(null);
      setMessage(null);
    } else {
      // Clean up when modal closes
      setAmount("");
      setSelectedPaymentMethod(null);
      setMessage(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedPaymentMethod) {
      setMessage({ type: 'error', text: "Please select a payment method." });
      return;
    }

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

      const response = await fetch('http://localhost:8000/api/users/add_fund/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          amount: fundAmount,
          payment_method: selectedPaymentMethod 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Successfully added ${formatCurrency(fundAmount)} to your fund using ${paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name}!` 
        });
        
        setAmount("");
        setSelectedPaymentMethod(null);
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-600" />
              Add Funds
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleAddFund} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Add (USD)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-3"
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

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <method.icon className={`w-6 h-6 ${
                      selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className="text-left">
                      <div className={`font-medium ${
                        selectedPaymentMethod === method.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {method.name}
                      </div>
                      <div className={`text-sm ${
                        selectedPaymentMethod === method.id ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {method.description}
                      </div>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Display */}
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

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={loading || !selectedPaymentMethod}
              >
                {loading ? "Adding Funds..." : "Add Funds"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
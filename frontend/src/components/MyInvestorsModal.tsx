import React from 'react';
import { X, Users, DollarSign, Building, Percent, Calendar } from 'lucide-react';

interface Investment {
  business_id: number;
  business_title: string;
  business_category: string;
  amount_invested: number;
  invested_at: string;
  share_percentage: number;
}

interface Investor {
  investor_id: number;
  investor_name: string;
  investor_username: string;
  investor_email: string;
  total_invested_in_my_businesses: number;
  total_businesses_invested_in: number;
  investments: Investment[];
}

interface MyInvestorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investors: Investor[];
  onMessageInvestor: (investorId: number) => void;
}

export default function MyInvestorsModal({ isOpen, onClose, investors, onMessageInvestor }: MyInvestorsModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">My Investors</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {investors.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {investors.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Investors Yet</h3>
              <p className="text-gray-500">When investors start funding your businesses, they'll appear here.</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {investors.map((investor) => (
                <div key={investor.investor_id} className="bg-gray-50 rounded-lg p-6">
                  {/* Investor Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {investor.investor_name}
                      </h3>
                      <p className="text-sm text-gray-500">@{investor.investor_username}</p>
                      <p className="text-sm text-gray-500">{investor.investor_email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Invested</div>
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(investor.total_invested_in_my_businesses)}
                        </div>
                      </div>
                      <button
                        onClick={() => onMessageInvestor(investor.investor_id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Message
                      </button>
                    </div>
                  </div>

                  {/* Investment Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">Businesses</span>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {investor.total_businesses_invested_in}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Total Amount</span>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(investor.total_invested_in_my_businesses)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Percent className="w-4 h-4" />
                        <span className="text-sm">Avg. Share</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {investor.investments.length > 0 
                          ? `${(investor.investments.reduce((sum, inv) => sum + inv.share_percentage, 0) / investor.investments.length).toFixed(1)}%`
                          : '0%'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Investment Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Investment Details</h4>
                    <div className="space-y-3">
                      {investor.investments.map((investment, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-gray-900">
                                {investment.business_title}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {investment.business_category}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(investment.amount_invested)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-600">Share:</span>
                              <span className="font-semibold text-blue-600">
                                {investment.share_percentage}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium text-gray-900">
                                {formatDate(investment.invested_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
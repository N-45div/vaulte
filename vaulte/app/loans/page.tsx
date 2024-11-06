"use client";

import React, { useState } from 'react';

const LoansPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Loan Requests</h2>
            {/* Sample Request Component */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-md space-y-2">
              <p>Merchant Name: John Doe</p>
              <p>Monthly Recurring Revenue (MRR): $500</p>
              <p>Request Amount: $1,000</p>
              <p>Repayment Time: 6 months</p>
              <p>Interest: 5%</p>
              <button className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg">
                Accept
              </button>
            </div>
          </div>
        );

      case 'offers':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Loan Offers</h2>
            {/* Sample Offer Component */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-md space-y-2">
              <p>Investor Name: Alice Smith</p>
              <p>Offer Amount: $1,000</p>
              <p>Repayment Time: 6 months</p>
              <p>Interest: 4%</p>
              <button className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg">
                Accept
              </button>
            </div>
          </div>
        );

      case 'pools':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Pools</h2>
            {/* Sample Pool Component */}
            <div className="p-4 bg-gray-700 rounded-lg shadow-md space-y-2">
              <p>Pool Name: Growth Fund</p>
              <p>Repayment Time: 12 months</p>
              <p>Interest: 3.5%</p>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  placeholder="Amount" 
                  className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white shadow-inner focus:outline-none"
                />
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg">
                  Get
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg">
                  Invest
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Loans Page</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            activeTab === 'requests' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Requests
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            activeTab === 'offers' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Offers
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`px-6 py-3 rounded-full font-semibold transition ${
            activeTab === 'pools' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Pools
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        {renderContent()}
      </div>
    </div>
  );
};

export default LoansPage;

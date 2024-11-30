"use client";

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getMerchantDetails } from '../../utils/AppFetch';
import { useAccount } from 'wagmi';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface MerchantDetails {
  accountAddress: string;
  accountBalance: string;
  mrr: number;
  currentLoan: {
    investorName: string;
    loanAmount: number;
    loanPeriod: number;
  };
  revenue: {
    months: string[];
    amounts: number[];
  };
  subscriberInfo: {
    totalSubscribers: number;
    subscribers: string[];
  };
}

const Dashboard: NextPage = () => {
  const merchantAddress = "0x123...abc";
  const { address } = useAccount();
  const [merchantDetails, setMerchantDetails] = useState<MerchantDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const abbreviateAddress = (address: string) => {
    if (address === "Loading..." || address === "Error loading address") return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        const details = await getMerchantDetails(address);
        setMerchantDetails({
          accountAddress: details.accountAddress,
          accountBalance: details.accountBalance,
          mrr: details.mrr,
          currentLoan: {
            investorName: details.currentLoan.investorName,
            loanAmount: details.currentLoan.loanAmount,
            loanPeriod: details.currentLoan.loanPeriod
          },
          revenue: details.revenue,
          subscriberInfo: {
            totalSubscribers: details.subscriberInfo.totalSubscribers,
            subscribers: details.subscriberInfo.subscribers
          }
        });
      } catch (error) {
        console.error('Error fetching merchant details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantDetails();
  }, [merchantAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantDetails?.accountAddress || "");
    alert("Address copied!");
  };

  const lineChartData: ChartData = {
    labels: merchantDetails?.revenue.months || [],
    datasets: [{
      label: 'Amount Earned ($)',
      data: merchantDetails?.revenue.amounts || [],
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.3)',
    }],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const, labels: { color: 'white' } },
      title: { display: true, text: 'Amount Earned Over Time', color: 'white' },
    },
    scales: {
      x: { title: { display: true, text: 'Month', color: 'white' }, ticks: { color: 'white' } },
      y: { title: { display: true, text: 'Amount ($)', color: 'white' }, ticks: { color: 'white' } },
    },
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Merchant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Merchant Address */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Merchant Address:</span>
            <button onClick={handleCopy}>
              {abbreviateAddress(merchantDetails?.accountAddress || '')}
            </button>
          </div>
        </div>

        {/* Current Balance */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <p className="font-semibold">Current Balance:</p>
          <p className="text-2xl font-bold">${Number(merchantDetails?.accountBalance || 0).toFixed(2)}</p>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <p className="font-semibold">Monthly Recurring Revenue:</p>
          <p className="text-2xl font-bold">${(merchantDetails?.mrr || 0).toFixed(2)}</p>
        </div>

        {/* Active Subscribers */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 max-h-40 overflow-y-scroll">
          <p className="font-semibold mb-2">Active Subscribers ({merchantDetails?.subscriberInfo.totalSubscribers || 0}):</p>
          <ul className="space-y-2">
            {merchantDetails?.subscriberInfo.subscribers.map((subscriber, idx) => (
              <li key={idx} className="text-lg hover:text-blue-400 cursor-pointer">{subscriber}</li>
            ))}
          </ul>
        </div>

        {/* Active Loan */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 col-span-2 lg:col-span-1 ml-auto">
          <p className="font-semibold mb-2">Active Loan:</p>
          {merchantDetails?.currentLoan && merchantDetails.currentLoan.loanAmount > 0 ? (
            <div className="mt-2 border-t border-gray-700 pt-2">
              <p className="font-medium">Investor: <span className="text-blue-400">{merchantDetails.currentLoan.investorName}</span></p>
              <p>Loan Amount: <span className="font-semibold">${merchantDetails.currentLoan.loanAmount}</span></p>
              <p>Repayment Period: {merchantDetails.currentLoan.loanPeriod} days</p>
            </div>
          ) : (
            <p>No active loans</p>
          )}
        </div>
      </div>

      {/* Amount Earned in One Year (Chart) */}
      <div className="bg-gray-800 p-6 mt-8 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 max-w-4xl mx-auto">
        <h2 className="text-center font-semibold text-xl mb-4">Amount Earned in One Year</h2>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      {/* Links and Buttons */}
      <div className="flex flex-col lg:flex-row items-center justify-center mt-8 space-x-0 lg:space-x-4 space-y-4 lg:space-y-0">
        <a href="/create" className="text-blue-400 hover:text-blue-500 text-lg">Request Loan</a>
        <a href="/loans" className="text-blue-400 hover:text-blue-500 text-lg">Get Loan</a>
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors">Receive</button>
        <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors">Withdraw</button>
      </div>
    </div>
  );
};

export default Dashboard;

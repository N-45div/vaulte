"use client";

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getAccountAddress } from '@/utils/AppFetch';
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

interface Loan {
  investor: string;
  amount: number;
  repaymentDate: string;
}

const Dashboard: NextPage = () => {
  const { address } = useAccount();
  const [merchantAddress, setMerchantAddress] = useState<string>("Loading...");
  const [loans] = useState<Loan[]>([
    { investor: 'John Doe', amount: 500, repaymentDate: '2025-01-01' },
    { investor: 'Jane Smith', amount: 300, repaymentDate: '2025-02-01' },
  ]);

  const abbreviateAddress = (address: string) => {
    if (address === "Loading..." || address === "Error loading address") return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const fetchMerchantAddress = async () => {
      if (address) {
        try {
          const accountAddress = await getAccountAddress("merchant", address);
          setMerchantAddress(accountAddress);
        } catch (error) {
          console.error("Error fetching merchant address:", error);
          setMerchantAddress("Error loading address");
        }
      }
    };

    fetchMerchantAddress();
  }, [address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantAddress);
    alert("Address copied!");
  };

  const lineChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Amount Earned ($)',
        data: [10, 15, 12, 20, 25, 18],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
      },
    ],
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

  return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Merchant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Merchant Address */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Merchant Address:</span>
            <button onClick={handleCopy} className="text-blue-400 hover:text-blue-500">
              {abbreviateAddress(merchantAddress)}
            </button>
          </div>
        </div>

        {/* Current Balance */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <p className="font-semibold">Current Balance:</p>
          <p className="text-2xl font-bold">$10</p>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
          <p className="font-semibold">Monthly Recurring Revenue:</p>
          <p className="text-2xl font-bold">$10</p>
        </div>

        {/* Active Subscribers (Scrollable) */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 max-h-40 overflow-y-scroll">
          <p className="font-semibold mb-2">Active Subscribers:</p>
          <ul className="space-y-2">
            {[...Array(20)].map((_, idx) => (
              <li key={idx} className="text-lg hover:text-blue-400 cursor-pointer">Subscriber {idx + 1}</li>
            ))}
          </ul>
        </div>

        {/* Active Loans */}
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 col-span-2 lg:col-span-1 ml-auto">
          <p className="font-semibold mb-2">Active Loans:</p>
          {loans.map((loan, index) => (
            <div key={index} className="mt-2 border-t border-gray-700 pt-2">
              <p className="font-medium">Investor: <span className="text-blue-400">{loan.investor}</span></p>
              <p>Loan Amount: <span className="font-semibold">${loan.amount}</span></p>
              <p>Repayment Date: {loan.repaymentDate}</p>
            </div>
          ))}
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

"use client";

import React from 'react';
import { NextPage } from 'next';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Type definition for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const Dashboard: NextPage = () => {
  const merchantAddress = "0x123...abc";

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantAddress);
    alert("Address copied!");
  };

  // Sample data for the line chart
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
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Amount Earned Over Time',
        color: 'white',
      },
    },
    scales: {
      x: { 
        title: { display: true, text: 'Month', color: 'white' },
        ticks: { color: 'white' },
      },
      y: { 
        title: { display: true, text: 'Amount ($)', color: 'white' },
        ticks: { color: 'white' },
      },
    },
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <h1 className="text-2xl font-semibold mb-6">Merchant Dashboard</h1>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Merchant Address */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="font-medium">Merchant Address:</span>
            <button 
              onClick={handleCopy} 
              className="text-blue-400 hover:underline"
            >
              {merchantAddress}
            </button>
          </div>
        </div>

        {/* Current Balance */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Current Balance:</p>
          <p className="text-xl">$10</p>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Monthly Recurring Revenue:</p>
          <p className="text-xl">$10</p>
        </div>

        {/* Active Subscribers */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Active Subscribers:</p>
          <p className="text-xl">123</p>
        </div>

        {/* Active Loans */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Active Loans:</p>
          <div>
            <p>Number of Active Loans: 2</p>
            <div className="mt-2">
              <p>Investor: John Doe</p>
              <p>Loan Amount: $500</p>
              <p>Repayment Date: 2025-01-01</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Earned in One Year (Chart) */}
      <div className="bg-gray-800 p-4 mt-6 rounded-lg shadow">
        <h2 className="font-medium mb-4">Amount Earned in One Year</h2>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      {/* Links */}
      <div className="mt-6 space-x-4">
        <a href="/create" className="text-blue-400 hover:underline">Request Loan</a>
        <a href="/loans" className="text-blue-400 hover:underline">Get Loan</a>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-x-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Receive</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Withdraw</button>
      </div>
    </div>
  );
};

export default Dashboard;

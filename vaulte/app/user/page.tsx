"use client";

import React from 'react';
import { NextPage } from 'next';
import { Line } from 'react-chartjs-2';
import { FaTelegramPlane, FaPlus, FaCopy } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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

interface Subscription {
  merchantName: string;
  amount: number;
}

const Dashboard: NextPage = () => {
  const userAddress = "0x123...ABC";

  const handleCopy = () => {
    navigator.clipboard.writeText(userAddress);
    alert("Address copied!");
  };

  const lineChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Amount Spent ($)',
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
        text: 'Amount Spent Over Time',
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

  const subscriptions: Subscription[] = [
    { merchantName: 'Netflix', amount: 15 },
    { merchantName: 'Spotify', amount: 10 },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-2xl font-semibold mb-6">User Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="font-medium">User Address:</span>
            <button onClick={handleCopy} className="text-blue-400 hover:underline flex items-center gap-1">
              <FaCopy /> {userAddress}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Current Balance:</p>
          <p className="text-xl">$10</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Active Subscriptions:</p>
          <p className="text-xl">{subscriptions.length}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 mt-6 rounded-lg shadow">
        <h2 className="font-medium mb-4">Amount Spent in One Year</h2>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      <div className="mt-6 space-y-4">
        {subscriptions.map((subscription, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow flex justify-between">
            <p className="font-medium">{subscription.merchantName}</p>
            <p className="text-gray-400">Subscription Amount: ${subscription.amount}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex space-x-4">
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          <FaPlus /> Add Funds
        </button>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <FaTelegramPlane /> Send
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

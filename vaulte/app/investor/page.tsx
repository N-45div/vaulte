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

interface Pool {
  merchantName: string;
  loanAmount: number;
  repaymentDate: string;
}

interface Loan {
  merchantName: string;
  loanAmount: number;
  repaymentDate: string;
}

const InvestorDashboard: NextPage = () => {
  const investorAddress = "0x456...DEF";

  const handleCopy = () => {
    navigator.clipboard.writeText(investorAddress);
    alert("Address copied!");
  };

  const lineChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Amount Earned ($)',
        data: [12, 18, 22, 28, 35, 40],
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.3)',
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

  const activePools: Pool[] = [
    { merchantName: 'Merchant A', loanAmount: 1500, repaymentDate: '2025-01-10' },
    { merchantName: 'Merchant B', loanAmount: 2000, repaymentDate: '2025-04-15' },
  ];

  const activeLoans: Loan[] = [
    { merchantName: 'Merchant C', loanAmount: 800, repaymentDate: '2025-03-10' },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-2xl font-semibold mb-6">Investor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="font-medium">Investor Address:</span>
            <button onClick={handleCopy} className="text-blue-400 hover:underline flex items-center gap-1">
              <FaCopy /> {investorAddress}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Current Balance:</p>
          <p className="text-xl">$10</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Monthly Recurring Revenue:</p>
          <p className="text-xl">$10</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Active Pools:</p>
          <p className="text-xl">{activePools.length}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 mt-6 rounded-lg shadow">
        <h2 className="font-medium mb-4">Amount Earned in One Year</h2>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium mb-4">Active Pools</h2>
        {activePools.map((pool, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow mb-4 flex justify-between">
            <div>
              <p className="font-medium">{pool.merchantName}</p>
              <p>Loan Amount: ${pool.loanAmount}</p>
              <p>Repayment Date: {pool.repaymentDate}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium mb-4">Active Loans</h2>
        {activeLoans.map((loan, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow mb-4 flex justify-between">
            <div>
              <p className="font-medium">{loan.merchantName}</p>
              <p>Loan Amount: ${loan.loanAmount}</p>
              <p>Repayment Date: {loan.repaymentDate}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex space-x-4">
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          <FaPlus /> Receive
        </button>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <FaTelegramPlane /> Withdraw
        </button>
      </div>

      <div className="mt-6 flex space-x-4">
        <a href="/loans" className="text-blue-400 hover:underline">Offer Loan</a>
        <a href="/create" className="text-blue-400 hover:underline">Create Pool</a>
      </div>
    </div>
  );
};

export default InvestorDashboard;

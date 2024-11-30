"use client";

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Line } from 'react-chartjs-2';
import { FaTelegramPlane, FaPlus, FaCopy } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { getInvestorDetails } from '../../utils/AppFetch';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface InvestorDetails {
  accountAddress: string;
  accountBalance: string;
  totalDisbursed: number;
  activeLoans: Array<{
    merchantName: string;
    loanAmount: number;
  }>;
  result: {
    months: string[];
    amounts: number[];
  };
}

const InvestorDashboard: NextPage = () => {
  const { address } = useAccount();
  const [investorDetails, setInvestorDetails] = useState<InvestorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      if (!address) return;
      try {
        const details = await getInvestorDetails(address);
        setInvestorDetails(details);
      } catch (error) {
        console.error('Error fetching investor details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestorDetails();
  }, [address]);

  const handleCopy = () => {
    if (investorDetails?.accountAddress) {
      navigator.clipboard.writeText(investorDetails.accountAddress);
      alert("Address copied!");
    }
  };

  const lineChartData = {
    labels: investorDetails?.result.months || [],
    datasets: [
      {
        label: 'Amount Disbursed ($)',
        data: investorDetails?.result.amounts || [],
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
        text: 'Amount Disbursed Over Time',
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-2xl font-semibold mb-6">Investor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="font-medium">Investor Address:</span>
            <button onClick={handleCopy} className="text-blue-400 hover:underline flex items-center gap-1">
              <FaCopy /> {investorDetails?.accountAddress.slice(0, 6)}...{investorDetails?.accountAddress.slice(-4)}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Current Balance:</p>
          <p className="text-xl">${Number(investorDetails?.accountBalance || 0).toFixed(2)}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <p className="font-medium">Total Amount Disbursed:</p>
          <p className="text-xl">${investorDetails?.totalDisbursed.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 mt-6 rounded-lg shadow">
        <h2 className="font-medium mb-4">Amount Disbursed Over Time</h2>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium mb-4">Active Loans</h2>
        {investorDetails?.activeLoans.map((loan, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow mb-4 flex justify-between">
            <div>
              <p className="font-medium">{loan.merchantName}</p>
              <p>Loan Amount: ${loan.loanAmount}</p>
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

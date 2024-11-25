"use client";

import React, { useState } from 'react';
import { useAccount } from "wagmi";
import { useEthersSigner } from "../../utils/ethersAdapter";
import { createLoanOffer, createLoanPool, createLoanRequest } from "../../utils/app";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CreatePage: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'request' | 'offer' | 'pool'>('request');
  const [amount, setAmount] = useState<string>('');
  const [poolName, setPoolName] = useState<string>("");
  const [repaymentPeriod, setRepaymentPeriod] = useState<string>('');
  const [interest, setInterest] = useState<string>('');

  const signer = useEthersSigner({chainId: 52085143});

  const createRequest = async() => {
    const numericAmount = parseFloat(amount) || 0;
    const numericInterest = parseFloat(interest) || 0;
    const numericRepaymentPeriod = parseFloat(repaymentPeriod) || 0;

    try {
      const result = await createLoanRequest(signer, amount, numericInterest, numericRepaymentPeriod);
      if (result === true) {
        toast.success('Loan request created successfully');
        router.push('/');
      } else {
        toast.error('Failed to create loan request');
      }
    } catch (error) {
      toast.error('Error creating loan request: ' + (error as Error).message);
    }
  }

  const createOffer = async() => {
    const numericAmount = parseFloat(amount) || 0;
    const numericInterest = parseFloat(interest) || 0;
    const numericRepaymentPeriod = parseFloat(repaymentPeriod) || 0;

    try {
      const result = await createLoanOffer(signer, amount, numericInterest, numericRepaymentPeriod);
      if (result === true) {
        toast.success('Loan offer created successfully');
        router.push('/');
      } else {
        toast.error('Failed to create loan offer');
      }
    } catch (error) {
      toast.error('Error creating loan offer: ' + (error as Error).message);
    }
  }

  const createPool = async() => {
    const numericAmount = parseFloat(amount) || 0;
    const numericInterest = parseFloat(interest) || 0;
    const numericRepaymentPeriod = parseFloat(repaymentPeriod) || 0;

    try {
      const result = await createLoanPool(signer, poolName, amount, interest, numericRepaymentPeriod);
      if (result === true) {
        toast.success('Loan pool created successfully');
        router.push('/');
      } else {
        toast.error('Failed to create loan pool');
      }
    } catch (error) {
      toast.error('Error creating loan pool: ' + (error as Error).message);
    }
  }

  const submit = async() => {    
    if (selectedTab === "request") {
      await createRequest();
    } else if (selectedTab === "offer") {
      await createOffer();
    } else {
      await createPool();
    }
  }  

  const handleTabChange = (tab: 'request' | 'offer' | 'pool') => {
    setSelectedTab(tab);
  };

  const calculateMonthlyRepayment = () => {
    const numericAmount = parseFloat(amount) || 0;
    const numericInterest = parseFloat(interest) || 0;
    const numericRepaymentPeriod = parseFloat(repaymentPeriod) || 0;
    const monthlyInterest = numericInterest / 100 / numericRepaymentPeriod;
    const repaymentAmount = numericAmount * monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -numericRepaymentPeriod));
    return repaymentAmount ? repaymentAmount.toFixed(2) : "0.00";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-3xl w-full p-8 bg-gray-800 bg-opacity-90 rounded-lg shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-100">Create Page</h1>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {['request', 'offer', 'pool'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as 'request' | 'offer' | 'pool')}
              className={`px-6 py-2 rounded-full transition ${
                selectedTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-700 p-8 rounded-lg shadow-md border border-gray-600">
          {['request', 'offer', 'pool'].map((tab) => (
            selectedTab === tab && (
              <div key={tab}>
                <h2 className="text-2xl font-semibold mb-6 text-gray-200">Create a {tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 shadow-inner"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Repayment Period (months)</label>
                    <input
                      type="number"
                      value={repaymentPeriod}
                      onChange={(e) => setRepaymentPeriod(e.target.value)}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 shadow-inner"
                      placeholder="Enter repayment period"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Interest (%)</label>
                    <input
                      type="number"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="mt-2 block w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 shadow-inner"
                      placeholder="Enter interest rate"
                    />
                  </div>

                  {/* Monthly Repayment Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Monthly Repayment Amount</label>
                    <div className="mt-2 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300">
                      {calculateMonthlyRepayment()}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
                  >
                    {tab === 'request' ? 'Request' : tab === 'offer' ? 'Offer' : 'Create'}
                  </button>
                </form>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;

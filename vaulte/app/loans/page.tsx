"use client";

import React, { useState, useEffect } from 'react';
// import { LoanOfferInfo, LoanRequestInfo, LoanPoolInfo } from "../../utils/AppFetch";
import { fundRequest, acceptOffer, loanPoolAction } from "../../utils/app";
import { useAccount } from "wagmi";
import { useEthersSigner } from "../../utils/ethersAdapter";
import { fetchLoanRequests, fetchLoanOffers, fetchLoanPools } from "../../utils/AppFetch";
import toast from 'react-hot-toast';

interface LoanRequestInfo {
  merchantName: string;
  merchantAddress: string;
  merchantMRR: number;
  requestAmount: number;
  repaymentTime: number;
  interest: number;
}

interface LoanOfferInfo {
  investorAddress: string;
  investorName: string;
  offerId: number;
  offerAmount: number;
  repaymentTime: number;
  interest: number;
}

interface LoanPoolInfo {
  poolName: string;
  interest: number;
  poolAddress: string;
}

const LoansPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [loanRequests, setLoanRequests] = useState<LoanRequestInfo[]>([]);
  const [loanOffers, setLoanOffers] = useState<LoanOfferInfo[]>([]);
  const [loanPools, setLoanPools] = useState<LoanPoolInfo[]>([]);
  const [amount, setAmount] = useState<string>('');

  const signer = useEthersSigner();

  useEffect(() => {
    const getLoanRequests = async () => {
      const requests = await fetchLoanRequests();
      if (requests) {
        setLoanRequests(requests);
      }
    };

    getLoanRequests();
  }, []);

  useEffect(() => {
    const getLoanOffers = async () => {
      const offers = await fetchLoanOffers();
      if (offers) {
        setLoanOffers(offers);
      }
    };

    getLoanOffers();
  }, []);

  useEffect(() => {
    const getLoanPools = async () => {
      const pools = await fetchLoanPools();
      if (pools) {
        setLoanPools(pools);
      }
    };

    getLoanPools();
  }, []);

  const fundLoanRequest = async (merchantAddress: string) => {
    try {
      const result = await fundRequest(signer, merchantAddress);
      if (result === true) {
        toast.success('Loan request funded successfully');
      } else {
        toast.error('Failed to fund loan request');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error funding loan request: ' + (error as Error).message);
    }
  }

  const acceptLoanOffer = async (investorAddress: string, offerId: number) => {
    try {
      const result = await acceptOffer(signer, investorAddress, offerId);
      if (result === true) {
        toast.success('Loan offer accepted successfully');
      } else {
        toast.error('Failed to accept loan offer');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error accepting loan offer: ' + (error as Error).message);
    }
  }

  const poolAction = async (poolId: number, tx: number) => {
    try {
      const result = await loanPoolAction(signer, amount, poolId, tx);
      if (result === true) {
        toast.success(tx === 0 ? 'Successfully contributed to pool' : 'Successfully got loan from pool');
      } else {
        toast.error(tx === 0 ? 'Failed to contribute to pool' : 'Failed to get loan from pool');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error performing pool action: ' + (error as Error).message);
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Loan Requests</h2>
            {loanRequests.length === 0 ? (
              <p className="text-gray-400">No loan requests available</p>
            ) : (
              loanRequests.map((request, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg shadow-md space-y-2">
                  <p>Merchant Name: {request.merchantName}</p>
                  <p>Merchant Address: {request.merchantAddress}</p>
                  <p>Monthly Recurring Revenue (MRR): ${request.merchantMRR}</p>
                  <p>Request Amount: ${request.requestAmount}</p>
                  <p>Repayment Time: {request.repaymentTime} months</p>
                  <p>Interest: {request.interest}%</p>
                  <button 
                    onClick={() => fundLoanRequest(request.merchantAddress)}
                    className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg"
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </div>
        );

      case 'offers':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Loan Offers</h2>
            {loanOffers.length === 0 ? (
              <p className="text-gray-400">No loan offers available</p>
            ) : (
              loanOffers.map((offer, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg shadow-md space-y-2">
                  <p>Investor Name: {offer.investorName}</p>
                  <p>Investor Address: {offer.investorAddress}</p>
                  <p>Offer Amount: ${offer.offerAmount}</p>
                  <p>Repayment Time: {offer.repaymentTime} months</p>
                  <p>Interest: {offer.interest}%</p>
                  <button 
                    onClick={() => acceptLoanOffer(offer.investorAddress, offer.offerId)}
                    className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg"
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </div>
        );

      case 'pools':
        return (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Pools</h2>
            {loanPools.length === 0 ? (
              <p className="text-gray-400">No pools available</p>
            ) : (
              loanPools.map((pool, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg shadow-md space-y-2">
                  <p>Pool Name: {pool.poolName}</p>
                  <p>Interest: {pool.interest}%</p>
                  <p>Pool Address: {pool.poolAddress}</p>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" 
                      placeholder="Amount" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white shadow-inner focus:outline-none"
                    />
                    <button 
                      onClick={() => poolAction(index, 1)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-lg"
                    >
                      Get
                    </button>
                    <button 
                      onClick={() => poolAction(index, 0)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
                    >
                      Invest
                    </button>
                  </div>
                </div>
              ))
            )}
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

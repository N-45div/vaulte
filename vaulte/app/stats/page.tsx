"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getStats } from '@/utils/AppFetch';

const Stats: React.FC = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalDisbursed: 0,
    totalActiveSubscriptions: 0,
    totalUSDe: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-800 text-white font-sans">
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-blue-400">Vaulte Stats</h1>
      </header>

      <main className="px-8">
        <section className="text-center py-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide">
            Platform Statistics
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Real-time metrics of Vaulte's financial activities
          </p>
        </section>

        <section className="grid gap-10 md:grid-cols-2 xl:grid-cols-2 py-20">
          {[
            {
              title: 'Total Loans',
              value: stats.totalLoans.toLocaleString(),
              description: 'Total number of loans disbursed through the platform'
            },
            {
              title: 'Active Subscriptions',
              value: stats.totalActiveSubscriptions.toLocaleString(),
              description: 'Current active subscription contracts',
            },
            {
              title: 'Loan Volume',
              value: `₳ ${(stats.totalDisbursed).toFixed(1)} USDE`,
              description: 'Total loan value processed on the platform',
            },
            {
              title: 'subscription Volume',
              value: `${(stats.totalUSDe).toFixed(1)} USDE`,
              description: 'Total subscription payments value processed on the platform',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white">{stat.title}</h3>
              <div className="mt-4 text-3xl font-bold text-blue-200">{stat.value}</div>
              <p className="mt-2 text-blue-100">{stat.description}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Stats;

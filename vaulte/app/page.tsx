"use client"
import { HoveredLink, Menu, MenuItem } from "./components/ui/navbar-menu";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from 'wagmi';


const Home: React.FC = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-800 text-white font-sans">
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-blue-400">Vaulte</h1>
        <div className="flex items-center space-x-4">
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <Menu setActive={setActive}>
              <MenuItem setActive={setActive} active={active} item="Dashboard">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/user">User</HoveredLink>
                  <HoveredLink href="/merchant">Merchant</HoveredLink>
                  <HoveredLink href="/investor">Investor</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Explore">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/loans">Loans</HoveredLink>
                  <HoveredLink href="/create">Create</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Account">
                <div className="flex flex-col space-y-4 text-sm">
                  <button 
                    onClick={() => disconnect()}
                    className="text-left text-red-400 hover:text-red-300"
                  >
                    Disconnect
                  </button>
                </div>
              </MenuItem>
            </Menu>
          )}
        </div>
      </header>

      <main className="px-8">
        <section className="text-center py-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide">
            Empower Your Finances with Vaulte
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            A decentralized finance solution tailored for users, merchants, and investors alike.
          </p>
        </section>

        <section className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 py-20">
          {[
            {
              title: 'User Features',
              description: 'Send, receive, and pay subscriptions with ease.',
            },
            {
              title: 'Merchant Features',
              description: 'Get paid easily and access loans on your terms, anytime.',
            },
            {
              title: 'Investor Features',
              description: 'Earn interest on loans while supporting small businesses and indie hackers.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-4 text-blue-100">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="text-center py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide mb-8">
            Powered by Ethena and Layer Zero
          </h2>
          <p className="text-blue-200">
            Secure, reliable, and fully decentralized infrastructure for seamless financial services.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;

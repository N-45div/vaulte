"use client";
import { HoveredLink, Menu, MenuItem } from "./components/ui/navbar-menu";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  // State to manage sign-up visibility, user data, and wallet connection
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<"user" | "merchant" | "investor" | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Handler for wallet connection
  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  // Handle sign-up form submission
  const handleSignUp = () => {
    if (userName && role) {
      setShowSignUpForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-800 text-white font-sans">
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-blue-400">Vaulte</h1>
        <div className="flex space-x-4">
          {/* Display Sign Up button initially */}
          {!userName && (
            <button
              onClick={() => setShowSignUpForm(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
            >
              Sign Up
            </button>
          )}

          {/* After sign-up, show user's name and Connect Wallet button */}
          {userName && !walletConnected && (
            <>
              <span className="text-blue-200 font-medium">Welcome, {userName}!</span>
              <button
                onClick={handleConnectWallet}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
              >
                Connect Wallet
              </button>
            </>
          )}

          {/* After wallet connection, show the Explore button */}
          {userName && walletConnected && (
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
            >
              <HoveredLink href={`/${role}`}>
                Explore {role === "user" ? "User" : role === "merchant" ? "Merchant" : "Investor"} Page
              </HoveredLink>
            </button>
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

        {/* Sign-Up Form Section */}
        {showSignUpForm && (
          <section className="py-10 flex justify-center">
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-2xl font-semibold mb-6 text-center">Sign Up</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSignUp();
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">User Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <div className="flex space-x-4">
                    {["user", "merchant", "investor"].map((roleOption) => (
                      <label key={roleOption} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={roleOption}
                          checked={role === roleOption}
                          onChange={() => setRole(roleOption as "user" | "merchant" | "investor")}
                          className="form-radio"
                        />
                        <span className="capitalize">{roleOption}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md text-white font-semibold"
                >
                  Submit
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Feature Section */}
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

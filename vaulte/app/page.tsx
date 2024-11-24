"use client"
import { HoveredLink, Menu, MenuItem } from "./components/ui/navbar-menu";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from 'wagmi';

const Home: React.FC = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [active, setActive] = useState<string | null>(null);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<"user" | "merchant" | "investor" | null>(null);
  const [hasAccount, setHasAccount] = useState(false);

  // Check if user has an account when wallet is connected
  useEffect(() => {
    const checkUserAccount = async () => {
      if (isConnected) {
        // Add your API call here to check if user exists
        // For now, we'll simulate it
        try {
          // const response = await fetch('/api/check-user');
          // const data = await response.json();
          // setHasAccount(data.exists);
          // if (data.exists) {
          //   setRole(data.role);
          // }
          setHasAccount(false); // Simulate new user
        } catch (error) {
          console.error('Error checking user account:', error);
        }
      }
    };

    checkUserAccount();
  }, [isConnected]);

  // Handle sign-up form submission
  const handleSignUp = async () => {
    if (userName && role) {
      try {
        // Add your API call here to create user
        // await fetch('/api/create-user', {
        //   method: 'POST',
        //   body: JSON.stringify({ userName, role }),
        // });
        setShowSignUpForm(false);
        setHasAccount(true);
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  // Show sign-up form when connected but no account exists
  useEffect(() => {
    if (isConnected && !hasAccount) {
      setShowSignUpForm(true);
    }
  }, [isConnected, hasAccount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-800 text-white font-sans">
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-blue-400">Vaulte</h1>
        <div className="flex items-center space-x-4">
          {!isConnected ? (
            <ConnectButton />
          ) : hasAccount ? (
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
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-blue-200">Complete signup to continue</span>
              <button
                onClick={() => disconnect()}
                className="text-red-400 hover:text-red-300"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sign-Up Form Section */}
      {showSignUpForm && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
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

const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Router Contract", function () {
    async function deployFixture() {
        const [owner, user1, user2, user3] = await ethers.getSigners();

        // Deploy Mock USDE Token
        const MockUSDEToken = await ethers.getContractFactory("MockUSDEToken");
        const usdeToken = await MockUSDEToken.deploy();
        await usdeToken.waitForDeployment();

        // Deploy Router
        const Router = await ethers.getContractFactory("Router");
        const router = await Router.deploy();
        await router.waitForDeployment();

        // Deploy Factories
        const UserFactory = await ethers.getContractFactory("UserFactory");
        const userFactory = await UserFactory.deploy(
            await router.getAddress(),
            await usdeToken.getAddress()
        );

        const InvestorFactory = await ethers.getContractFactory("InvestorFactory");
        const investorFactory = await InvestorFactory.deploy(
            await router.getAddress(),
            await usdeToken.getAddress()
        );

        const MerchantFactory = await ethers.getContractFactory("MerchantFactory");
        const merchantFactory = await MerchantFactory.deploy(
            await router.getAddress(),
            await usdeToken.getAddress()
        );

        // Set factories in router
        await router.setFactory(
            await userFactory.getAddress(),
            await investorFactory.getAddress(),
            await merchantFactory.getAddress()
        );

        // Setup initial balances
        const initialBalance = ethers.parseEther("10000");
        await usdeToken.mint(user1.address, initialBalance);
        await usdeToken.mint(user2.address, initialBalance);
        await usdeToken.mint(user3.address, initialBalance);

        return {
            router,
            userFactory,
            investorFactory,
            merchantFactory,
            usdeToken,
            owner,
            user1,
            user2,
            user3,
            initialBalance
        };
    }

    describe("Factory Setup", function () {
        it("Should set factory addresses correctly", async function () {
            const { router, userFactory, investorFactory, merchantFactory } = await loadFixture(deployFixture);
            
            expect(await router.userFactoryAddress()).to.equal(await userFactory.getAddress());
            expect(await router.investorFactoryAddress()).to.equal(await investorFactory.getAddress());
            expect(await router.merchantFactoryAddress()).to.equal(await merchantFactory.getAddress());
        });

        it("Should only allow owner to set factory addresses", async function () {
            const { router, userFactory, investorFactory, merchantFactory, user1 } = await loadFixture(deployFixture);
            
            await expect(
                router.connect(user1).setFactory(
                    await userFactory.getAddress(),
                    await investorFactory.getAddress(),
                    await merchantFactory.getAddress()
                )
            ).to.be.revertedWithCustomError(router, "OwnableUnauthorizedAccount");
        });
    });

    describe("Subscription Management", function () {
        it("Should create a new subscription successfully", async function () {
            const { router, userFactory, merchantFactory, user1, user2 } = await loadFixture(deployFixture);

            // Create user and merchant accounts
            await userFactory.connect(user1).createAccount("User1");
            await merchantFactory.connect(user2).createAccount("Merchant1");

            const merchantAccount = await merchantFactory.getAccountAddress(user2.address);
            
            // Subscribe
            await expect(router.connect(user1).subscribe(1, merchantAccount))
                .to.emit(router, "Sub")
                .withArgs(
                    0,
                    await userFactory.getAccountAddress(user1.address),
                    merchantAccount,
                    1,
                    await ethers.provider.getBlock("latest").then(b => b.timestamp)
                );
        });

        it("Should process subscription payments correctly", async function () {
            const { router, userFactory, merchantFactory, usdeToken, user1, user2 } = await loadFixture(deployFixture);

            // Setup accounts
            await userFactory.connect(user1).createAccount("User1");
            await merchantFactory.connect(user2).createAccount("Merchant1");

            const userAccount = await userFactory.getAccountAddress(user1.address);
            const merchantAccount = await merchantFactory.getAccountAddress(user2.address);

            // Approve USDE spending
            const paymentAmount = ethers.parseEther("100");
            await usdeToken.connect(user1).approve(userAccount, paymentAmount);

            // Get timestamp before transaction
            const blockBefore = await ethers.provider.getBlock("latest");
            const timestampBefore = blockBefore.timestamp;

            // Process payment and get event
            const tx = await router.charge(userAccount, merchantAccount, paymentAmount);
            const receipt = await tx.wait();
            
            // Find the SubscriptionPayment event
            const event = receipt.logs.find(
                log => log.fragment && log.fragment.name === 'SubscriptionPayment'
            );
            
            // Verify event arguments except timestamp
            expect(event.args[0]).to.equal(0); // payment ID
            expect(event.args[1]).to.equal(userAccount);
            expect(event.args[2]).to.equal(merchantAccount);
            expect(event.args[3]).to.equal(paymentAmount);
            
            // Verify timestamp is within reasonable range (1 second)
            const eventTimestamp = event.args[4];
            expect(eventTimestamp).to.be.within(
                timestampBefore,
                timestampBefore + 2
            );
        });
    });

    describe("Loan Management", function () {
        it("Should process loan funding requests correctly", async function () {
            const { router, merchantFactory, investorFactory, usdeToken, user1, user2 } = await loadFixture(deployFixture);

            // Setup accounts
            await merchantFactory.connect(user1).createAccount("Merchant1");
            await investorFactory.connect(user2).createAccount("Investor1");

            const merchantAccount = await merchantFactory.getAccountAddress(user1.address);
            const investorAccount = await investorFactory.getAccountAddress(user2.address);

            // Get merchant account contract instance
            const MerchantAccount = await ethers.getContractFactory("MerchantAccount");
            const merchantContract = MerchantAccount.attach(merchantAccount);

            // Set up loan request parameters
            const loanAmount = ethers.parseEther("1000");
            const loanPeriod = 12; // 12 months
            const interest = 10; // 10%

            // Fund investor account with USDE
            await usdeToken.connect(user2).approve(investorAccount, loanAmount);
            await usdeToken.transfer(investorAccount, loanAmount);

            // Create loan request from merchant
            await merchantContract.connect(user1).makeRequest(
                loanAmount,
                interest,
                loanPeriod
            );

            // Process funding request
            await expect(
                router.connect(user2).fundRequest(merchantAccount)
            ).to.emit(router, "LoanDisbursed")
            .withArgs(
                0, // loan ID
                investorAccount,
                merchantAccount,
                loanAmount,
                0 // loan category
            );
        });

        it("Should allow pool contributions", async function () {
            const { router, investorFactory, usdeToken, user1 } = await loadFixture(deployFixture);

            // Setup investor account
            await investorFactory.connect(user1).createAccount("Investor1");
            const investorAccount = await investorFactory.getAccountAddress(user1.address);

            // Create investor pool with proper parameters
            const InvestorPool = await ethers.getContractFactory("InvestorPool");
            const investorPool = await InvestorPool.deploy(
                await router.getAddress(),
                await usdeToken.getAddress(),
                user1.address,
                10, // interest rate
                12  // loan period
            );
            await investorPool.waitForDeployment();

            // Set up contribution
            const contributionAmount = ethers.parseEther("1000");
            
            // Approve USDE transfers
            await usdeToken.connect(user1).approve(investorAccount, contributionAmount);
            
            // Transfer USDE to investor account
            await usdeToken.transfer(investorAccount, contributionAmount);

            // Approve pool to spend USDE
            await usdeToken.connect(user1).approve(await investorPool.getAddress(), contributionAmount);

            // Make contribution
            await expect(
                router.connect(user1).contributePool(await investorPool.getAddress(), contributionAmount)
            ).to.not.be.reverted;
        });

        describe("Pool Loans", function () {
            it("Should process getLoan from investor pool correctly", async function () {
                const { router, merchantFactory, usdeToken, user1, user2 } = await loadFixture(deployFixture);

                // Setup merchant account
                await merchantFactory.connect(user1).createAccount("Merchant1");
                const merchantAccount = await merchantFactory.getAccountAddress(user1.address);

                // Deploy and setup investor pool
                const InvestorPool = await ethers.getContractFactory("InvestorPool");
                const investorPool = await InvestorPool.deploy(
                    await router.getAddress(),
                    await usdeToken.getAddress(),
                    user2.address, // pool owner
                    10, // interest rate
                    12  // loan period
                );
                await investorPool.waitForDeployment();

                // Fund the pool directly
                const poolFunds = ethers.parseEther("2000");
                await usdeToken.connect(user2).approve(await investorPool.getAddress(), poolFunds);
                await usdeToken.connect(user2).transfer(await investorPool.getAddress(), poolFunds);

                // Initialize pool (if required by your contract)
                await investorPool.connect(user2).initialize();

                // Request loan
                const loanAmount = ethers.parseEther("1000");

                // Get loan from pool
                await expect(router.connect(user1).getLoan(await investorPool.getAddress(), loanAmount))
                    .to.emit(router, "LoanDisbursed")
                    .withArgs(
                        0, // loan ID
                        await investorPool.getAddress(),
                        merchantAccount,
                        loanAmount,
                        2 // loan category for pool loans
                    );

                // Verify loan details
                const MerchantAccount = await ethers.getContractFactory("MerchantAccount");
                const merchantContract = MerchantAccount.attach(merchantAccount);
                const loanDetails = await merchantContract.activeLoan();
                
                expect(loanDetails.lender).to.equal(await investorPool.getAddress());
                expect(loanDetails.amount).to.equal(loanAmount);
                expect(loanDetails.period).to.equal(12);
            });

            it("Should fail getLoan if pool has insufficient funds", async function () {
                const { router, merchantFactory, usdeToken, user1, user2 } = await loadFixture(deployFixture);

                // Setup merchant account
                await merchantFactory.connect(user1).createAccount("Merchant1");

                // Deploy investor pool
                const InvestorPool = await ethers.getContractFactory("InvestorPool");
                const investorPool = await InvestorPool.deploy(
                    await router.getAddress(),
                    await usdeToken.getAddress(),
                    user2.address,
                    10,
                    12
                );
                await investorPool.waitForDeployment();

                // Try to get loan without pool funds
                const loanAmount = ethers.parseEther("1000");
                await expect(router.connect(user1).getLoan(await investorPool.getAddress(), loanAmount))
                    .to.be.revertedWith("Pool has no funds");
            });
        });

        describe("Direct Investor Offers", function () {
            it("Should process acceptOffer correctly", async function () {
                const { router, merchantFactory, investorFactory, usdeToken, user1, user2 } = await loadFixture(deployFixture);

                // Setup accounts
                await merchantFactory.connect(user1).createAccount("Merchant1");
                await investorFactory.connect(user2).createAccount("Investor1");

                const merchantAccount = await merchantFactory.getAccountAddress(user1.address);
                const investorAccount = await investorFactory.getAccountAddress(user2.address);

                // Fund investor account
                const loanAmount = ethers.parseEther("1000");
                await usdeToken.connect(user2).approve(investorAccount, loanAmount);
                await usdeToken.connect(user2).transfer(investorAccount, loanAmount);

                // Create loan offer from investor
                const InvestorAccount = await ethers.getContractFactory("InvestorAccount");
                const investorContract = InvestorAccount.attach(investorAccount);
                
                // Assuming your contract's makeOffer function has this signature:
                // function createOffer(address merchant, uint256 amount, uint256 interestRate, uint256 period, uint256 monthlyPayment)
                await investorContract.connect(user2).createOffer(
                    merchantAccount,
                    loanAmount,
                    10, // interest
                    12, // period
                    ethers.parseEther("100") // monthly repayment
                );

                // Accept offer
                await expect(router.connect(user1).acceptOffer(investorAccount, 0))
                    .to.emit(router, "LoanDisbursed")
                    .withArgs(
                        0, // loan ID
                        investorAccount,
                        merchantAccount,
                        loanAmount,
                        1 // loan category for direct offers
                    );

                // Verify loan details
                const MerchantAccount = await ethers.getContractFactory("MerchantAccount");
                const merchantContract = MerchantAccount.attach(merchantAccount);
                const loanDetails = await merchantContract.activeLoan();
                
                expect(loanDetails.lender).to.equal(investorAccount);
                expect(loanDetails.amount).to.equal(loanAmount);
                expect(loanDetails.period).to.equal(12);
            });

            it("Should fail acceptOffer for non-existent offer", async function () {
                const { router, merchantFactory, investorFactory, user1, user2 } = await loadFixture(deployFixture);

                // Setup accounts
                await merchantFactory.connect(user1).createAccount("Merchant1");
                await investorFactory.connect(user2).createAccount("Investor1");
                const investorAccount = await investorFactory.getAccountAddress(user2.address);

                // Try to accept non-existent offer
                await expect(router.connect(user1).acceptOffer(investorAccount, 999))
                    .to.be.revertedWithCustomError(router, "InvalidOfferId");
            });

            it("Should fail acceptOffer if offer already accepted", async function () {
                const { router, merchantFactory, investorFactory, usdeToken, user1, user2, user3 } = await loadFixture(deployFixture);

                // Setup accounts
                await merchantFactory.connect(user1).createAccount("Merchant1");
                await merchantFactory.connect(user3).createAccount("Merchant2");
                await investorFactory.connect(user2).createAccount("Investor1");

                const merchantAccount = await merchantFactory.getAccountAddress(user1.address);
                const investorAccount = await investorFactory.getAccountAddress(user2.address);

                // Fund investor account
                const loanAmount = ethers.parseEther("1000");
                await usdeToken.connect(user2).approve(investorAccount, loanAmount);
                await usdeToken.connect(user2).transfer(investorAccount, loanAmount);

                // Create offer
                const InvestorAccount = await ethers.getContractFactory("InvestorAccount");
                const investorContract = InvestorAccount.attach(investorAccount);
                
                await investorContract.connect(user2).createOffer(
                    merchantAccount,
                    loanAmount,
                    10,
                    12,
                    ethers.parseEther("100")
                );

                // First merchant accepts offer
                await router.connect(user1).acceptOffer(investorAccount, 0);

                // Second merchant tries to accept same offer
                await expect(router.connect(user3).acceptOffer(investorAccount, 0))
                    .to.be.revertedWithCustomError(router, "OfferAlreadyAccepted");
            });
        });
    });
}); 
const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Router Contract Tests", function () {
    let router, userFactory, merchant, user, investor, investorPool, usdeToken;
    let owner, addr1, addr2, addr3;
    
    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy USDE Token (mock)
        const USDE = await ethers.getContractFactory("MockUSDEToken");
        usdeToken = await USDE.deploy();
        await usdeToken.waitForDeployment();

        // Deploy Router
        const Router = await ethers.getContractFactory("Router");
        router = await Router.deploy();
        await router.waitForDeployment();

        // Deploy UserFactory
        const UserFactory = await ethers.getContractFactory("UserFactory");
        userFactory = await UserFactory.deploy(router.getAddress(), usdeToken.getAddress());
        await userFactory.waitForDeployment();

        await router.setFactory(userFactory.getAddress());

        // Deploy Merchant
        const Merchant = await ethers.getContractFactory("MerchantAccount");
        merchant = await Merchant.deploy(router.getAddress(), usdeToken.getAddress(), owner.address);
        await merchant.waitForDeployment();

        // Deploy InvestorPool
        const InvestorPool = await ethers.getContractFactory("InvestorPool");
        investorPool = await InvestorPool.deploy(router.getAddress(), usdeToken.getAddress(), owner.address, 10, 12);
        await investorPool.waitForDeployment();

        // Setup initial states
        await merchant.setFreeTrial(30 * 24 * 60 * 60); // 30 days
        await merchant.setPrice(1, ethers.parseEther("100")); // Tier 1 price
        await userFactory.connect(addr1).createAccount("User1", 0);
        await userFactory.connect(addr2).createAccount("User2", 1);
        await userFactory.connect(addr3).createAccount("User3", 2);
        
        // Fund accounts with USDE
        await usdeToken.mint(addr1.address, ethers.parseEther("10000"));
        await usdeToken.mint(addr2.address, ethers.parseEther("10000"));
        await usdeToken.mint(addr3.address, ethers.parseEther("10000"));
        await usdeToken.mint(investorPool.getAddress(), ethers.parseEther("100000"));
    });

    describe("Subscription Management", function () {
        it("Should successfully create a new subscription", async function () {
            const tier = 1;
            const merchantAddress = await merchant.getAddress();
            const userAccount = await userFactory.getAccountAddress(addr1.address);

            // Approve USDE spending
            await usdeToken.connect(addr1).approve(userAccount, ethers.parseEther("100"));

            await expect(router.connect(addr1).subscribe(tier, merchantAddress))
                .to.emit(router, "Subscription")
                .withArgs(
                    userAccount,
                    merchantAddress,
                    tier,
                    await time.latest()
                );
        });

        it("Should successfully cancel a subscription", async function () {
            const tier = 1;
            const merchantAddress = await merchant.getAddress();
            
            // Setup subscription first
            await router.connect(addr1).subscribe(tier, merchantAddress);

            // Get the user's account contract
            const userAccount = await ethers.getContractAt(
                "UserAccount", 
                await userFactory.getAccountAddress(addr1.address)
            );

            // Expect the unsubscribe call to not revert
            await expect(userAccount.connect(addr1).unsubscribe(merchantAddress))
                .to.not.be.reverted;
        });
    });

    describe("Loan Management", function () {
        beforeEach(async function () {
            await merchant.makeRequest(
                ethers.parseEther("1000"),
                10,
                10
            );
        });

        it("Should successfully process direct loan funding", async function () {
            const merchantAddress = await merchant.getAddress();
            const investorAccount = await userFactory.getAccountAddress(addr3.address);

            // USDE transfer
            await usdeToken.connect(addr3).transfer(investorAccount, ethers.parseEther("1000"));

            await expect(router.connect(addr3).fundRequest(merchantAddress))
                .to.emit(router, "LoanDisbursed")
                .withArgs(
                    investorAccount,
                    merchantAddress,
                    ethers.parseEther("1000"),
                    0
                );
        });

        it("Should successfully process loan offer acceptance", async function () {
            const merchantAccount = await userFactory.getAccountAddress(addr2.address);
            const investorAccount = await userFactory.getAccountAddress(addr3.address);
            const loanAmount = ethers.parseEther("1000");
            const investmentAmount = ethers.parseEther("3000");
            
            // USDE transfer to investor account for loan funding
            await usdeToken.connect(addr3).transfer(investorAccount, investmentAmount);


            const investor = await ethers.getContractAt(
                "InvestorAccount",    // The name of the contract's ABI to use
                investorAccount    // The address where the contract is deployed
            );

            // Setup: Create an offer from investor
            await investor.connect(addr3).makeOffer(
                loanAmount,    // loan amount
                10,           // interest rate
                10           // loan period
            );
    
            await expect(router.connect(addr2).acceptOffer(investorAccount, 0))
                .to.emit(router, "LoanDisbursed")
                .withArgs(
                    investorAccount,
                    merchantAccount,
                    loanAmount,
                    1  // loan category for offer-based loans
                );
        });

        it("Should successfully process pool loan request", async function () {
            const loanAmount = ethers.parseEther("10");
            const investmentAmount = ethers.parseEther("1000");
            const investorPoolAddress = await investorPool.getAddress();
            const merchantAccount = await userFactory.getAccountAddress(addr2.address);

            // Approve USDE spending
            await usdeToken.connect(addr3).approve(investorPoolAddress, investmentAmount);

            // Contribute to pool
            await investorPool.connect(addr3).contribute(await userFactory.getAccountAddress(addr3.address), investmentAmount);

            await expect(router.connect(addr2).getLoan(investorPoolAddress, loanAmount))
                .to.emit(router, "LoanDisbursed")
                .withArgs(
                    investorPoolAddress,
                    merchantAccount,
                    loanAmount,
                    2
                );
        });
    });

    describe("Payment Processing", function () {
        beforeEach(async function () {
            // Set up merchant loan
            const loanAmount = ethers.parseEther("1000");
            const investmentAmount = ethers.parseEther("2000");
            const investorPoolAddress = await investorPool.getAddress();
            const merchantAddress = await userFactory.getAccountAddress(addr2.address);

            // Set up subscription
            const tier = 1;
            await router.connect(addr1).subscribe(tier, merchantAddress);

            // Fund investor pool
            await usdeToken.connect(addr3).approve(investorPoolAddress, investmentAmount);
            await investorPool.connect(addr3).contribute(await userFactory.getAccountAddress(addr3.address), investmentAmount);
            
            // Get loan for merchant
            await router.connect(addr2).getLoan(investorPoolAddress, loanAmount);
        });

        it("Should successfully process subscription payment", async function () {
            const userAccount = await userFactory.getAccountAddress(addr1.address);
            const merchantAddress = await merchant.getAddress();
            const paymentAmount = ethers.parseEther("100");

            // USDE transfer
            await usdeToken.connect(addr1).transfer(userAccount, paymentAmount);

            await expect(merchant.chargeSubscription())
            .to.not.be.reverted;
        });

        it("Should successfully process loan repayment", async function () {
            const merchantAddress = await merchant.getAddress();
            const repaymentAmount = ethers.parseEther("100");

            await expect(router.connect(addr1).repayLoan(merchantAddress, repaymentAmount))
                .to.emit(router, "LoanRepayment")
                .withArgs(
                    await userFactory.getAccountAddress(addr1.address),
                    merchantAddress,
                    repaymentAmount,
                    await time.latest()
                );
        });
    });
});
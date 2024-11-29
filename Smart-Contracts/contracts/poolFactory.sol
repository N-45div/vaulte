// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./InvestorPool.sol";
contract PoolFactory is Ownable {
    /**
     * @notice Utilizing OpenZeppelin's Counters library for managing counters, which includes functions like increment, decrement, and reset.
     */
    using Counters for Counters.Counter;

    /**
     * @notice Counter for tracking the number of subscribtions.
     */
    Counters.Counter public _poolCount;

    /**
     * @notice Router contract address for handling pool operations
     * @dev Used in pool creation to set up new InvestorPool instances
     */
    address public routerAddress;

    /**
     * @notice USDE token contract address
     * @dev The stablecoin used for investments and loans in the pools
     */
    address public usde;

    /**
     * @notice Structure defining a pool's properties
     * @dev Used to store essential information about each created pool
     * @param poolName Name identifier for the pool
     * @param poolAddress Contract address of the deployed pool
     * @param owner Address of the pool creator/owner
     * @param interest Interest rate set for the pool's loans
     */
    struct pool {
        string poolName;
        address poolAddress;
        address owner;
        uint256 interest;
    }

    /**
     * @notice Mapping to store all created pools
     * @dev Maps pool ID to pool struct
     */
    mapping (uint256 => pool) public pools;

    /**
     * @notice Initializes the PoolFactory contract
     * @dev Sets up the router and USDE token addresses
     * @param _routerAddress Address of the router contract
     * @param usdeAddress Address of the USDE token contract
     */
    constructor(address _routerAddress, address usdeAddress) Ownable(msg.sender) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    /**
     * @notice Creates a new investment pool
     * @dev Deploys a new InvestorPool contract and stores its information
     * @param poolName Name of the pool to be created
     * @param interest Interest rate for loans in the pool
     * @param loanPeriod Duration of loans in the pool
     */
    function createPool(string memory poolName, uint256 interest, uint256 loanPeriod) external {
        InvestorPool newPool = new InvestorPool(routerAddress, usde, msg.sender, interest, loanPeriod);
        pools[_poolCount.current()].poolName = poolName;
        pools[_poolCount.current()].poolAddress = address(newPool);
        pools[_poolCount.current()].owner = msg.sender;
        pools[_poolCount.current()].interest = interest;
        _poolCount.increment();
    }

    /**
     * @notice Retrieves the contract address of a specific pool
     * @dev Returns the deployed contract address for the given pool ID
     * @param poolId The ID of the pool to query
     * @return address The contract address of the specified pool
     */
    function getPoolAddress(uint256 poolId) public view returns(address) {
        return pools[poolId].poolAddress;
    }
}
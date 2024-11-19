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

    address public routerAddress;
    address public usde;

    struct pool {
        string poolName;
        address poolAddress;
        address owner;
    }

    mapping (uint256 => pool) public pools;

    constructor(address _routerAddress, address usdeAddress) Ownable(msg.sender) {
        routerAddress = _routerAddress;
        usde = usdeAddress;
    }

    function createPool(string memory poolName, uint256 interest, uint256 loanPeriod) external {
        InvestorPool newPool = new InvestorPool(routerAddress, usde, msg.sender, interest, loanPeriod);
        pools[_poolCount.current()].poolName = poolName;
        pools[_poolCount.current()].poolAddress = address(newPool);
        pools[_poolCount.current()].owner = msg.sender;
        _poolCount.increment();
    }

    function getPoolAddress(uint256 poolId) public view returns(address) {
        return pools[poolId].poolAddress;
    }
}
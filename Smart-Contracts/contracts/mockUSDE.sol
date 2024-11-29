// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDEToken is ERC20, Ownable {
    uint8 private _decimals = 18;

    constructor() ERC20("Mock USDE Token", "USDE") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    // Function to mint new tokens (restricted to owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // Override decimals function if you want to use a different number of decimals
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // Optional: Function to change decimals (restricted to owner)
    function setDecimals(uint8 newDecimals) public onlyOwner {
        _decimals = newDecimals;
    }

    // Optional: Function to burn from a specific address (restricted to owner)
    function burnFrom(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
}
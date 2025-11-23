// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing on Sepolia testnet
 * Includes a faucet function to get test tokens
 */
contract MockUSDC is ERC20 {
    uint8 private _decimals = 6; // USDC uses 6 decimals

    constructor() ERC20("Mock USDC", "USDC") {
        // Mint initial supply to deployer for testing
        _mint(msg.sender, 1_000_000 * 10**_decimals); // 1M USDC
    }

    /**
     * @dev Faucet function - anyone can get 100 test USDC
     */
    function faucet() external {
        _mint(msg.sender, 100 * 10**_decimals); // 100 USDC
    }

    /**
     * @dev Override decimals to match USDC (6 decimals)
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}


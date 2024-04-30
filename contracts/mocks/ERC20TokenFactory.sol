// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "./ERC20Token.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract ERC20TokenFactory {
    address public mockTokenAddress;
    address public currentToken;

    event CreateToken(uint timestamp, address newToken, address creator);

    constructor(address _mockTokenAddress) {
        mockTokenAddress = _mockTokenAddress;
    }

    function setMockTokenAddress(address _newMockTokenAddress) public {
        mockTokenAddress = _newMockTokenAddress;
    }

    function createToken(
        string memory name,
        string memory symbol,
        uint8 decimal_
    ) public returns (address) {
        currentToken = Clones.clone(mockTokenAddress);

        ERC20Token token = ERC20Token(currentToken);
        token.initialize(name, symbol, decimal_);

        emit CreateToken(block.timestamp, currentToken, msg.sender);
        return currentToken;
    }
}

// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20withDec is IERC20 {
    /**
     * @dev Returns the symbol of tokens
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals of token
     */
    function decimals() external view returns (uint8);
}

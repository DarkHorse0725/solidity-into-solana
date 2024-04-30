// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";

contract ERC20Token is ERC20PermitUpgradeable {
    uint8 _decimals = 18;

    function initialize(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) public initializer {
        __ERC20Permit_init(name);
        __ERC20_init(name, symbol);
        // ERC20Upgradeable._mint(msg.sender, (10**9)*(10**18));
        setDecimals(decimals_);
    }

    function mint(address _to, uint _amount) public {
        ERC20Upgradeable._mint(_to, _amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function setDecimals(uint8 decimals_) public {
        _decimals = decimals_;
    }

    function burn(address _from, uint _amount) public {
        ERC20Upgradeable._burn(_from, _amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal override {
        string memory symbol = symbol();
        if (
            keccak256(abi.encodePacked(symbol)) ==
            keccak256(abi.encodePacked("USDT"))
        ) {
            require(
                !((amount != 0) && (allowance(msg.sender, spender) != 0)),
                "Approve USDT fail"
            );
        }
        super._approve(owner, spender, amount);
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "forge-std/Test.sol";

abstract contract BaseTest is Test {
    address internal constant ADMIN =
        0x9460b481366b7462af4f7991d430e5eB97FAAEB5;

    struct Impersonation {
        address sender;
        address origin;
    }

    Impersonation[] private _pranks;

    function setUp() public virtual {}

    /// @notice Execute a function body with msg.sender == `sender`
    modifier impersonating(address sender) {
        _startImpersonation(sender);
        _;
        _stopImpersonation();
    }

    /// @notice Stop the current prank and, push the `sender` prank onto the prank stack,
    /// and start the prank for `sender`
    function _startImpersonation(address sender) internal {
        _startImpersonation(sender, address(0));
    }

    function _startImpersonation(address sender, address origin) internal {
        if (_pranks.length > 0) {
            vm.stopPrank();
        }
        _pranks.push(Impersonation(sender, origin));
        if (origin != address(0)) {
            vm.startPrank(sender, origin);
        } else {
            vm.startPrank(sender);
        }
    }

    /// @notice Stop the current prank and pop it off the prank stack. If a previous
    /// prank was stopped by this impersonation, then resume it
    function _stopImpersonation() internal {
        vm.stopPrank();
        _pranks.pop();
        if (_pranks.length > 0) {
            Impersonation memory impersonation = _pranks[_pranks.length - 1];
            if (impersonation.origin != address(0)) {
                vm.startPrank(impersonation.sender, impersonation.origin);
            } else {
                vm.startPrank(impersonation.sender);
            }
        }
    }
}

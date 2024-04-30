// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {BaseTest, Vm, console} from "./BaseTest.t.sol";
import {IgnitionFactory, Errors} from "../../contracts/core/IgnitionFactory.sol";
import {Pool} from "../../contracts/core/Pool.sol";
import {Vesting} from "../../contracts/core/Vesting.sol";
import {ERC20Token} from "../../contracts/mock/ERC20Token.sol";
import {TestConstants} from "./TestConstants.t.sol";

contract IgnitionFactoryTest is BaseTest {
    IgnitionFactory public factory;
    Pool public poolImpl;
    Vesting public vestingImpl;

    event UpdatePoolImplementation(
        address indexed oldPoolImplementation,
        address indexed newPoolImplementation
    );

    event UpdateVestingImplementation(
        address indexed oldVestingImplementation,
        address indexed newVestingImplementation
    );

    event PoolCreated(bytes32 poolInfoHash, address pool);

    event VestingCreated(address sender, address vesting);

    function setUp() public override {
        super.setUp();
        factory = new IgnitionFactory();
    }

    function testGetLockupDuration() external {
        assertEq(factory.getLockupDuration(), 14 days);
    }

    function testGrantAdminRole() public {
        _testInitialize();
        assertEq(factory.hasRole(TestConstants.OWNER_ROLE, ADMIN), true);

        address alice = vm.addr(1);
        assertEq(factory.hasRole(TestConstants.OWNER_ROLE, alice), false);

        vm.prank(ADMIN);
        factory.grantRole(TestConstants.OWNER_ROLE, alice);

        address bob = vm.addr(2);
        vm.expectRevert();
        vm.prank(bob);
        factory.revokeRole(TestConstants.OWNER_ROLE, alice);
    }

    function testRevertInitialize() external {
        _testInitialize();
        vm.expectRevert();
        factory.initialize(address(0x1), address(0x1));
    }

    function testSetPoolAndVestingImplByAdmin() external impersonating(ADMIN) {
        _testInitialize();
        Pool newPoolImpl = new Pool();
        vm.expectEmit();
        emit UpdatePoolImplementation(
            factory.poolImplementationAddress(),
            address(newPoolImpl)
        );
        factory.setPoolImplementation(address(newPoolImpl));

        Vesting newVestingImpl = new Vesting();
        vm.expectEmit(false, true, false, false);
        emit UpdateVestingImplementation(
            factory.vestingImplementationAddress(),
            address(newVestingImpl)
        );

        factory.setVestingImplementation(address(newVestingImpl));
    }

    function testRevertSetPoolImplNotByAdmin() external {
        _testInitialize();
        Pool newPoolImpl = new Pool();
        vm.expectRevert(abi.encodePacked(Errors.CALLER_NOT_OWNER));
        factory.setPoolImplementation(address(newPoolImpl));

        Vesting newVestingImpl = new Vesting();
        vm.expectRevert(abi.encodePacked(Errors.CALLER_NOT_OWNER));
        factory.setVestingImplementation(address(newVestingImpl));

        vm.expectRevert(abi.encodePacked(Errors.ZERO_ADDRESS_NOT_VALID));
        vm.prank(ADMIN);
        factory.setPoolImplementation(address(0));

        vm.expectRevert(abi.encodePacked(Errors.ZERO_ADDRESS_NOT_VALID));
        vm.prank(ADMIN);
        factory.setVestingImplementation(address(0));
    }

    function testCreatePool() external {
        _testInitialize();
        ERC20Token IDOToken = new ERC20Token();
        ERC20Token purchaseToken = new ERC20Token();

        factory.createPool(
            [address(IDOToken), address(purchaseToken)],
            [
                10000 * TestConstants.SIX_DECIMALS,
                1000 * TestConstants.SIX_DECIMALS,
                1000,
                0,
                1000,
                2000,
                4000,
                9_000_000 * TestConstants.SIX_DECIMALS,
                block.timestamp + 3 * TestConstants.SECONDS_PER_DAY,
                TestConstants.SECONDS_PER_DAY,
                2 * TestConstants.SECONDS_PER_DAY,
                125_000_000_000_000,
                1,
                block.timestamp + 30 * TestConstants.SECONDS_PER_DAY,
                2000,
                5 * TestConstants.SECONDS_PER_HOUR,
                TestConstants.SECONDS_PER_DAY,
                10
            ],
            1
        );
    }

    function _testInitialize() private impersonating(ADMIN) {
        poolImpl = new Pool();
        vestingImpl = new Vesting();
        factory.initialize(address(poolImpl), address(vestingImpl));
    }
}

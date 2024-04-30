import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers"
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers, upgrades } from "hardhat"

import { ERC20Token } from "../../typechain-types/contracts/mocks/ERC20Token"
import { ERC20Token__factory } from "../../typechain-types/factories/contracts/mocks/ERC20Token__factory"

import { ERC20TokenFactory } from "../../typechain-types/contracts/mocks/ERC20TokenFactory"
import { ERC20TokenFactory__factory } from "../../typechain-types/factories/contracts/mocks/ERC20TokenFactory__factory"

import { expect } from "chai"
import { BigNumber, BigNumberish } from "ethers"
import { arrayify, hexlify, keccak256, parseUnits, solidityKeccak256, solidityPack } from "ethers/lib/utils"
import MerkleTree from "merkletreejs"
import { randomBytes } from "crypto"
import { BEP20TokenImplementation, BEP20TokenImplementation__factory, BEP20USDT, BEP20USDT__factory, Errors__factory, FiatTokenV2_1, FiatTokenV2_1__factory, IgnitionFactory, IgnitionFactory__factory, Pool, PoolLogic, PoolLogic__factory, Pool__factory, TetherToken, TetherToken__factory, Vesting, VestingLogic, VestingLogic__factory, Vesting__factory } from "../../typechain-types"
import { buildFundSignature } from "../../scripts/buildFundSignature"

describe("Ignition Pool With Vesting", () => {
    async function deployFactoryFixture() {

        function jsonCopy(src: any) {
            return JSON.parse(JSON.stringify(src));
        }

        function paddingTo32Bytes(str: string) {
            return str.padEnd(66, '0');
        }

        type PoolInfo = {
            IDOToken: string
            purchaseToken: string
            maxPurchaseAmountForKYCUser: BigNumberish
            maxPurchaseAmountForNotKYCUser: BigNumberish
            tokenFeePercentage: BigNumberish
            galaxyParticipationFeePercentage: BigNumberish
            crowdfundingParticipationFeePercentage: BigNumberish
            galaxyPoolProportion: BigNumberish
            earlyAccessProportion: BigNumberish
            totalRaiseAmount: BigNumberish
            whaleOpenTime: BigNumberish
            whaleDuration: BigNumberish
            communityDuration: BigNumberish
            rate: BigNumberish
            decimal: BigNumberish
            price: BigNumberish
            TGEDate: BigNumberish
            TGEPercentage: BigNumberish
            vestingCliff: BigNumberish
            vestingFrequency: BigNumberish
            numberOfVestingRelease: BigNumberish
        }

        let owner: SignerWithAddress
        let admin1: SignerWithAddress
        let admin2: SignerWithAddress
        let admin3: SignerWithAddress
        let collaborator0: SignerWithAddress
        let collaborator1: SignerWithAddress
        let collaborator2: SignerWithAddress
        let investors: SignerWithAddress[]
        let factory: IgnitionFactory
        let pool: Pool
        let poolLogic: PoolLogic
        let vesting: Vesting
        let vestingLogic: VestingLogic
        let purchaseTokens: ERC20Token[]
        let IDOTokens: ERC20Token[]
        let USDC_ETH: FiatTokenV2_1
        let USDT_ETH: TetherToken
        let poolInfoList: PoolInfo[]
        let erc20Sample: ERC20Token
        let erc20TokenFactory: ERC20TokenFactory
        let USDC_BSC: BEP20TokenImplementation
        let USDT_BSC: BEP20USDT

        const VestingFrequency = {
            MINUTE: BigNumber.from(60),
            HOUR: BigNumber.from(60 * 60),
            DAY: BigNumber.from(24 * 60 * 60),
            WEEK: BigNumber.from(7 * 24 * 60 * 60)
        }

        const Events = {
            Factory: {
                UpdatePoolImplementation: "UpdatePoolImplementation",
                UpdateVestingImplementation: "UpdateVestingImplementation",
                PoolCreated: "PoolCreated",
                VestingCreated: "VestingCreated"
            },
            Pool: {
                UpdateRoot: "UpdateRoot",
                CancelPool: "CancelPool",
                BuyToken: "BuyToken",
                UpdateTime: "UpdateTime",
                FundIDOToken: "FundIDOToken",
                ClaimTokenFee: "ClaimTokenFee",
                ClaimParticipationFee: "ClaimParticipationFee",
                WithdrawPurchasedAmount: "WithdrawPurchasedAmount",
                ClaimFund: "ClaimFund",
            },
            Vesting: {
                SetClaimableStatus: "SetClaimableStatus",
                UpdateTGEDate: "UpdateTGEDate",
                SetIDOTokenAddress: "SetIDOTokenAddress",
                SetEmergencyCancelled: "SetEmergencyCancelled",
                Funded: "Funded",
                WithdrawRedundantIDOToken: "WithdrawRedundantIDOToken",
                ClaimIDOToken: "ClaimIDOToken",
            }
        }

        const PERCENTAGE_DENOMINATOR = 10000;

        const { provider } = ethers;

        [owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, ...investors] = await ethers.getSigners();

        const errors = await new Errors__factory(owner).deploy()

        poolLogic = await new PoolLogic__factory(owner).deploy()
        vestingLogic = await new VestingLogic__factory(owner).deploy()

        pool = await new Pool__factory({
            ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
            ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
        }, owner).deploy();

        vesting = await new Vesting__factory({
            ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
        }, owner).deploy();


        const IgnitionFactory = await ethers.getContractFactory('IgnitionFactory');
        const ignitionFactory = await upgrades.deployProxy(IgnitionFactory, [pool.address, vesting.address]);

        factory = await IgnitionFactory.attach(ignitionFactory.address);

        erc20Sample = await new ERC20Token__factory(owner).deploy();
        erc20TokenFactory = await new ERC20TokenFactory__factory(owner).deploy(erc20Sample.address)

        // Create purchase token
        await erc20TokenFactory.connect(owner).createToken("PurchaseToken0", "PurchaseToken0", 6)
        const purchaseToken0Address = await erc20TokenFactory.currentToken()
        const purchaseToken0 = new ERC20Token__factory(owner).attach(purchaseToken0Address)

        await erc20TokenFactory.connect(owner).createToken("PurchaseToken1", "PurchaseToken1", 8)
        const purchaseToken1Address = await erc20TokenFactory.currentToken()
        const purchaseToken1 = new ERC20Token__factory(owner).attach(purchaseToken1Address)

        await erc20TokenFactory.connect(owner).createToken("PurchaseToken2", "PurchaseToken2", 18)
        const purchaseToken2Address = await erc20TokenFactory.currentToken()
        const purchaseToken2 = new ERC20Token__factory(owner).attach(purchaseToken2Address)

        await erc20TokenFactory.connect(owner).createToken("PurchaseToken3", "PurchaseToken3", 6)
        const purchaseToken3Address = await erc20TokenFactory.currentToken()
        const purchaseToken3 = new ERC20Token__factory(owner).attach(purchaseToken3Address)

        await erc20TokenFactory.connect(owner).createToken("PurchaseToken4", "PurchaseToken4", 6)
        const purchaseToken4Address = await erc20TokenFactory.currentToken()
        const purchaseToken4 = new ERC20Token__factory(owner).attach(purchaseToken4Address)

        USDC_ETH = await new FiatTokenV2_1__factory(owner).deploy();
        await USDC_ETH.initialize('USD Coin', 'USDC', 'USDC', 6, owner.address, owner.address, owner.address, owner.address)
        await USDC_ETH.initializeV2('USD Coin')
        await USDC_ETH.configureMinter(owner.address, parseUnits("1000000000000000000000000000", 30))
        await USDC_ETH.initializeV2_1(owner.address)

        USDT_ETH = await new TetherToken__factory(owner).deploy(parseUnits("1000000000000000000000000000", 30), 'Tether USD', 'USDT_ETH', 6)

        USDC_BSC = await new BEP20TokenImplementation__factory(owner).deploy()
        await USDC_BSC.initialize('Binance USDC', 'USDCBSC', 18, parseUnits('100000000000000000000000', 30), true, owner.address)

        USDT_BSC = await new BEP20USDT__factory(owner).deploy()

        purchaseTokens = [
            USDC_ETH as any, USDT_ETH as any, USDC_BSC as any, USDT_BSC as any, purchaseToken0, purchaseToken1, purchaseToken2, purchaseToken3, purchaseToken4
        ]

        for (let i = 0; i < purchaseTokens.length; i++) {
            for (let j = 0; j < investors.length; j++) {
                if ((await purchaseTokens[i].symbol()) == 'USDT_ETH') {
                    await USDT_ETH.connect(owner).issue(parseUnits('1000000', '30'))
                    await USDT_ETH.connect(owner).transfer(investors[j].address, parseUnits('1000000', '30'))
                } else if ((await purchaseTokens[i].symbol()) == 'USDCBSC') {
                    await USDC_BSC.connect(owner).mint(parseUnits('1000000', '30'))
                    await USDC_BSC.connect(owner).transfer(investors[j].address, parseUnits('1000000', '30'))
                } else if ((await purchaseTokens[i].symbol()) == 'USDT') { // BSC
                    await USDT_BSC.connect(owner).mint(parseUnits('1000000', '30'))
                    await USDT_BSC.connect(owner).transfer(investors[j].address, parseUnits('1000000', '30'))
                }
                else {
                    await purchaseTokens[i].connect(owner).mint(investors[j].address, parseUnits('1000000', '30'))
                }
            }
        }

        // Create IDO token
        await erc20TokenFactory.connect(owner).createToken("IDOToken0", "IDOToken0", 18)
        const IDOToken0Address = await erc20TokenFactory.currentToken()
        const IDOToken0 = new ERC20Token__factory(owner).attach(IDOToken0Address)

        await erc20TokenFactory.connect(owner).createToken("IDOToken1", "IDOToken1", 6)
        const IDOToken1Address = await erc20TokenFactory.currentToken()
        const IDOToken1 = new ERC20Token__factory(owner).attach(IDOToken1Address)

        await erc20TokenFactory.connect(owner).createToken("IDOToken2", "IDOToken2", 10)
        const IDOToken2Address = await erc20TokenFactory.currentToken()
        const IDOToken2 = new ERC20Token__factory(owner).attach(IDOToken2Address)

        await erc20TokenFactory.connect(owner).createToken("IDOToken3", "IDOToken3", 8)
        const IDOToken3Address = await erc20TokenFactory.currentToken()
        const IDOToken3 = new ERC20Token__factory(owner).attach(IDOToken3Address)

        await erc20TokenFactory.connect(owner).createToken("IDOToken4", "IDOToken4", 8)
        const IDOToken4Address = await erc20TokenFactory.currentToken()
        const IDOToken4 = new ERC20Token__factory(owner).attach(IDOToken4Address)

        IDOTokens = [
            IDOToken0, IDOToken1, IDOToken2, IDOToken3, IDOToken4
        ]

        await IDOTokens[0].connect(owner).mint(collaborator0.address, parseUnits('1000000', '30'))
        await IDOTokens[1].connect(owner).mint(collaborator1.address, parseUnits('1000000', '30'))

        poolInfoList = [
            {
                IDOToken: IDOTokens[0].address,
                purchaseToken: purchaseTokens[0].address,
                maxPurchaseAmountForKYCUser: parseUnits('10000', 6),
                maxPurchaseAmountForNotKYCUser: parseUnits('1000', 6),
                tokenFeePercentage: BigNumber.from('1000'),
                galaxyParticipationFeePercentage: BigNumber.from('0'),
                crowdfundingParticipationFeePercentage: BigNumber.from('1000'),
                galaxyPoolProportion: BigNumber.from('2000'),
                earlyAccessProportion: BigNumber.from('4000'),
                totalRaiseAmount: parseUnits('9000000', 6),
                whaleOpenTime: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(3 * 24 * 60 * 60),
                whaleDuration: BigNumber.from(24 * 60 * 60),
                communityDuration: BigNumber.from(48 * 60 * 60),
                rate: parseUnits('125', 12),
                decimal: BigNumber.from(1),
                price: 0.08,
                TGEDate: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(30 * 24 * 60 * 60),
                TGEPercentage: BigNumber.from('2000'),
                vestingCliff: BigNumber.from(5 * 60 * 60),
                vestingFrequency: VestingFrequency.DAY,
                numberOfVestingRelease: BigNumber.from(10)
            },
            {
                IDOToken: IDOTokens[1].address,
                purchaseToken: purchaseTokens[1].address,
                maxPurchaseAmountForKYCUser: parseUnits('30000', 6),
                maxPurchaseAmountForNotKYCUser: parseUnits('15000', 6),
                tokenFeePercentage: BigNumber.from('1500'),
                galaxyParticipationFeePercentage: BigNumber.from('0'),
                crowdfundingParticipationFeePercentage: BigNumber.from('1500'),
                galaxyPoolProportion: BigNumber.from('5000'),
                earlyAccessProportion: BigNumber.from('5000'),
                totalRaiseAmount: parseUnits('100000', 6),
                whaleOpenTime: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(3 * 24 * 60 * 60),
                whaleDuration: BigNumber.from(12 * 60 * 60),
                communityDuration: BigNumber.from(24 * 60 * 60),
                rate: BigNumber.from('35714285714285715'),
                decimal: BigNumber.from(15),
                price: 0.028,
                TGEDate: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(27 * 24 * 60 * 60),
                TGEPercentage: BigNumber.from('1000'),
                vestingCliff: BigNumber.from(5 * 24 * 60 * 60),
                vestingFrequency: VestingFrequency.WEEK,
                numberOfVestingRelease: BigNumber.from(50)
            },
            {
                // IDOToken: IDOTokens[2].address,
                IDOToken: ethers.constants.AddressZero,
                purchaseToken: purchaseTokens[2].address,
                maxPurchaseAmountForKYCUser: parseUnits('10000', 18),
                maxPurchaseAmountForNotKYCUser: parseUnits('1000', 18),
                tokenFeePercentage: BigNumber.from('1000'),
                galaxyParticipationFeePercentage: BigNumber.from('1000'),
                crowdfundingParticipationFeePercentage: BigNumber.from('1500'),
                galaxyPoolProportion: BigNumber.from('1000'),
                earlyAccessProportion: BigNumber.from('6000'),
                totalRaiseAmount: parseUnits('800000', 18),
                whaleOpenTime: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(3 * 24 * 60 * 60),
                whaleDuration: BigNumber.from(24 * 60 * 60),
                communityDuration: BigNumber.from(24 * 60 * 60),
                rate: BigNumber.from('6666666666666666'),
                decimal: BigNumber.from(24),
                price: 1.5,
                TGEDate: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(10 * 24 * 60 * 60),
                TGEPercentage: BigNumber.from('1000'),
                vestingCliff: BigNumber.from(5 * 60 * 60),
                vestingFrequency: VestingFrequency.MINUTE,
                numberOfVestingRelease: BigNumber.from(20)
            },
            {
                IDOToken: IDOTokens[3].address,
                purchaseToken: purchaseTokens[3].address,
                maxPurchaseAmountForKYCUser: parseUnits('2000', 6),
                maxPurchaseAmountForNotKYCUser: parseUnits('1000', 6),
                tokenFeePercentage: BigNumber.from('1000'),
                galaxyParticipationFeePercentage: BigNumber.from('0'),
                crowdfundingParticipationFeePercentage: BigNumber.from('1000'),
                galaxyPoolProportion: BigNumber.from('2000'),
                earlyAccessProportion: BigNumber.from('4000'),
                totalRaiseAmount: parseUnits('850000', 6),
                whaleOpenTime: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(3 * 24 * 60 * 60),
                whaleDuration: BigNumber.from(24 * 60 * 60),
                communityDuration: BigNumber.from(12 * 60 * 60),
                rate: BigNumber.from('1818181818181818100'),
                decimal: BigNumber.from(18),
                price: 55,
                TGEDate: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(30 * 24 * 60 * 60),
                TGEPercentage: BigNumber.from('3000'),
                vestingCliff: BigNumber.from(5 * 60 * 60),
                vestingFrequency: VestingFrequency.MINUTE,
                numberOfVestingRelease: BigNumber.from(20)
            },
            {
                IDOToken: IDOTokens[4].address,
                purchaseToken: purchaseTokens[4].address,
                maxPurchaseAmountForKYCUser: parseUnits('2000', 6),
                maxPurchaseAmountForNotKYCUser: parseUnits('1000', 6),
                tokenFeePercentage: BigNumber.from('500'),
                galaxyParticipationFeePercentage: BigNumber.from('0'),
                crowdfundingParticipationFeePercentage: BigNumber.from('1000'),
                galaxyPoolProportion: BigNumber.from('2000'),
                earlyAccessProportion: BigNumber.from('4000'),
                totalRaiseAmount: parseUnits('850000', 6),
                whaleOpenTime: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(3 * 24 * 60 * 60),
                whaleDuration: BigNumber.from(24 * 60 * 60),
                communityDuration: BigNumber.from(12 * 60 * 60),
                rate: BigNumber.from('1818181818181818100'),
                decimal: BigNumber.from(18),
                price: 55,
                TGEDate: BigNumber.from(Math.floor(Date.now() / 1000).toString()).add(30 * 24 * 60 * 60),
                TGEPercentage: BigNumber.from('3000'),
                vestingCliff: BigNumber.from(5 * 60 * 60),
                vestingFrequency: VestingFrequency.MINUTE,
                numberOfVestingRelease: BigNumber.from(20)
            },
        ]

        return {
            jsonCopy, paddingTo32Bytes, errors, VestingFrequency, Events, poolLogic, vestingLogic, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2,
            investors, factory, pool, vesting, provider, IDOTokens, purchaseTokens, poolInfoList, PERCENTAGE_DENOMINATOR
        }
    }

    describe("Factory", () => {
        it("Should deploy pool factory and initialize pool implementation address successfully", async () => {
            const { factory, pool, vesting } = await loadFixture(deployFactoryFixture)
            expect(factory.address).to.be.a.properAddress;
            expect(await factory.poolImplementationAddress()).to.be.equal(pool.address)
            expect(await factory.vestingImplementationAddress()).to.be.equal(vesting.address)
        })

        it("Should grant, revoke admin successfully by admin", async () => {
            const { owner, admin1, admin2, admin3, factory } = await loadFixture(deployFactoryFixture)
            expect(await factory.hasRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), owner.address)).to.be.true
            expect(await factory.hasRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)).to.be.false

            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)
            expect(await factory.hasRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)).to.be.true

            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin2.address)
            expect(await factory.hasRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin2.address)).to.be.true
            await factory.connect(owner).revokeRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin2.address)
            expect(await factory.hasRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin2.address)).to.be.false

            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)
            await factory.connect(owner).revokeRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin3.address)

            await expect(factory.connect(admin3).revokeRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin3.address)).to.be.reverted
        })

        it("Should set pool and vesting implementation address successfully by admin; revert set zero address; revert set pool and vesting implementation address not by admin", async () => {
            const { owner, admin1, admin2, factory, provider, errors, Events } = await loadFixture(deployFactoryFixture)
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            let randomPool = new ethers.Wallet(ethers.utils.randomBytes(32), provider);
            expect(await factory.connect(admin1).setPoolImplementation(randomPool.address)).to.be.emit(factory, Events.Factory.UpdatePoolImplementation)
            expect(await factory.poolImplementationAddress()).to.be.equal(randomPool.address)

            await expect(factory.connect(owner).setPoolImplementation(ethers.constants.AddressZero)).to.be.revertedWithCustomError(factory, 'ZeroAddressNotValid');
            await expect(factory.connect(admin2).setPoolImplementation(randomPool.address)).to.be.revertedWithCustomError(factory, 'CallerNotOwner');

            randomPool = new ethers.Wallet(ethers.utils.randomBytes(32), provider);
            expect(await factory.connect(admin1).setVestingImplementation(randomPool.address)).to.be.emit(factory, Events.Factory.UpdateVestingImplementation)
            expect(await factory.vestingImplementationAddress()).to.be.equal(randomPool.address)

            await expect(factory.connect(owner).setVestingImplementation(ethers.constants.AddressZero)).to.be.revertedWithCustomError(factory, 'ZeroAddressNotValid');
            await expect(factory.connect(admin2).setVestingImplementation(randomPool.address)).revertedWithCustomError(factory, 'CallerNotOwner');
        })

        it("Should create pool successfully; revert if not valid pool info", async () => {
            const { jsonCopy, paddingTo32Bytes, owner, pool, factory, poolInfoList, collaborator0, errors, Events } = await loadFixture(deployFactoryFixture)
            const poolInfo1 = jsonCopy(poolInfoList[0])
            expect(await factory.connect(collaborator0).createPool(
                [
                    poolInfo1.IDOToken,
                    poolInfo1.purchaseToken
                ],
                [
                    poolInfo1.maxPurchaseAmountForKYCUser,
                    poolInfo1.maxPurchaseAmountForNotKYCUser,
                    poolInfo1.tokenFeePercentage,
                    poolInfo1.galaxyParticipationFeePercentage,
                    poolInfo1.crowdfundingParticipationFeePercentage,
                    poolInfo1.galaxyPoolProportion,
                    poolInfo1.earlyAccessProportion,
                    poolInfo1.totalRaiseAmount,
                    poolInfo1.whaleOpenTime,
                    poolInfo1.whaleDuration,
                    poolInfo1.communityDuration,
                    poolInfo1.rate,
                    poolInfo1.decimal,
                    poolInfo1.TGEDate,
                    poolInfo1.TGEPercentage,
                    poolInfo1.vestingCliff,
                    poolInfo1.vestingFrequency,
                    poolInfo1.numberOfVestingRelease
                ],
                1671095858080
            )).to.be.emit(factory, Events.Factory.PoolCreated)

            let poolInfo4 = jsonCopy(poolInfoList[4])
            poolInfo4.purchaseToken = ethers.constants.AddressZero
            await expect(factory.connect(owner).createPool(
                [
                    poolInfo4.IDOToken,
                    poolInfo4.purchaseToken
                ],
                [
                    poolInfo4.maxPurchaseAmountForKYCUser,
                    poolInfo4.maxPurchaseAmountForNotKYCUser,
                    poolInfo4.tokenFeePercentage,
                    poolInfo4.galaxyParticipationFeePercentage,
                    poolInfo4.crowdfundingParticipationFeePercentage,
                    poolInfo4.galaxyPoolProportion,
                    poolInfo4.earlyAccessProportion,
                    poolInfo4.totalRaiseAmount,
                    poolInfo4.whaleOpenTime,
                    poolInfo4.whaleDuration,
                    poolInfo4.communityDuration,
                    poolInfo4.rate,
                    poolInfo4.decimal,
                    poolInfo4.TGEDate,
                    poolInfo4.TGEPercentage,
                    poolInfo4.vestingCliff,
                    poolInfo4.vestingFrequency,
                    poolInfo4.numberOfVestingRelease
                ], 1671095858080)).to.be.revertedWithCustomError(errors, 'ZeroAddressNotValid')
            {
                let poolInfo4 = jsonCopy(poolInfoList[4])
                poolInfo4.galaxyPoolProportion = BigNumber.from('100000')
                await expect(factory.connect(owner).createPool(
                    [
                        poolInfo4.IDOToken,
                        poolInfo4.purchaseToken
                    ],
                    [
                        poolInfo4.maxPurchaseAmountForKYCUser,
                        poolInfo4.maxPurchaseAmountForNotKYCUser,
                        poolInfo4.tokenFeePercentage,
                        poolInfo4.galaxyParticipationFeePercentage,
                        poolInfo4.crowdfundingParticipationFeePercentage,
                        poolInfo4.galaxyPoolProportion,
                        poolInfo4.earlyAccessProportion,
                        poolInfo4.totalRaiseAmount,
                        poolInfo4.whaleOpenTime,
                        poolInfo4.whaleDuration,
                        poolInfo4.communityDuration,
                        poolInfo4.rate,
                        poolInfo4.decimal,
                        poolInfo4.TGEDate,
                        poolInfo4.TGEPercentage,
                        poolInfo4.vestingCliff,
                        poolInfo4.vestingFrequency,
                        poolInfo4.numberOfVestingRelease
                    ], 1671095858080)).to.be.revertedWithCustomError(errors, 'InvalidGalaxyPoolProportion')
            }
            {
                let poolInfo4 = jsonCopy(poolInfoList[4])
                poolInfo4.earlyAccessProportion = BigNumber.from('23400')
                await expect(factory.connect(owner).createPool(
                    [
                        poolInfo4.IDOToken,
                        poolInfo4.purchaseToken
                    ],
                    [
                        poolInfo4.maxPurchaseAmountForKYCUser,
                        poolInfo4.maxPurchaseAmountForNotKYCUser,
                        poolInfo4.tokenFeePercentage,
                        poolInfo4.galaxyParticipationFeePercentage,
                        poolInfo4.crowdfundingParticipationFeePercentage,
                        poolInfo4.galaxyPoolProportion,
                        poolInfo4.earlyAccessProportion,
                        poolInfo4.totalRaiseAmount,
                        poolInfo4.whaleOpenTime,
                        poolInfo4.whaleDuration,
                        poolInfo4.communityDuration,
                        poolInfo4.rate,
                        poolInfo4.decimal,
                        poolInfo4.TGEDate,
                        poolInfo4.TGEPercentage,
                        poolInfo4.vestingCliff,
                        poolInfo4.vestingFrequency,
                        poolInfo4.numberOfVestingRelease
                    ], 1671095858080)).to.be.revertedWithCustomError(errors, 'InvalidEarlyAccessProportion')
            }
            {
                let poolInfo4 = jsonCopy(poolInfoList[4])
                poolInfo4.totalRaiseAmount = BigNumber.from(0)
                await expect(factory.connect(owner).createPool(
                    [
                        poolInfo4.IDOToken,
                        poolInfo4.purchaseToken
                    ],
                    [
                        poolInfo4.maxPurchaseAmountForKYCUser,
                        poolInfo4.maxPurchaseAmountForNotKYCUser,
                        poolInfo4.tokenFeePercentage,
                        poolInfo4.galaxyParticipationFeePercentage,
                        poolInfo4.crowdfundingParticipationFeePercentage,
                        poolInfo4.galaxyPoolProportion,
                        poolInfo4.earlyAccessProportion,
                        poolInfo4.totalRaiseAmount,
                        poolInfo4.whaleOpenTime,
                        poolInfo4.whaleDuration,
                        poolInfo4.communityDuration,
                        poolInfo4.rate,
                        poolInfo4.decimal,
                        poolInfo4.TGEDate,
                        poolInfo4.TGEPercentage,
                        poolInfo4.vestingCliff,
                        poolInfo4.vestingFrequency,
                        poolInfo4.numberOfVestingRelease
                    ], 1671095858080)).to.be.revertedWithCustomError(errors, 'ZeroAmountNotValid')


            }
            {
                let poolInfo4 = jsonCopy(poolInfoList[4])
                poolInfo4.TGEPercentage = BigNumber.from(10100)
                await expect(factory.connect(owner).createPool(
                    [
                        poolInfo4.IDOToken,
                        poolInfo4.purchaseToken
                    ],
                    [
                        poolInfo4.maxPurchaseAmountForKYCUser,
                        poolInfo4.maxPurchaseAmountForNotKYCUser,
                        poolInfo4.tokenFeePercentage,
                        poolInfo4.galaxyParticipationFeePercentage,
                        poolInfo4.crowdfundingParticipationFeePercentage,
                        poolInfo4.galaxyPoolProportion,
                        poolInfo4.earlyAccessProportion,
                        poolInfo4.totalRaiseAmount,
                        poolInfo4.whaleOpenTime,
                        poolInfo4.whaleDuration,
                        poolInfo4.communityDuration,
                        poolInfo4.rate,
                        poolInfo4.decimal,
                        poolInfo4.TGEDate,
                        poolInfo4.TGEPercentage,
                        poolInfo4.vestingCliff,
                        poolInfo4.vestingFrequency,
                        poolInfo4.numberOfVestingRelease
                    ], 1671095858080)).to.be.revertedWithCustomError(errors, 'InvalidTgePercentage')
            }
        })
    })

    describe("Buy with deployed IDO token and vesting with USDC", () => {
        async function deployPool0Fixture() {
            const { jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, vesting, poolLogic,
                poolInfoList, provider, IDOTokens, purchaseTokens, PERCENTAGE_DENOMINATOR, errors, Events, vestingLogic } = await loadFixture(deployFactoryFixture)
            const poolInfo0 = jsonCopy(poolInfoList[0])

            let tx
            let txRs
            tx = await factory.connect(collaborator0).createPool(
                [
                    poolInfo0.IDOToken,
                    poolInfo0.purchaseToken
                ],
                [
                    poolInfo0.maxPurchaseAmountForKYCUser,
                    poolInfo0.maxPurchaseAmountForNotKYCUser,
                    poolInfo0.tokenFeePercentage,
                    poolInfo0.galaxyParticipationFeePercentage,
                    poolInfo0.crowdfundingParticipationFeePercentage,
                    poolInfo0.galaxyPoolProportion,
                    poolInfo0.earlyAccessProportion,
                    poolInfo0.totalRaiseAmount,
                    poolInfo0.whaleOpenTime,
                    poolInfo0.whaleDuration,
                    poolInfo0.communityDuration,
                    poolInfo0.rate,
                    poolInfo0.decimal,
                    poolInfo0.TGEDate,
                    poolInfo0.TGEPercentage,
                    poolInfo0.vestingCliff,
                    poolInfo0.vestingFrequency,
                    poolInfo0.numberOfVestingRelease
                ],
                1671095858080
            )
            txRs = await tx.wait()
            // console.log(txRs.events)

            const abiCoder = new ethers.utils.AbiCoder()
            const encodeData = abiCoder.encode(
                ['address[2]', 'uint[18]', 'address', 'uint'],
                [
                    [poolInfo0.IDOToken, poolInfo0.purchaseToken],
                    [poolInfo0.maxPurchaseAmountForKYCUser, poolInfo0.maxPurchaseAmountForNotKYCUser, poolInfo0.tokenFeePercentage, poolInfo0.galaxyParticipationFeePercentage, poolInfo0.crowdfundingParticipationFeePercentage, poolInfo0.galaxyPoolProportion, poolInfo0.earlyAccessProportion, poolInfo0.totalRaiseAmount, poolInfo0.whaleOpenTime, poolInfo0.whaleDuration, poolInfo0.communityDuration, poolInfo0.rate, poolInfo0.decimal, poolInfo0.TGEDate, poolInfo0.TGEPercentage, poolInfo0.vestingCliff, poolInfo0.vestingFrequency, poolInfo0.numberOfVestingRelease],
                    collaborator0.address,
                    1671095858080
                ])
            const salt = solidityKeccak256(['bytes'], [encodeData])

            const poolMinimalByteCode = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' + pool.address.slice(2) + '5af43d82803e903d91602b57fd5bf3'
            const initCodeHash = solidityKeccak256(['bytes'], [arrayify(poolMinimalByteCode)])

            const pool0Address = ethers.utils.getCreate2Address(
                factory.address,
                salt,
                initCodeHash
            )

            const vesting0Address = ethers.utils.getContractAddress(
                {
                    from: factory.address,
                    nonce: 2
                }
            )
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            const pool0 = new Pool__factory({
                ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(pool0Address)
            expect(await pool0.vesting()).to.be.equal(vesting0Address)

            const vesting0 = new Vesting__factory({
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(vesting0Address)

            const WHALE_HASH = solidityKeccak256(["string"], ["WHALE"])
            const NORMAL_USER_HASH = solidityKeccak256(["string"], ["NORMAL_USER"])

            // whale: investors: 0, 1, 2, 3
            // normal_user: investors: 4, 5, 6
            // KYC_user: investors: 0, 1, 5

            // whale + KYC: 0,1    (1)
            // whale + notKYC: 2,3 (2)
            // normal + KYC: 5     (3)

            // leaf [address+WHALE+10_000+maxPurchaseBaseOnAllocation]: (1) (>> Galaxy pool)
            // leaf [address+WHALE+10_000+0]:                           (1) (>> Early access pool)
            // leaf [address+WHALE+1_000+maxPurchaseBaseOnAllocation]:  (2) (>> Galaxy pool)
            // leaf [address+WHALE+1_000+0]:                            (2) (>> Early access pool)
            // leaf [address+NORMAL_USER+10_000+0]:                     (3)+(1)

            const PAIDBalanceList = [
                75000, //0
                180000, //1
                93750, //2
                245750, //3
                18750, //4
                1000, //5
                10000, //6
            ]

            const allocationList = PAIDBalanceList.map((balance) => {
                return Math.floor(Number((balance / 75000)))
            })

            const allocationForGalaxyPool = allocationList.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );

            const maxPurchaseAmountForGalaxyPool_pool0 = BigNumber.from(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / PERCENTAGE_DENOMINATOR);

            const buyWhiteList = [
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[0])))
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[1])))
                },
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[2])))
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[3])))
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[4].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[6].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                }
            ]

            const leafNodes = buyWhiteList.map((obj) => {
                let leafNode = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [obj.candidate, obj.userType, obj.maxPurchaseWhetherOrNotKYC, obj.maxPurchaseBaseOnAllocation]
                );
                return ethers.utils.solidityKeccak256(["bytes"], [leafNode]);
            });

            const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
                sortPairs: true,
            });

            const buyRootHash = hexlify(buyMerkleTree.getRoot());

            function getProof(leafInfo: { candidate: string, userType: string, maxPurchaseWhetherOrNotKYC: number, maxPurchaseBaseOnAllocation: number }) {
                const leaf = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [leafInfo.candidate, leafInfo.userType, leafInfo.maxPurchaseWhetherOrNotKYC, leafInfo.maxPurchaseBaseOnAllocation]
                )
                const leafNode = solidityKeccak256(["bytes"], [leaf])
                const proof = buyMerkleTree.getHexProof(leafNode)
                return proof
            }


            return { getProof, PERCENTAGE_DENOMINATOR, buyMerkleTree, buyWhiteList, buyRootHash, jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, poolInfoList, provider, IDOTokens, purchaseTokens, pool0, vesting0, errors, Events }
        }
        it("Should get info from pool after created", async () => {
            const { jsonCopy, pool0, poolInfoList, vesting0 } = await loadFixture(deployPool0Fixture)
            const poolInfo0 = jsonCopy(poolInfoList[0])

            expect(await vesting0.IDOToken()).to.be.equal(poolInfo0.IDOToken)
            expect(await pool0.purchaseToken()).to.be.equal(poolInfo0.purchaseToken)
            expect((await pool0.offeredCurrency()).rate).to.be.equal(Number(poolInfo0.rate.hex))
            expect((await pool0.offeredCurrency()).decimal).to.be.equal(Number(poolInfo0.decimal.hex))
            expect(await pool0.maxPurchaseAmountForKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForKYCUser.hex))
            expect(await pool0.maxPurchaseAmountForNotKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex))
            expect(await vesting0.TGEPercentage()).to.be.equal(Number(poolInfo0.TGEPercentage.hex))
            expect(await pool0.galaxyParticipationFeePercentage()).to.be.equal(Number(poolInfo0.galaxyParticipationFeePercentage.hex))
            expect(await pool0.crowdfundingParticipationFeePercentage()).to.be.equal(Number(poolInfo0.crowdfundingParticipationFeePercentage.hex))
            expect(await pool0.galaxyPoolProportion()).to.be.equal(Number(poolInfo0.galaxyPoolProportion.hex))
            expect(await pool0.earlyAccessProportion()).to.be.equal(Number(poolInfo0.earlyAccessProportion.hex))
            expect(await pool0.totalRaiseAmount()).to.be.equal(Number(poolInfo0.totalRaiseAmount.hex))
            expect(await pool0.whaleOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.whaleCloseTime()).to.be.equal(Number(poolInfo0.whaleDuration.hex) + Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.communityCloseTime()).to.be.equal(Number(poolInfo0.communityDuration.hex) + Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))

            // expect(await pool0.maxPurchaseAmountForGalaxyPool()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / 10000))
            expect(await pool0.maxPurchaseAmountForEarlyAccess()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * (10000 - Number(poolInfo0.galaxyPoolProportion.hex)) * Number(poolInfo0.earlyAccessProportion.hex) / 10000 / 10000))
            expect(await pool0.communityOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))
        })

        it("Should set merkle tree root successfully by admin; revert without admin", async () => {
            const { pool0, buyRootHash, admin1, collaborator0, errors, Events } = await loadFixture(deployPool0Fixture)

            await pool0.connect(admin1).setRoot(buyRootHash);

            expect(await pool0.root()).to.be.equal(buyRootHash)

            const randomBuyRootHash = hexlify(randomBytes(32))

            await expect(pool0.connect(collaborator0).setRoot(randomBuyRootHash)).to.be.revertedWithCustomError(pool0, 'CallerNotAdmin')
        })

        it("Should close pool by admin; revert without admin", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).cancelPool(true)).to.be.emit(pool0, Events.Pool.CancelPool).withArgs(true);
            expect(await pool0.paused()).to.be.true;
        })

        it("Should update time includes whale close time, crowdfunding close time, TGE date", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).updateTGEDate((await pool0.communityCloseTime()).add(2 * 365 * 24 * 60 * 60))).to.be.emit(pool0, Events.Vesting.UpdateTGEDate)

            // No more than 2 years from initial
            expect(pool0.connect(admin1).updateTGEDate((await pool0.communityCloseTime()).add(3 * 365 * 24 * 60 * 60))).to.be.rejectedWith("42");

            expect(await pool0.connect(admin1).updateTGEDate((await pool0.communityCloseTime()).add(500))).to.be.emit(pool0, Events.Vesting.UpdateTGEDate)
            expect(pool0.connect(admin1).updateTGEDate((await pool0.communityCloseTime()).add(100))).to.be.revertedWith("39");

            expect(await pool0.connect(admin1).updateTime(await pool0.whaleCloseTime(), (await pool0.communityCloseTime()).add(50))).to.be.emit(pool0, Events.Pool.UpdateTime)
        })

        it("Should buy token in galaxy pool, early access and open time successfully by all types of user; revert out of time and vesting", async () => {
            const { owner, getProof, PERCENTAGE_DENOMINATOR, errors, Events, poolInfoList, collaborator0, IDOTokens, purchaseTokens, buyMerkleTree, pool0, admin1, buyRootHash, investors, buyWhiteList, vesting0 } = await loadFixture(deployPool0Fixture)

            // collaborator transfer IDO token to IDO pool
            // await IDOTokens[0].connect(collaborator0).transfer(pool0.address, parseUnits('1000000', '28'))

            // update root
            await pool0.connect(admin1).setRoot(buyRootHash)

            // get proof for investor0 in galaxy pool
            const leafInfo0 = buyWhiteList[0]
            const proof0 = getProof(leafInfo0)

            // revert TimeOutToBuyToken (buy before whaleOpentime)
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, 100000, leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // buy successfully (investor0, WHALE, KYC user, galaxy pool)
            await time.increaseTo(await pool0.whaleOpenTime())
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'NotEnoughAllowance')
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, ethers.constants.MaxUint256)
            await purchaseTokens[0].connect(investors[0]).approve(pool0.address, BigNumber.from(leafInfo0.maxPurchaseBaseOnAllocation).add(1000))
            expect(await pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)
            expect(await pool0.purchasedAmount()).to.be.equal(Number(parseUnits('90', 6)))
            expect((await pool0.userPurchasedAmount(investors[0].address)).principal).to.be.equal(Number(parseUnits('90', 6)))

            // get proof for investor1 in galaxy pool
            const leafInfo1 = buyWhiteList[1]
            const proof1 = getProof(leafInfo1)

            // revert buy more than max purchase amount for KYC user (investor1, WHALE, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[1]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[1]).approve(pool0.address, BigNumber.from(leafInfo1.maxPurchaseBaseOnAllocation))
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('11000', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof for investor2 in galaxy pool
            const leafInfo4 = buyWhiteList[4]
            const proof4 = getProof(leafInfo4)

            // buy successfully (investor2, WHALE, Not KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[2]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[2]).approve(pool0.address, BigNumber.from(leafInfo4.maxPurchaseBaseOnAllocation))
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('870', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // buy successfully twice (investor2, WHALE, Not KYC user, galaxy pool)
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('100', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase amount for Not KYC user in twice (investor2, WHALE, Not KYC user, galaxy pool)
            await expect(pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('50', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForNonKYCUser')

            // get proof for investor5
            const leafInfo8 = buyWhiteList[8]
            const proof8 = getProof(leafInfo8)

            // revert normal, KYC user buy in galaxy pool (investor4, NORMAL, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[5]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[5]).approve(pool0.address, parseUnits('1000000',20))
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, leafInfo8.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForUser')
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, 10)).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            // get proof for investor0 in early access
            const leaf0EA = buyWhiteList[2]
            const proof0EA = getProof(leaf0EA)

            // buy successfully (investor0, WHALE, KYC User, early access)
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, parseUnits('1000000',20))
            const balanceOfInvestor0BeforeBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0BeforeBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)
            const balanceOfInvestor0AfterBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0AfterBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect((balanceOfInvestor0AfterBuyToken).sub(balanceOfInvestor0BeforeBuyToken)).to.be.equal(parseUnits('-110', 6))
            expect((balanceOfPool0AfterBuyToken).sub(balanceOfPool0BeforeBuyToken)).to.be.equal(parseUnits('110', 6))

            // buy successfully upto max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('9800', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof of investor 3 for early access
            const leaf7EA = buyWhiteList[7]
            const proof7EA = getProof(leaf7EA)

            // buy successfully (investor3, WHALE, Not KYC User, early access)
            await purchaseTokens[0].connect(investors[3]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[3]).approve(pool0.address, parseUnits('10',20))
            expect(await pool0.connect(investors[3]).buyTokenInCrowdfundingPool(proof7EA, parseUnits('10', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy (investor5, NORMAL, KYC User, early access)
            await expect(pool0.connect(investors[5]).buyTokenInCrowdfundingPool(proof8, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            await time.increaseTo(await pool0.whaleCloseTime())

            // revert buy out of time for whale
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('100', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // get proof of investor 1 for community (not early access)
            const leaf10NU = buyWhiteList[10]
            const proof10NU = getProof(leaf10NU)

            // buy successfully (investor1, WHALE-NORMAL, KYC user, community pool)
            expect(await pool0.connect(investors[1]).buyTokenInCrowdfundingPool(proof10NU, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // get proof of investor 0 for community (not early access)
            const leaf9NU = buyWhiteList[9]
            const proof9NU = getProof(leaf9NU)

            // revert buy more than max purchase of KYC in galaxy, after in early access and lately in community pool (not early access) (investor0, WHALE, KYC User, community pool)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof9NU, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // buy successfully (investor6, NORMAL, Not KYC user, community pool)
            await purchaseTokens[0].connect(investors[6]).approve(pool0.address, ethers.constants.MaxUint256);
            // await purchaseTokens[0].connect(investors[6]).approve(pool0.address, parseUnits('100',20));
            const leaf17 = buyWhiteList[17]
            const proof17 = getProof(leaf17)

            expect(await pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            await time.increaseTo(await pool0.communityCloseTime())
            // revert buy because out of time
            await expect(pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // vesting
            // check vesting info
            expect((await vesting0.vestingAmountInfo(investors[0].address)).totalAmount).to.be.equal(parseUnits('124875', await IDOTokens[0].decimals())) // 1125 + 1250 + 122500 = 124875
            expect((await vesting0.vestingAmountInfo(investors[1].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[2].address)).totalAmount).to.be.equal(parseUnits('12125', await IDOTokens[0].decimals())) // 10875 + 1250 = 12125
            expect((await vesting0.vestingAmountInfo(investors[3].address)).totalAmount).to.be.equal(parseUnits('125', await IDOTokens[0].decimals())) // 125
            expect((await vesting0.vestingAmountInfo(investors[4].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[5].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[6].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[7].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))

            expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            expect(await pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, '0x')).to.be.emit(pool0, Events.Pool.FundIDOToken)
            expect(await IDOTokens[0].balanceOf(vesting0.address)).to.be.equal(await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            expect(await purchaseTokens[0].balanceOf(pool0.address)).to.be.equal(parseUnits('12181', await purchaseTokens[0].decimals())) // 11170 + 1011 = 12181
            expect(await pool0.participationFeeAmount()).to.be.equal(parseUnits('1011', await purchaseTokens[0].decimals())) // 1011
            await time.increaseTo(await vesting0.TGEDate())
            await time.increase(14 * 24 * 60 * 60)

            // participant fee: 1011, token fee + profit: 11170
            // claim participation fee and token fee by admin
            expect(await pool0.connect(owner).claimParticipationFee(owner.address)).to.changeTokenBalance(purchaseTokens[0], owner.address, parseUnits('1011', await purchaseTokens[0].decimals())).to.be.emit(pool0, Events.Pool.ClaimParticipationFee)
            const tokenFeeAmountWithDecimal = 11170 * (await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;
            expect(await pool0.connect(owner).claimTokenFee(owner.address)).to.changeTokenBalance(purchaseTokens[0], owner.address, tokenFeeAmountWithDecimal).to.be.emit(pool0, Events.Pool.ClaimTokenFee)
            const profitAmountWithDecimal = 11170 * (10000 - await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;

            // claim profit fee by collaborator and IDO token by investor
            expect(await pool0.connect(collaborator0).claimFund(collaborator0.address)).to.changeTokenBalance(purchaseTokens[0], collaborator0.address, profitAmountWithDecimal * (await vesting0.TGEPercentage()) / 10000)
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'AlreadyClaimTotalAmount')
            expect(await vesting0.connect(investors[0]).claimIDOToken(investors[0].address)).to.be.changeTokenBalance(IDOTokens[0], investors[0].address, parseUnits('124875', await IDOTokens[0].decimals()).mul(await vesting0.TGEPercentage()).div(10000))
            await expect(vesting0.connect(investors[0]).claimIDOToken(collaborator0.address)).to.be.revertedWithCustomError(vesting0, 'AlreadyClaimTotalAmount')
            expect(await vesting0.getClaimableAmount(investors[0].address)).to.be.equal(0)
            // expect(await pool0.getClaimableFundAmount()).to.be.equal(0)

            await time.increase(await vesting0.vestingCliff())
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'AlreadyClaimTotalAmount')
            await expect(vesting0.connect(investors[0]).claimIDOToken(investors[0].address)).to.be.revertedWithCustomError(vesting0, 'AlreadyClaimTotalAmount')
            expect(await vesting0.getClaimableAmount(investors[0].address)).to.be.equal(0)
            // expect(await pool0.getClaimableFundAmount()).to.be.equal(0)

            await time.increase(await vesting0.vestingFrequency())
            expect(await vesting0.getClaimableAmount(investors[0].address)).to.be.equal(0)
            // expect(await pool0.getClaimableFundAmount()).to.be.equal(0)

            expect(await pool0.connect(owner).setClaimableStatus(false)).to.be.emit(pool0, Events.Vesting.SetClaimableStatus)
            await expect(vesting0.connect(investors[0]).claimIDOToken(investors[0].address)).to.be.revertedWithCustomError(vesting0, 'NotAllowedToClaimIDOToken')
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'NotAllowedToClaimPurchaseToken')

            await pool0.connect(owner).setClaimableStatus(true)
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'AlreadyClaimTotalAmount')

            await time.increaseTo(BigNumber.from('2000000000'))
            await expect(vesting0.connect(investors[0]).claimIDOToken(investors[0].address)).to.be.revertedWithCustomError(vesting0, 'AlreadyClaimTotalAmount')
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'AlreadyClaimTotalAmount')

            expect((await vesting0.connect(investors[0]).vestingAmountInfo(investors[0].address)).claimedAmount).to.be.equal((await vesting0.connect(investors[0]).vestingAmountInfo(investors[0].address)).totalAmount)
            expect(await vesting0.getClaimableAmount(investors[0].address)).to.be.equal(0)

            // withdraw redundant IDO token by collaborator
            expect(await pool0.connect(collaborator0).withdrawRedundantIDOToken(collaborator0.address)).to.be.emit(pool0, Events.Vesting.WithdrawRedundantIDOToken)
        })
    })

    describe("Buy without IDO token and vesting", () => {
        async function deployPool0Fixture() {
            const { jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, vesting, poolLogic,
                poolInfoList, provider, IDOTokens, purchaseTokens, PERCENTAGE_DENOMINATOR, errors, Events, vestingLogic } = await loadFixture(deployFactoryFixture)
            let poolInfo0 = jsonCopy(poolInfoList[0])

            poolInfo0.IDOToken = ethers.constants.AddressZero
            let tx
            let txRs
            tx = await factory.connect(collaborator0).createPool(
                [
                    poolInfo0.IDOToken,
                    poolInfo0.purchaseToken
                ],
                [
                    poolInfo0.maxPurchaseAmountForKYCUser,
                    poolInfo0.maxPurchaseAmountForNotKYCUser,
                    poolInfo0.tokenFeePercentage,
                    poolInfo0.galaxyParticipationFeePercentage,
                    poolInfo0.crowdfundingParticipationFeePercentage,
                    poolInfo0.galaxyPoolProportion,
                    poolInfo0.earlyAccessProportion,
                    poolInfo0.totalRaiseAmount,
                    poolInfo0.whaleOpenTime,
                    poolInfo0.whaleDuration,
                    poolInfo0.communityDuration,
                    poolInfo0.rate,
                    poolInfo0.decimal,
                    poolInfo0.TGEDate,
                    poolInfo0.TGEPercentage,
                    poolInfo0.vestingCliff,
                    poolInfo0.vestingFrequency,
                    poolInfo0.numberOfVestingRelease
                ],
                1671095858080
            )
            txRs = await tx.wait()
            // console.log(txRs.events)

            const abiCoder = new ethers.utils.AbiCoder()
            const encodeData = abiCoder.encode(
                ['address[2]', 'uint[18]', 'address', 'uint'],
                [
                    [poolInfo0.IDOToken, poolInfo0.purchaseToken],
                    [poolInfo0.maxPurchaseAmountForKYCUser, poolInfo0.maxPurchaseAmountForNotKYCUser, poolInfo0.tokenFeePercentage, poolInfo0.galaxyParticipationFeePercentage, poolInfo0.crowdfundingParticipationFeePercentage, poolInfo0.galaxyPoolProportion, poolInfo0.earlyAccessProportion, poolInfo0.totalRaiseAmount, poolInfo0.whaleOpenTime, poolInfo0.whaleDuration, poolInfo0.communityDuration, poolInfo0.rate, poolInfo0.decimal, poolInfo0.TGEDate, poolInfo0.TGEPercentage, poolInfo0.vestingCliff, poolInfo0.vestingFrequency, poolInfo0.numberOfVestingRelease],
                    collaborator0.address,
                    1671095858080
                ])
            const salt = solidityKeccak256(['bytes'], [encodeData])

            const poolMinimalByteCode = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' + pool.address.slice(2) + '5af43d82803e903d91602b57fd5bf3'
            const initCodeHash = solidityKeccak256(['bytes'], [arrayify(poolMinimalByteCode)])

            const pool0Address = ethers.utils.getCreate2Address(
                factory.address,
                salt,
                initCodeHash
            )

            const vesting0Address = ethers.utils.getContractAddress(
                {
                    from: factory.address,
                    nonce: 2
                }
            )
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            const pool0 = new Pool__factory({
                ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(pool0Address)
            expect(await pool0.vesting()).to.be.equal(vesting0Address)

            const vesting0 = new Vesting__factory({
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(vesting0Address)

            const WHALE_HASH = solidityKeccak256(["string"], ["WHALE"])
            const NORMAL_USER_HASH = solidityKeccak256(["string"], ["NORMAL_USER"])

            // whale: investors: 0, 1, 2, 3
            // normal_user: investors: 4, 5, 6
            // KYC_user: investors: 0, 1, 5

            // whale + KYC: 0,1    (1)
            // whale + notKYC: 2,3 (2)
            // normal + KYC: 5     (3)

            // leaf [address+WHALE+10_000+maxPurchaseBaseOnAllocation]: (1) (>> Galaxy pool)
            // leaf [address+WHALE+10_000+0]:                           (1) (>> Early access pool)
            // leaf [address+WHALE+1_000+maxPurchaseBaseOnAllocation]:  (2) (>> Galaxy pool)
            // leaf [address+WHALE+1_000+0]:                            (2) (>> Early access pool)
            // leaf [address+NORMAL_USER+10_000+0]:                     (3)+(1)

            const PAIDBalanceList = [
                75000, //0
                180000, //1
                93750, //2
                245750, //3
                18750, //4
                1000, //5
                10000, //6
            ]

            const allocationList = PAIDBalanceList.map((balance) => {
                return Math.floor(Number((balance / 75000)))
            })

            const allocationForGalaxyPool = allocationList.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );

            const maxPurchaseAmountForGalaxyPool_pool0 = BigNumber.from(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / PERCENTAGE_DENOMINATOR);

            const buyWhiteList = [
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[0])))
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[1])))
                },
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[2])))
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[3])))
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[4].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[6].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                }
            ]

            const leafNodes = buyWhiteList.map((obj) => {
                let leafNode = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [obj.candidate, obj.userType, obj.maxPurchaseWhetherOrNotKYC, obj.maxPurchaseBaseOnAllocation]
                );
                return ethers.utils.solidityKeccak256(["bytes"], [leafNode]);
            });

            const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
                sortPairs: true,
            });

            const buyRootHash = hexlify(buyMerkleTree.getRoot());

            function getProof(leafInfo: { candidate: string, userType: string, maxPurchaseWhetherOrNotKYC: number, maxPurchaseBaseOnAllocation: number }) {
                const leaf = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [leafInfo.candidate, leafInfo.userType, leafInfo.maxPurchaseWhetherOrNotKYC, leafInfo.maxPurchaseBaseOnAllocation]
                )
                const leafNode = solidityKeccak256(["bytes"], [leaf])
                const proof = buyMerkleTree.getHexProof(leafNode)
                return proof
            }


            return { getProof, PERCENTAGE_DENOMINATOR, buyMerkleTree, buyWhiteList, buyRootHash, jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, poolInfoList, provider, IDOTokens, purchaseTokens, pool0, vesting0, errors, Events }
        }
        it("Should get info from pool after created", async () => {
            const { jsonCopy, pool0, poolInfoList, vesting0 } = await loadFixture(deployPool0Fixture)
            let poolInfo0 = jsonCopy(poolInfoList[0])
            poolInfo0.IDOToken = ethers.constants.AddressZero;

            expect(await vesting0.IDOToken()).to.be.equal(poolInfo0.IDOToken)
            expect(await pool0.purchaseToken()).to.be.equal(poolInfo0.purchaseToken)
            expect((await pool0.offeredCurrency()).rate).to.be.equal(Number(poolInfo0.rate.hex))
            expect((await pool0.offeredCurrency()).decimal).to.be.equal(Number(poolInfo0.decimal.hex))
            expect(await pool0.maxPurchaseAmountForKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForKYCUser.hex))
            expect(await pool0.maxPurchaseAmountForNotKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex))
            expect(await vesting0.TGEPercentage()).to.be.equal(Number(poolInfo0.TGEPercentage.hex))
            expect(await pool0.galaxyParticipationFeePercentage()).to.be.equal(Number(poolInfo0.galaxyParticipationFeePercentage.hex))
            expect(await pool0.crowdfundingParticipationFeePercentage()).to.be.equal(Number(poolInfo0.crowdfundingParticipationFeePercentage.hex))
            expect(await pool0.galaxyPoolProportion()).to.be.equal(Number(poolInfo0.galaxyPoolProportion.hex))
            expect(await pool0.earlyAccessProportion()).to.be.equal(Number(poolInfo0.earlyAccessProportion.hex))
            expect(await pool0.totalRaiseAmount()).to.be.equal(Number(poolInfo0.totalRaiseAmount.hex))
            expect(await pool0.whaleOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.whaleCloseTime()).to.be.equal(Number(poolInfo0.whaleDuration.hex) + Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.communityCloseTime()).to.be.equal(Number(poolInfo0.communityDuration.hex) + Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))

            // expect(await pool0.maxPurchaseAmountForGalaxyPool()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / 10000))
            expect(await pool0.maxPurchaseAmountForEarlyAccess()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * (10000 - Number(poolInfo0.galaxyPoolProportion.hex)) * Number(poolInfo0.earlyAccessProportion.hex) / 10000 / 10000))
            expect(await pool0.communityOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))
        })

        it("Should set merkle tree root successfully by admin; revert without admin", async () => {
            const { pool0, buyRootHash, admin1, collaborator0, errors, Events } = await loadFixture(deployPool0Fixture)

            await pool0.connect(admin1).setRoot(buyRootHash);

            expect(await pool0.root()).to.be.equal(buyRootHash)

            const randomBuyRootHash = hexlify(randomBytes(32))

            await expect(pool0.connect(collaborator0).setRoot(randomBuyRootHash)).to.be.revertedWithCustomError(pool0, 'CallerNotAdmin')
        })

        it("Should close pool by admin; revert without admin", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).cancelPool(true)).to.be.emit(pool0, Events.Pool.CancelPool).withArgs(true);
            expect(await pool0.paused()).to.be.true;
        })

        it("Should buy token in galaxy pool, early access and open time successfully by all types of user; revert out of time and vesting", async () => {
            const { owner, getProof, PERCENTAGE_DENOMINATOR, errors, Events, poolInfoList, collaborator0, IDOTokens, purchaseTokens, buyMerkleTree, pool0, admin1, buyRootHash, investors, buyWhiteList, vesting0 } = await loadFixture(deployPool0Fixture)

            // collaborator transfer IDO token to IDO pool
            // await IDOTokens[0].connect(collaborator0).transfer(pool0.address, parseUnits('1000000', '28'))

            // update root
            await pool0.connect(admin1).setRoot(buyRootHash)

            // get proof for investor0 in galaxy pool
            const leafInfo0 = buyWhiteList[0]
            const proof0 = getProof(leafInfo0)

            // revert TimeOutToBuyToken (buy before whaleOpentime)
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, 100000, leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // buy successfully (investor0, WHALE, KYC user, galaxy pool)
            await time.increaseTo(await pool0.whaleOpenTime())
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'NotEnoughAllowance')
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, ethers.constants.MaxUint256)
            await purchaseTokens[0].connect(investors[0]).approve(pool0.address, BigNumber.from(leafInfo0.maxPurchaseBaseOnAllocation).add(1000))
            expect(await pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)
            expect(await pool0.purchasedAmount()).to.be.equal(Number(parseUnits('90', 6)))
            expect((await pool0.userPurchasedAmount(investors[0].address)).principal).to.be.equal(Number(parseUnits('90', 6)))

            // get proof for investor1 in galaxy pool
            const leafInfo1 = buyWhiteList[1]
            const proof1 = getProof(leafInfo1)

            // revert buy more than max purchase amount for KYC user (investor1, WHALE, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[1]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[1]).approve(pool0.address, BigNumber.from(leafInfo1.maxPurchaseBaseOnAllocation))
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('11000', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof for investor2 in galaxy pool
            const leafInfo4 = buyWhiteList[4]
            const proof4 = getProof(leafInfo4)

            // buy successfully (investor2, WHALE, Not KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[2]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[2]).approve(pool0.address, BigNumber.from(leafInfo4.maxPurchaseBaseOnAllocation))
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('870', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // buy successfully twice (investor2, WHALE, Not KYC user, galaxy pool)
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('100', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase amount for Not KYC user in twice (investor2, WHALE, Not KYC user, galaxy pool)
            await expect(pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('50', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForNonKYCUser')

            // get proof for investor5
            const leafInfo8 = buyWhiteList[8]
            const proof8 = getProof(leafInfo8)

            // revert normal, KYC user buy in galaxy pool (investor4, NORMAL, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[5]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[5]).approve(pool0.address, parseUnits('1000000',20))
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, leafInfo8.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForUser')
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, 10)).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            // get proof for investor0 in early access
            const leaf0EA = buyWhiteList[2]
            const proof0EA = getProof(leaf0EA)

            // buy successfully (investor0, WHALE, KYC User, early access)
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, parseUnits('1000000',20))
            const balanceOfInvestor0BeforeBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0BeforeBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)
            const balanceOfInvestor0AfterBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0AfterBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect((balanceOfInvestor0AfterBuyToken).sub(balanceOfInvestor0BeforeBuyToken)).to.be.equal(parseUnits('-110', 6))
            expect((balanceOfPool0AfterBuyToken).sub(balanceOfPool0BeforeBuyToken)).to.be.equal(parseUnits('110', 6))

            // buy successfully upto max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('9800', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof of investor 3 for early access
            const leaf7EA = buyWhiteList[7]
            const proof7EA = getProof(leaf7EA)

            // buy successfully (investor3, WHALE, Not KYC User, early access)
            await purchaseTokens[0].connect(investors[3]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[3]).approve(pool0.address, parseUnits('10',20))
            expect(await pool0.connect(investors[3]).buyTokenInCrowdfundingPool(proof7EA, parseUnits('10', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy (investor5, NORMAL, KYC User, early access)
            await expect(pool0.connect(investors[5]).buyTokenInCrowdfundingPool(proof8, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            await time.increaseTo(await pool0.whaleCloseTime())

            // revert buy out of time for whale
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('100', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // get proof of investor 1 for community (not early access)
            const leaf10NU = buyWhiteList[10]
            const proof10NU = getProof(leaf10NU)

            // buy successfully (investor1, WHALE-NORMAL, KYC user, community pool)
            expect(await pool0.connect(investors[1]).buyTokenInCrowdfundingPool(proof10NU, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // get proof of investor 0 for community (not early access)
            const leaf9NU = buyWhiteList[9]
            const proof9NU = getProof(leaf9NU)

            // revert buy more than max purchase of KYC in galaxy, after in early access and lately in community pool (not early access) (investor0, WHALE, KYC User, community pool)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof9NU, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // buy successfully (investor6, NORMAL, Not KYC user, community pool)
            await purchaseTokens[0].connect(investors[6]).approve(pool0.address, ethers.constants.MaxUint256);
            // await purchaseTokens[0].connect(investors[6]).approve(pool0.address, parseUnits('100',20));
            const leaf17 = buyWhiteList[17]
            const proof17 = getProof(leaf17)

            expect(await pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            await time.increaseTo(await pool0.communityCloseTime())
            // revert buy because out of time
            await expect(pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // vesting
            // check vesting info
            expect((await vesting0.vestingAmountInfo(investors[0].address)).totalAmount).to.be.equal(parseUnits('124875', await IDOTokens[0].decimals())) // 1125 + 1250 + 122500 = 124875
            expect((await vesting0.vestingAmountInfo(investors[1].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[2].address)).totalAmount).to.be.equal(parseUnits('12125', await IDOTokens[0].decimals())) // 10875 + 1250 = 12125
            expect((await vesting0.vestingAmountInfo(investors[3].address)).totalAmount).to.be.equal(parseUnits('125', await IDOTokens[0].decimals())) // 125
            expect((await vesting0.vestingAmountInfo(investors[4].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[5].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[6].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[7].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))

            // fund IDO token by collaborator
            expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            const domain = {
                name: 'Pool',
                version: '1',
                chainId: 31337,
                verifyingContract: pool0.address
            }
            const signature = await buildFundSignature(owner, { ...domain }, IDOTokens[0].address, pool0.address, await IDOTokens[0].symbol(), await IDOTokens[0].decimals())
            expect(await pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, signature)).to.be.emit(pool0, Events.Pool.FundIDOToken)
            expect(await IDOTokens[0].balanceOf(vesting0.address)).to.be.equal(await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.purchasedAmount()))

            expect(await purchaseTokens[0].balanceOf(pool0.address)).to.be.equal(parseUnits('12181', await purchaseTokens[0].decimals())) // 11170 + 1011 = 12181
            expect(await pool0.participationFeeAmount()).to.be.equal(parseUnits('1011', await purchaseTokens[0].decimals())) // 1011
            await time.increaseTo(await vesting0.TGEDate())
            await time.increase(14 * 24 * 60 * 60)
            // participant fee: 1011, token fee + profit: 11170
            // claim participation fee and token fee by admin
            expect(await pool0.connect(owner).claimParticipationFee(owner.address)).to.changeTokenBalance(purchaseTokens[0], owner.address, parseUnits('1011', await purchaseTokens[0].decimals())).to.be.emit(pool0, Events.Pool.ClaimParticipationFee)
            const tokenFeeAmountWithDecimal = 11170 * (await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;
            expect(await pool0.connect(owner).claimTokenFee(owner.address)).to.changeTokenBalance(purchaseTokens[0], owner.address, tokenFeeAmountWithDecimal).to.be.emit(pool0, Events.Pool.ClaimTokenFee)
            const profitAmountWithDecimal = 11170 * (10000 - await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;

            // claim profit fee by collaborator and IDO token by investor
            expect(await pool0.connect(collaborator0).claimFund(collaborator0.address)).to.changeTokenBalance(purchaseTokens[0], collaborator0.address, profitAmountWithDecimal * (await vesting0.TGEPercentage()) / 10000)
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'AlreadyClaimTotalAmount')
            expect(await vesting0.connect(investors[0]).claimIDOToken(investors[0].address)).to.be.changeTokenBalance(IDOTokens[0], investors[0].address, parseUnits('124875', await IDOTokens[0].decimals()).mul(await vesting0.TGEPercentage()).div(10000))
            await expect(vesting0.connect(investors[0]).claimIDOToken(collaborator0.address)).to.be.revertedWithCustomError(vesting0, 'AlreadyClaimTotalAmount')

            await time.increase(await vesting0.vestingCliff())
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'AlreadyClaimTotalAmount')
            await expect(vesting0.connect(investors[0]).claimIDOToken(collaborator0.address)).to.be.revertedWithCustomError(vesting0, 'AlreadyClaimTotalAmount')
        })
    })

    describe("Pool is cancelled when buying", () => {
        async function deployPool0Fixture() {
            const { jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, vesting, poolLogic,
                poolInfoList, provider, IDOTokens, purchaseTokens, PERCENTAGE_DENOMINATOR, errors, Events, vestingLogic } = await loadFixture(deployFactoryFixture)
            const poolInfo0 = jsonCopy(poolInfoList[0])

            let tx
            let txRs
            tx = await factory.connect(collaborator0).createPool(
                [
                    poolInfo0.IDOToken,
                    poolInfo0.purchaseToken
                ],
                [
                    poolInfo0.maxPurchaseAmountForKYCUser,
                    poolInfo0.maxPurchaseAmountForNotKYCUser,
                    poolInfo0.tokenFeePercentage,
                    poolInfo0.galaxyParticipationFeePercentage,
                    poolInfo0.crowdfundingParticipationFeePercentage,
                    poolInfo0.galaxyPoolProportion,
                    poolInfo0.earlyAccessProportion,
                    poolInfo0.totalRaiseAmount,
                    poolInfo0.whaleOpenTime,
                    poolInfo0.whaleDuration,
                    poolInfo0.communityDuration,
                    poolInfo0.rate,
                    poolInfo0.decimal,
                    poolInfo0.TGEDate,
                    poolInfo0.TGEPercentage,
                    poolInfo0.vestingCliff,
                    poolInfo0.vestingFrequency,
                    poolInfo0.numberOfVestingRelease
                ],
                1671095858080
            )
            txRs = await tx.wait()
            // console.log(txRs.events)

            const abiCoder = new ethers.utils.AbiCoder()
            const encodeData = abiCoder.encode(
                ['address[2]', 'uint[18]', 'address', 'uint'],
                [
                    [poolInfo0.IDOToken, poolInfo0.purchaseToken],
                    [poolInfo0.maxPurchaseAmountForKYCUser, poolInfo0.maxPurchaseAmountForNotKYCUser, poolInfo0.tokenFeePercentage, poolInfo0.galaxyParticipationFeePercentage, poolInfo0.crowdfundingParticipationFeePercentage, poolInfo0.galaxyPoolProportion, poolInfo0.earlyAccessProportion, poolInfo0.totalRaiseAmount, poolInfo0.whaleOpenTime, poolInfo0.whaleDuration, poolInfo0.communityDuration, poolInfo0.rate, poolInfo0.decimal, poolInfo0.TGEDate, poolInfo0.TGEPercentage, poolInfo0.vestingCliff, poolInfo0.vestingFrequency, poolInfo0.numberOfVestingRelease],
                    collaborator0.address,
                    1671095858080
                ])
            const salt = solidityKeccak256(['bytes'], [encodeData])

            const poolMinimalByteCode = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' + pool.address.slice(2) + '5af43d82803e903d91602b57fd5bf3'
            const initCodeHash = solidityKeccak256(['bytes'], [arrayify(poolMinimalByteCode)])

            const pool0Address = ethers.utils.getCreate2Address(
                factory.address,
                salt,
                initCodeHash
            )

            const vesting0Address = ethers.utils.getContractAddress(
                {
                    from: factory.address,
                    nonce: 2
                }
            )
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            const pool0 = new Pool__factory({
                ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(pool0Address)
            expect(await pool0.vesting()).to.be.equal(vesting0Address)

            const vesting0 = new Vesting__factory({
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(vesting0Address)

            const WHALE_HASH = solidityKeccak256(["string"], ["WHALE"])
            const NORMAL_USER_HASH = solidityKeccak256(["string"], ["NORMAL_USER"])

            // whale: investors: 0, 1, 2, 3
            // normal_user: investors: 4, 5, 6
            // KYC_user: investors: 0, 1, 5

            // whale + KYC: 0,1    (1)
            // whale + notKYC: 2,3 (2)
            // normal + KYC: 5     (3)

            // leaf [address+WHALE+10_000+maxPurchaseBaseOnAllocation]: (1) (>> Galaxy pool)
            // leaf [address+WHALE+10_000+0]:                           (1) (>> Early access pool)
            // leaf [address+WHALE+1_000+maxPurchaseBaseOnAllocation]:  (2) (>> Galaxy pool)
            // leaf [address+WHALE+1_000+0]:                            (2) (>> Early access pool)
            // leaf [address+NORMAL_USER+10_000+0]:                     (3)+(1)

            const PAIDBalanceList = [
                75000, //0
                180000, //1
                93750, //2
                245750, //3
                18750, //4
                1000, //5
                10000, //6
            ]

            const allocationList = PAIDBalanceList.map((balance) => {
                return Math.floor(Number((balance / 75000)))
            })

            const allocationForGalaxyPool = allocationList.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );

            const maxPurchaseAmountForGalaxyPool_pool0 = BigNumber.from(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / PERCENTAGE_DENOMINATOR);

            const buyWhiteList = [
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[0])))
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[1])))
                },
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[2])))
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[3])))
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[4].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[6].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                }
            ]

            const leafNodes = buyWhiteList.map((obj) => {
                let leafNode = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [obj.candidate, obj.userType, obj.maxPurchaseWhetherOrNotKYC, obj.maxPurchaseBaseOnAllocation]
                );
                return ethers.utils.solidityKeccak256(["bytes"], [leafNode]);
            });

            const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
                sortPairs: true,
            });

            const buyRootHash = hexlify(buyMerkleTree.getRoot());

            function getProof(leafInfo: { candidate: string, userType: string, maxPurchaseWhetherOrNotKYC: number, maxPurchaseBaseOnAllocation: number }) {
                const leaf = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [leafInfo.candidate, leafInfo.userType, leafInfo.maxPurchaseWhetherOrNotKYC, leafInfo.maxPurchaseBaseOnAllocation]
                )
                const leafNode = solidityKeccak256(["bytes"], [leaf])
                const proof = buyMerkleTree.getHexProof(leafNode)
                return proof
            }


            return { getProof, PERCENTAGE_DENOMINATOR, buyMerkleTree, buyWhiteList, buyRootHash, jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, poolInfoList, provider, IDOTokens, purchaseTokens, pool0, vesting0, errors, Events }
        }
        it("Should get info from pool after created", async () => {
            const { jsonCopy, pool0, poolInfoList, vesting0 } = await loadFixture(deployPool0Fixture)
            const poolInfo0 = jsonCopy(poolInfoList[0])

            expect(await vesting0.IDOToken()).to.be.equal(poolInfo0.IDOToken)
            expect(await pool0.purchaseToken()).to.be.equal(poolInfo0.purchaseToken)
            expect((await pool0.offeredCurrency()).rate).to.be.equal(Number(poolInfo0.rate.hex))
            expect((await pool0.offeredCurrency()).decimal).to.be.equal(Number(poolInfo0.decimal.hex))
            expect(await pool0.maxPurchaseAmountForKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForKYCUser.hex))
            expect(await pool0.maxPurchaseAmountForNotKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex))
            expect(await vesting0.TGEPercentage()).to.be.equal(Number(poolInfo0.TGEPercentage.hex))
            expect(await pool0.galaxyParticipationFeePercentage()).to.be.equal(Number(poolInfo0.galaxyParticipationFeePercentage.hex))
            expect(await pool0.crowdfundingParticipationFeePercentage()).to.be.equal(Number(poolInfo0.crowdfundingParticipationFeePercentage.hex))
            expect(await pool0.galaxyPoolProportion()).to.be.equal(Number(poolInfo0.galaxyPoolProportion.hex))
            expect(await pool0.earlyAccessProportion()).to.be.equal(Number(poolInfo0.earlyAccessProportion.hex))
            expect(await pool0.totalRaiseAmount()).to.be.equal(Number(poolInfo0.totalRaiseAmount.hex))
            expect(await pool0.whaleOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.whaleCloseTime()).to.be.equal(Number(poolInfo0.whaleDuration.hex) + Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.communityCloseTime()).to.be.equal(Number(poolInfo0.communityDuration.hex) + Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))

            // expect(await pool0.maxPurchaseAmountForGalaxyPool()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / 10000))
            expect(await pool0.maxPurchaseAmountForEarlyAccess()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * (10000 - Number(poolInfo0.galaxyPoolProportion.hex)) * Number(poolInfo0.earlyAccessProportion.hex) / 10000 / 10000))
            expect(await pool0.communityOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))
        })

        it("Should set merkle tree root successfully by admin; revert without admin", async () => {
            const { pool0, buyRootHash, admin1, collaborator0, errors, Events } = await loadFixture(deployPool0Fixture)

            await pool0.connect(admin1).setRoot(buyRootHash);

            expect(await pool0.root()).to.be.equal(buyRootHash)

            const randomBuyRootHash = hexlify(randomBytes(32))

            await expect(pool0.connect(collaborator0).setRoot(randomBuyRootHash)).to.be.revertedWithCustomError(pool0, 'CallerNotAdmin')
        })

        it("Should close pool by admin; revert without admin", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).cancelPool(true)).to.be.emit(pool0, Events.Pool.CancelPool).withArgs(true);
            expect(await pool0.paused()).to.be.true;
        })

        it("Should buy token in galaxy pool, early access and open time successfully by all types of user; revert out of time and vesting", async () => {
            const { owner, getProof, PERCENTAGE_DENOMINATOR, errors, Events, poolInfoList, collaborator0, IDOTokens, purchaseTokens, buyMerkleTree, pool0, admin1, buyRootHash, investors, buyWhiteList, vesting0 } = await loadFixture(deployPool0Fixture)

            // collaborator transfer IDO token to IDO pool
            // await IDOTokens[0].connect(collaborator0).transfer(pool0.address, parseUnits('1000000', '28'))

            // update root
            await pool0.connect(admin1).setRoot(buyRootHash)

            // get proof for investor0 in galaxy pool
            const leafInfo0 = buyWhiteList[0]
            const proof0 = getProof(leafInfo0)

            // revert TimeOutToBuyToken (buy before whaleOpentime)
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, 100000, leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // buy successfully (investor0, WHALE, KYC user, galaxy pool)
            await time.increaseTo(await pool0.whaleOpenTime())
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'NotEnoughAllowance')
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, ethers.constants.MaxUint256)
            await purchaseTokens[0].connect(investors[0]).approve(pool0.address, BigNumber.from(leafInfo0.maxPurchaseBaseOnAllocation).add(1000))
            expect(await pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)
            expect(await pool0.purchasedAmount()).to.be.equal(Number(parseUnits('90', 6)))
            expect((await pool0.userPurchasedAmount(investors[0].address)).principal).to.be.equal(Number(parseUnits('90', 6)))

            // get proof for investor1 in galaxy pool
            const leafInfo1 = buyWhiteList[1]
            const proof1 = getProof(leafInfo1)

            // revert buy more than max purchase amount for KYC user (investor1, WHALE, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[1]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[1]).approve(pool0.address, BigNumber.from(leafInfo1.maxPurchaseBaseOnAllocation))
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('11000', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof for investor2 in galaxy pool
            const leafInfo4 = buyWhiteList[4]
            const proof4 = getProof(leafInfo4)

            // buy successfully (investor2, WHALE, Not KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[2]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[2]).approve(pool0.address, BigNumber.from(leafInfo4.maxPurchaseBaseOnAllocation))
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('870', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // buy successfully twice (investor2, WHALE, Not KYC user, galaxy pool)
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('100', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase amount for Not KYC user in twice (investor2, WHALE, Not KYC user, galaxy pool)
            await expect(pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('50', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForNonKYCUser')

            // get proof for investor5
            const leafInfo8 = buyWhiteList[8]
            const proof8 = getProof(leafInfo8)

            // revert normal, KYC user buy in galaxy pool (investor4, NORMAL, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[5]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[5]).approve(pool0.address, parseUnits('1000000',20))
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, leafInfo8.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForUser')
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, 10)).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            // get proof for investor0 in early access
            const leaf0EA = buyWhiteList[2]
            const proof0EA = getProof(leaf0EA)

            // buy successfully (investor0, WHALE, KYC User, early access)
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, parseUnits('1000000',20))
            const balanceOfInvestor0BeforeBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0BeforeBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)
            const balanceOfInvestor0AfterBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0AfterBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect((balanceOfInvestor0AfterBuyToken).sub(balanceOfInvestor0BeforeBuyToken)).to.be.equal(parseUnits('-110', 6))
            expect((balanceOfPool0AfterBuyToken).sub(balanceOfPool0BeforeBuyToken)).to.be.equal(parseUnits('110', 6))

            // buy successfully upto max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('9800', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof of investor 3 for early access
            const leaf7EA = buyWhiteList[7]
            const proof7EA = getProof(leaf7EA)

            // buy successfully (investor3, WHALE, Not KYC User, early access)
            await purchaseTokens[0].connect(investors[3]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[3]).approve(pool0.address, parseUnits('10',20))
            expect(await pool0.connect(investors[3]).buyTokenInCrowdfundingPool(proof7EA, parseUnits('10', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy (investor5, NORMAL, KYC User, early access)
            await expect(pool0.connect(investors[5]).buyTokenInCrowdfundingPool(proof8, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            await time.increaseTo(await pool0.whaleCloseTime())

            // revert buy out of time for whale
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('100', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // fund IDO token by collaborator
            expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            await pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, '0x')

            // admin cancel pool
            await pool0.connect(owner).cancelPool(true);

            // get proof of investor 1 for community (not early access)
            const leaf10NU = buyWhiteList[10]
            const proof10NU = getProof(leaf10NU)

            // buy successfully (investor1, WHALE-NORMAL, KYC user, community pool)
            await expect(pool0.connect(investors[1]).buyTokenInCrowdfundingPool(proof10NU, parseUnits('100', 6))).to.be.rejectedWith('Pausable: paused')

            // get proof of investor 0 for community (not early access)
            const leaf9NU = buyWhiteList[9]
            const proof9NU = getProof(leaf9NU)

            // revert buy more than max purchase of KYC in galaxy, after in early access and lately in community pool (not early access) (investor0, WHALE, KYC User, community pool)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof9NU, parseUnits('100', 6))).to.be.revertedWith('Pausable: paused')

            // buy successfully (investor6, NORMAL, Not KYC user, community pool)
            await purchaseTokens[0].connect(investors[6]).approve(pool0.address, ethers.constants.MaxUint256);
            // await purchaseTokens[0].connect(investors[6]).approve(pool0.address, parseUnits('100',20));
            const leaf17 = buyWhiteList[17]
            const proof17 = getProof(leaf17)

            await expect(pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('100', 6))).to.be.revertedWith('Pausable: paused')
            await time.increaseTo(await pool0.communityCloseTime())
            // revert buy because out of time
            await expect(pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('10', 6))).to.be.revertedWith('Pausable: paused')

            // vesting
            // check vesting info
            expect((await vesting0.vestingAmountInfo(investors[0].address)).totalAmount).to.be.equal(parseUnits('124875', await IDOTokens[0].decimals())) // 1125 + 1250 + 122500 = 124875
            expect((await vesting0.vestingAmountInfo(investors[1].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals())) // 0
            expect((await vesting0.vestingAmountInfo(investors[2].address)).totalAmount).to.be.equal(parseUnits('12125', await IDOTokens[0].decimals())) // 10875 + 1250 = 12125
            expect((await vesting0.vestingAmountInfo(investors[3].address)).totalAmount).to.be.equal(parseUnits('125', await IDOTokens[0].decimals())) // 125
            expect((await vesting0.vestingAmountInfo(investors[4].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[5].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[6].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals())) // 0
            expect((await vesting0.vestingAmountInfo(investors[7].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))

            await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            // fund IDO token by collaborator
            await expect(pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, '0x')).to.be.revertedWith('Pausable: paused')

            expect(await purchaseTokens[0].balanceOf(pool0.address)).to.be.equal(parseUnits('11961', await purchaseTokens[0].decimals())) // 10970 + 991 = 11961
            expect(await pool0.participationFeeAmount()).to.be.equal(parseUnits('991', await purchaseTokens[0].decimals())) // 991

            await time.increaseTo(await vesting0.TGEDate())

            // participant fee: 991, token fee + profit: 10970
            // claim participation fee by admin
            await expect(pool0.connect(owner).claimParticipationFee(owner.address)).to.be.revertedWith('Pausable: paused')
            await expect(pool0.connect(owner).claimTokenFee(owner.address)).to.be.revertedWith('Pausable: paused')

            // claim purchase amount by investor
            expect(await pool0.connect(investors[0]).withdrawPurchasedAmount(investors[0].address)).to.be.emit(pool0, Events.Pool.WithdrawPurchasedAmount).to.changeTokenBalance(purchaseTokens[0], investors[0].address, parseUnits('124875', await IDOTokens[0].decimals()))
            expect(await pool0.connect(collaborator0).withdrawRedundantIDOToken(collaborator0.address)).to.be.emit(pool0, Events.Vesting.WithdrawRedundantIDOToken)
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWith('Pausable: paused')
        })
    })

    describe("Pool with deployed IDO token is not funded before TGE date", () => {
        async function deployPool0Fixture() {
            const { jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, vesting, poolLogic,
                poolInfoList, provider, IDOTokens, purchaseTokens, PERCENTAGE_DENOMINATOR, errors, Events, vestingLogic } = await loadFixture(deployFactoryFixture)
            const poolInfo0 = jsonCopy(poolInfoList[0])

            let tx
            let txRs
            tx = await factory.connect(collaborator0).createPool(
                [
                    poolInfo0.IDOToken,
                    poolInfo0.purchaseToken
                ],
                [
                    poolInfo0.maxPurchaseAmountForKYCUser,
                    poolInfo0.maxPurchaseAmountForNotKYCUser,
                    poolInfo0.tokenFeePercentage,
                    poolInfo0.galaxyParticipationFeePercentage,
                    poolInfo0.crowdfundingParticipationFeePercentage,
                    poolInfo0.galaxyPoolProportion,
                    poolInfo0.earlyAccessProportion,
                    poolInfo0.totalRaiseAmount,
                    poolInfo0.whaleOpenTime,
                    poolInfo0.whaleDuration,
                    poolInfo0.communityDuration,
                    poolInfo0.rate,
                    poolInfo0.decimal,
                    poolInfo0.TGEDate,
                    poolInfo0.TGEPercentage,
                    poolInfo0.vestingCliff,
                    poolInfo0.vestingFrequency,
                    poolInfo0.numberOfVestingRelease
                ],
                1671095858080
            )
            txRs = await tx.wait()
            // console.log(txRs.events)

            const abiCoder = new ethers.utils.AbiCoder()
            const encodeData = abiCoder.encode(
                ['address[2]', 'uint[18]', 'address', 'uint'],
                [
                    [poolInfo0.IDOToken, poolInfo0.purchaseToken],
                    [poolInfo0.maxPurchaseAmountForKYCUser, poolInfo0.maxPurchaseAmountForNotKYCUser, poolInfo0.tokenFeePercentage, poolInfo0.galaxyParticipationFeePercentage, poolInfo0.crowdfundingParticipationFeePercentage, poolInfo0.galaxyPoolProportion, poolInfo0.earlyAccessProportion, poolInfo0.totalRaiseAmount, poolInfo0.whaleOpenTime, poolInfo0.whaleDuration, poolInfo0.communityDuration, poolInfo0.rate, poolInfo0.decimal, poolInfo0.TGEDate, poolInfo0.TGEPercentage, poolInfo0.vestingCliff, poolInfo0.vestingFrequency, poolInfo0.numberOfVestingRelease],
                    collaborator0.address,
                    1671095858080
                ])
            const salt = solidityKeccak256(['bytes'], [encodeData])

            const poolMinimalByteCode = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' + pool.address.slice(2) + '5af43d82803e903d91602b57fd5bf3'
            const initCodeHash = solidityKeccak256(['bytes'], [arrayify(poolMinimalByteCode)])

            const pool0Address = ethers.utils.getCreate2Address(
                factory.address,
                salt,
                initCodeHash
            )

            const vesting0Address = ethers.utils.getContractAddress(
                {
                    from: factory.address,
                    nonce: 2
                }
            )
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            const pool0 = new Pool__factory({
                ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(pool0Address)
            expect(await pool0.vesting()).to.be.equal(vesting0Address)

            const vesting0 = new Vesting__factory({
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(vesting0Address)

            const WHALE_HASH = solidityKeccak256(["string"], ["WHALE"])
            const NORMAL_USER_HASH = solidityKeccak256(["string"], ["NORMAL_USER"])

            // whale: investors: 0, 1, 2, 3
            // normal_user: investors: 4, 5, 6
            // KYC_user: investors: 0, 1, 5

            // whale + KYC: 0,1    (1)
            // whale + notKYC: 2,3 (2)
            // normal + KYC: 5     (3)

            // leaf [address+WHALE+10_000+maxPurchaseBaseOnAllocation]: (1) (>> Galaxy pool)
            // leaf [address+WHALE+10_000+0]:                           (1) (>> Early access pool)
            // leaf [address+WHALE+1_000+maxPurchaseBaseOnAllocation]:  (2) (>> Galaxy pool)
            // leaf [address+WHALE+1_000+0]:                            (2) (>> Early access pool)
            // leaf [address+NORMAL_USER+10_000+0]:                     (3)+(1)

            const PAIDBalanceList = [
                75000, //0
                180000, //1
                93750, //2
                245750, //3
                18750, //4
                1000, //5
                10000, //6
            ]

            const allocationList = PAIDBalanceList.map((balance) => {
                return Math.floor(Number((balance / 75000)))
            })

            const allocationForGalaxyPool = allocationList.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );

            const maxPurchaseAmountForGalaxyPool_pool0 = BigNumber.from(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / PERCENTAGE_DENOMINATOR);

            const buyWhiteList = [
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[0])))
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[1])))
                },
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[2])))
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[3])))
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[4].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[6].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                }
            ]

            const leafNodes = buyWhiteList.map((obj) => {
                let leafNode = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [obj.candidate, obj.userType, obj.maxPurchaseWhetherOrNotKYC, obj.maxPurchaseBaseOnAllocation]
                );
                return ethers.utils.solidityKeccak256(["bytes"], [leafNode]);
            });

            const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
                sortPairs: true,
            });

            const buyRootHash = hexlify(buyMerkleTree.getRoot());

            function getProof(leafInfo: { candidate: string, userType: string, maxPurchaseWhetherOrNotKYC: number, maxPurchaseBaseOnAllocation: number }) {
                const leaf = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [leafInfo.candidate, leafInfo.userType, leafInfo.maxPurchaseWhetherOrNotKYC, leafInfo.maxPurchaseBaseOnAllocation]
                )
                const leafNode = solidityKeccak256(["bytes"], [leaf])
                const proof = buyMerkleTree.getHexProof(leafNode)
                return proof
            }


            return { getProof, PERCENTAGE_DENOMINATOR, buyMerkleTree, buyWhiteList, buyRootHash, jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, poolInfoList, provider, IDOTokens, purchaseTokens, pool0, vesting0, errors, Events }
        }
        it("Should get info from pool after created", async () => {
            const { jsonCopy, pool0, poolInfoList, vesting0 } = await loadFixture(deployPool0Fixture)
            const poolInfo0 = jsonCopy(poolInfoList[0])

            expect(await vesting0.IDOToken()).to.be.equal(poolInfo0.IDOToken)
            expect(await pool0.purchaseToken()).to.be.equal(poolInfo0.purchaseToken)
            expect((await pool0.offeredCurrency()).rate).to.be.equal(Number(poolInfo0.rate.hex))
            expect((await pool0.offeredCurrency()).decimal).to.be.equal(Number(poolInfo0.decimal.hex))
            expect(await pool0.maxPurchaseAmountForKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForKYCUser.hex))
            expect(await pool0.maxPurchaseAmountForNotKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex))
            expect(await vesting0.TGEPercentage()).to.be.equal(Number(poolInfo0.TGEPercentage.hex))
            expect(await pool0.galaxyParticipationFeePercentage()).to.be.equal(Number(poolInfo0.galaxyParticipationFeePercentage.hex))
            expect(await pool0.crowdfundingParticipationFeePercentage()).to.be.equal(Number(poolInfo0.crowdfundingParticipationFeePercentage.hex))
            expect(await pool0.galaxyPoolProportion()).to.be.equal(Number(poolInfo0.galaxyPoolProportion.hex))
            expect(await pool0.earlyAccessProportion()).to.be.equal(Number(poolInfo0.earlyAccessProportion.hex))
            expect(await pool0.totalRaiseAmount()).to.be.equal(Number(poolInfo0.totalRaiseAmount.hex))
            expect(await pool0.whaleOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.whaleCloseTime()).to.be.equal(Number(poolInfo0.whaleDuration.hex) + Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.communityCloseTime()).to.be.equal(Number(poolInfo0.communityDuration.hex) + Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))

            // expect(await pool0.maxPurchaseAmountForGalaxyPool()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / 10000))
            expect(await pool0.maxPurchaseAmountForEarlyAccess()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * (10000 - Number(poolInfo0.galaxyPoolProportion.hex)) * Number(poolInfo0.earlyAccessProportion.hex) / 10000 / 10000))
            expect(await pool0.communityOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))
        })

        it("Should set merkle tree root successfully by admin; revert without admin", async () => {
            const { pool0, buyRootHash, admin1, collaborator0, errors, Events } = await loadFixture(deployPool0Fixture)

            await pool0.connect(admin1).setRoot(buyRootHash);

            expect(await pool0.root()).to.be.equal(buyRootHash)

            const randomBuyRootHash = hexlify(randomBytes(32))

            await expect(pool0.connect(collaborator0).setRoot(randomBuyRootHash)).to.be.revertedWithCustomError(pool0, 'CallerNotAdmin')
        })

        it("Should close pool by admin; revert without admin", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).cancelPool(true)).to.be.emit(pool0, Events.Pool.CancelPool).withArgs(true);
            expect(await pool0.paused()).to.be.true;
        })

        it("Should buy token in galaxy pool, early access and open time successfully by all types of user; revert out of time and vesting", async () => {
            const { owner, getProof, PERCENTAGE_DENOMINATOR, errors, Events, poolInfoList, collaborator0, IDOTokens, purchaseTokens, buyMerkleTree, pool0, admin1, buyRootHash, investors, buyWhiteList, vesting0 } = await loadFixture(deployPool0Fixture)

            // collaborator transfer IDO token to IDO pool
            // await IDOTokens[0].connect(collaborator0).transfer(pool0.address, parseUnits('1000000', '28'))

            // update root
            await pool0.connect(admin1).setRoot(buyRootHash)

            // get proof for investor0 in galaxy pool
            const leafInfo0 = buyWhiteList[0]
            const proof0 = getProof(leafInfo0)

            // revert TimeOutToBuyToken (buy before whaleOpentime)
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, 100000, leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // buy successfully (investor0, WHALE, KYC user, galaxy pool)
            await time.increaseTo(await pool0.whaleOpenTime())
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'NotEnoughAllowance')
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, ethers.constants.MaxUint256)
            await purchaseTokens[0].connect(investors[0]).approve(pool0.address, BigNumber.from(leafInfo0.maxPurchaseBaseOnAllocation).add(1000))
            expect(await pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)
            expect(await pool0.purchasedAmount()).to.be.equal(Number(parseUnits('90', 6)))
            expect((await pool0.userPurchasedAmount(investors[0].address)).principal).to.be.equal(Number(parseUnits('90', 6)))

            // get proof for investor1 in galaxy pool
            const leafInfo1 = buyWhiteList[1]
            const proof1 = getProof(leafInfo1)

            // revert buy more than max purchase amount for KYC user (investor1, WHALE, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[1]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[1]).approve(pool0.address, BigNumber.from(leafInfo1.maxPurchaseBaseOnAllocation))
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('11000', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof for investor2 in galaxy pool
            const leafInfo4 = buyWhiteList[4]
            const proof4 = getProof(leafInfo4)

            // buy successfully (investor2, WHALE, Not KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[2]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[2]).approve(pool0.address, BigNumber.from(leafInfo4.maxPurchaseBaseOnAllocation))
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('870', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // buy successfully twice (investor2, WHALE, Not KYC user, galaxy pool)
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('100', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase amount for Not KYC user in twice (investor2, WHALE, Not KYC user, galaxy pool)
            await expect(pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('50', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForNonKYCUser')

            // get proof for investor5
            const leafInfo8 = buyWhiteList[8]
            const proof8 = getProof(leafInfo8)

            // revert normal, KYC user buy in galaxy pool (investor4, NORMAL, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[5]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[5]).approve(pool0.address, parseUnits('1000000',20))
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, leafInfo8.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForUser')
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, 10)).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            // get proof for investor0 in early access
            const leaf0EA = buyWhiteList[2]
            const proof0EA = getProof(leaf0EA)

            // buy successfully (investor0, WHALE, KYC User, early access)
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, parseUnits('1000000',20))
            const balanceOfInvestor0BeforeBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0BeforeBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)
            const balanceOfInvestor0AfterBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0AfterBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect((balanceOfInvestor0AfterBuyToken).sub(balanceOfInvestor0BeforeBuyToken)).to.be.equal(parseUnits('-110', 6))
            expect((balanceOfPool0AfterBuyToken).sub(balanceOfPool0BeforeBuyToken)).to.be.equal(parseUnits('110', 6))

            // buy successfully upto max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('9800', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof of investor 3 for early access
            const leaf7EA = buyWhiteList[7]
            const proof7EA = getProof(leaf7EA)

            // buy successfully (investor3, WHALE, Not KYC User, early access)
            await purchaseTokens[0].connect(investors[3]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[3]).approve(pool0.address, parseUnits('10',20))
            expect(await pool0.connect(investors[3]).buyTokenInCrowdfundingPool(proof7EA, parseUnits('10', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy (investor5, NORMAL, KYC User, early access)
            await expect(pool0.connect(investors[5]).buyTokenInCrowdfundingPool(proof8, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            await time.increaseTo(await pool0.whaleCloseTime())

            // revert buy out of time for whale
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('100', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // get proof of investor 1 for community (not early access)
            const leaf10NU = buyWhiteList[10]
            const proof10NU = getProof(leaf10NU)

            // buy successfully (investor1, WHALE-NORMAL, KYC user, community pool)
            expect(await pool0.connect(investors[1]).buyTokenInCrowdfundingPool(proof10NU, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // get proof of investor 0 for community (not early access)
            const leaf9NU = buyWhiteList[9]
            const proof9NU = getProof(leaf9NU)

            // revert buy more than max purchase of KYC in galaxy, after in early access and lately in community pool (not early access) (investor0, WHALE, KYC User, community pool)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof9NU, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // buy successfully (investor6, NORMAL, Not KYC user, community pool)
            await purchaseTokens[0].connect(investors[6]).approve(pool0.address, ethers.constants.MaxUint256);
            // await purchaseTokens[0].connect(investors[6]).approve(pool0.address, parseUnits('100',20));
            const leaf17 = buyWhiteList[17]
            const proof17 = getProof(leaf17)

            expect(await pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            await time.increaseTo(await pool0.communityCloseTime())
            // revert buy because out of time
            await expect(pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // vesting
            // check vesting info
            expect((await vesting0.vestingAmountInfo(investors[0].address)).totalAmount).to.be.equal(parseUnits('124875', await IDOTokens[0].decimals())) // 1125 + 1250 + 122500 = 124875
            expect((await vesting0.vestingAmountInfo(investors[1].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[2].address)).totalAmount).to.be.equal(parseUnits('12125', await IDOTokens[0].decimals())) // 10875 + 1250 = 12125
            expect((await vesting0.vestingAmountInfo(investors[3].address)).totalAmount).to.be.equal(parseUnits('125', await IDOTokens[0].decimals())) // 125
            expect((await vesting0.vestingAmountInfo(investors[4].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[5].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[6].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[7].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))

            // // fund IDO token by collaborator
            // expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            // await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            // await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            // expect(await pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, '0x')).to.be.emit(pool0, Events.Pool.FundIDOToken)
            // expect(await IDOTokens[0].balanceOf(vesting0.address)).to.be.equal(await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            // expect(await purchaseTokens[0].balanceOf(pool0.address)).to.be.equal(parseUnits('12181', await purchaseTokens[0].decimals())) // 11170 + 1011 = 12181
            // expect(await pool0.participationFeeAmount()).to.be.equal(parseUnits('1011', await purchaseTokens[0].decimals())) // 1011
            await time.increaseTo(await vesting0.TGEDate())

            // participant fee: 1011, token fee + profit: 11170
            // claim participation fee and token fee by admin
            await expect(pool0.connect(owner).claimParticipationFee(owner.address)).to.be.revertedWithCustomError(pool0, 'NotFunded')
            const tokenFeeAmountWithDecimal = 11170 * (await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;
            // expect(await pool0.connect(owner).claimTokenFee(owner.address)).to.changeTokenBalance(purchaseTokens[0], owner.address, tokenFeeAmountWithDecimal).to.be.emit(pool0, Events.Pool.ClaimTokenFee)
            // const profitAmountWithDecimal = 11170 * (10000 - await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;
            await expect(pool0.connect(owner).claimTokenFee(owner.address)).to.be.revertedWithCustomError(pool0, 'NotFunded')

            // fund IDO token by collaborator
            expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await expect(pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, '0x')).to.be.revertedWithCustomError(pool0, 'NotAllowedToDoAfterTGEDate')

            // claim purchase amount by investor
            expect(await pool0.connect(investors[0]).withdrawPurchasedAmount(investors[0].address)).to.be.emit(pool0, Events.Pool.WithdrawPurchasedAmount).to.changeTokenBalance(purchaseTokens[0], investors[0].address, parseUnits('124875', await IDOTokens[0].decimals()))
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'NotFunded')
        })
    })

    describe("Pool without prefix IDO token is not funded before TEG date", () => {
        async function deployPool0Fixture() {
            const { jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, vesting, poolLogic,
                poolInfoList, provider, IDOTokens, purchaseTokens, PERCENTAGE_DENOMINATOR, errors, Events, vestingLogic } = await loadFixture(deployFactoryFixture)
            let poolInfo0 = jsonCopy(poolInfoList[0])

            poolInfo0.IDOToken = ethers.constants.AddressZero
            let tx
            let txRs
            tx = await factory.connect(collaborator0).createPool(
                [
                    poolInfo0.IDOToken,
                    poolInfo0.purchaseToken
                ],
                [
                    poolInfo0.maxPurchaseAmountForKYCUser,
                    poolInfo0.maxPurchaseAmountForNotKYCUser,
                    poolInfo0.tokenFeePercentage,
                    poolInfo0.galaxyParticipationFeePercentage,
                    poolInfo0.crowdfundingParticipationFeePercentage,
                    poolInfo0.galaxyPoolProportion,
                    poolInfo0.earlyAccessProportion,
                    poolInfo0.totalRaiseAmount,
                    poolInfo0.whaleOpenTime,
                    poolInfo0.whaleDuration,
                    poolInfo0.communityDuration,
                    poolInfo0.rate,
                    poolInfo0.decimal,
                    poolInfo0.TGEDate,
                    poolInfo0.TGEPercentage,
                    poolInfo0.vestingCliff,
                    poolInfo0.vestingFrequency,
                    poolInfo0.numberOfVestingRelease
                ],
                1671095858080
            )
            txRs = await tx.wait()
            // console.log(txRs.events)

            const abiCoder = new ethers.utils.AbiCoder()
            const encodeData = abiCoder.encode(
                ['address[2]', 'uint[18]', 'address', 'uint'],
                [
                    [poolInfo0.IDOToken, poolInfo0.purchaseToken],
                    [poolInfo0.maxPurchaseAmountForKYCUser, poolInfo0.maxPurchaseAmountForNotKYCUser, poolInfo0.tokenFeePercentage, poolInfo0.galaxyParticipationFeePercentage, poolInfo0.crowdfundingParticipationFeePercentage, poolInfo0.galaxyPoolProportion, poolInfo0.earlyAccessProportion, poolInfo0.totalRaiseAmount, poolInfo0.whaleOpenTime, poolInfo0.whaleDuration, poolInfo0.communityDuration, poolInfo0.rate, poolInfo0.decimal, poolInfo0.TGEDate, poolInfo0.TGEPercentage, poolInfo0.vestingCliff, poolInfo0.vestingFrequency, poolInfo0.numberOfVestingRelease],
                    collaborator0.address,
                    1671095858080
                ])
            const salt = solidityKeccak256(['bytes'], [encodeData])

            const poolMinimalByteCode = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' + pool.address.slice(2) + '5af43d82803e903d91602b57fd5bf3'
            const initCodeHash = solidityKeccak256(['bytes'], [arrayify(poolMinimalByteCode)])

            const pool0Address = ethers.utils.getCreate2Address(
                factory.address,
                salt,
                initCodeHash
            )

            const vesting0Address = ethers.utils.getContractAddress(
                {
                    from: factory.address,
                    nonce: 2
                }
            )
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            const pool0 = new Pool__factory({
                ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(pool0Address)
            expect(await pool0.vesting()).to.be.equal(vesting0Address)

            const vesting0 = new Vesting__factory({
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(vesting0Address)

            const WHALE_HASH = solidityKeccak256(["string"], ["WHALE"])
            const NORMAL_USER_HASH = solidityKeccak256(["string"], ["NORMAL_USER"])

            // whale: investors: 0, 1, 2, 3
            // normal_user: investors: 4, 5, 6
            // KYC_user: investors: 0, 1, 5

            // whale + KYC: 0,1    (1)
            // whale + notKYC: 2,3 (2)
            // normal + KYC: 5     (3)

            // leaf [address+WHALE+10_000+maxPurchaseBaseOnAllocation]: (1) (>> Galaxy pool)
            // leaf [address+WHALE+10_000+0]:                           (1) (>> Early access pool)
            // leaf [address+WHALE+1_000+maxPurchaseBaseOnAllocation]:  (2) (>> Galaxy pool)
            // leaf [address+WHALE+1_000+0]:                            (2) (>> Early access pool)
            // leaf [address+NORMAL_USER+10_000+0]:                     (3)+(1)

            const PAIDBalanceList = [
                75000, //0
                180000, //1
                93750, //2
                245750, //3
                18750, //4
                1000, //5
                10000, //6
            ]

            const allocationList = PAIDBalanceList.map((balance) => {
                return Math.floor(Number((balance / 75000)))
            })

            const allocationForGalaxyPool = allocationList.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );

            const maxPurchaseAmountForGalaxyPool_pool0 = BigNumber.from(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / PERCENTAGE_DENOMINATOR);

            const buyWhiteList = [
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[0])))
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[1])))
                },
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[2])))
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[3])))
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[4].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[6].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                }
            ]

            const leafNodes = buyWhiteList.map((obj) => {
                let leafNode = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [obj.candidate, obj.userType, obj.maxPurchaseWhetherOrNotKYC, obj.maxPurchaseBaseOnAllocation]
                );
                return ethers.utils.solidityKeccak256(["bytes"], [leafNode]);
            });

            const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
                sortPairs: true,
            });

            const buyRootHash = hexlify(buyMerkleTree.getRoot());

            function getProof(leafInfo: { candidate: string, userType: string, maxPurchaseWhetherOrNotKYC: number, maxPurchaseBaseOnAllocation: number }) {
                const leaf = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [leafInfo.candidate, leafInfo.userType, leafInfo.maxPurchaseWhetherOrNotKYC, leafInfo.maxPurchaseBaseOnAllocation]
                )
                const leafNode = solidityKeccak256(["bytes"], [leaf])
                const proof = buyMerkleTree.getHexProof(leafNode)
                return proof
            }


            return { getProof, PERCENTAGE_DENOMINATOR, buyMerkleTree, buyWhiteList, buyRootHash, jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, poolInfoList, provider, IDOTokens, purchaseTokens, pool0, vesting0, errors, Events }
        }
        it("Should get info from pool after created", async () => {
            const { jsonCopy, pool0, poolInfoList, vesting0 } = await loadFixture(deployPool0Fixture)
            let poolInfo0 = jsonCopy(poolInfoList[0])
            poolInfo0.IDOToken = ethers.constants.AddressZero;

            expect(await vesting0.IDOToken()).to.be.equal(poolInfo0.IDOToken)
            expect(await pool0.purchaseToken()).to.be.equal(poolInfo0.purchaseToken)
            expect((await pool0.offeredCurrency()).rate).to.be.equal(Number(poolInfo0.rate.hex))
            expect((await pool0.offeredCurrency()).decimal).to.be.equal(Number(poolInfo0.decimal.hex))
            expect(await pool0.maxPurchaseAmountForKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForKYCUser.hex))
            expect(await pool0.maxPurchaseAmountForNotKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex))
            expect(await vesting0.TGEPercentage()).to.be.equal(Number(poolInfo0.TGEPercentage.hex))
            expect(await pool0.galaxyParticipationFeePercentage()).to.be.equal(Number(poolInfo0.galaxyParticipationFeePercentage.hex))
            expect(await pool0.crowdfundingParticipationFeePercentage()).to.be.equal(Number(poolInfo0.crowdfundingParticipationFeePercentage.hex))
            expect(await pool0.galaxyPoolProportion()).to.be.equal(Number(poolInfo0.galaxyPoolProportion.hex))
            expect(await pool0.earlyAccessProportion()).to.be.equal(Number(poolInfo0.earlyAccessProportion.hex))
            expect(await pool0.totalRaiseAmount()).to.be.equal(Number(poolInfo0.totalRaiseAmount.hex))
            expect(await pool0.whaleOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.whaleCloseTime()).to.be.equal(Number(poolInfo0.whaleDuration.hex) + Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.communityCloseTime()).to.be.equal(Number(poolInfo0.communityDuration.hex) + Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))

            // expect(await pool0.maxPurchaseAmountForGalaxyPool()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / 10000))
            expect(await pool0.maxPurchaseAmountForEarlyAccess()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * (10000 - Number(poolInfo0.galaxyPoolProportion.hex)) * Number(poolInfo0.earlyAccessProportion.hex) / 10000 / 10000))
            expect(await pool0.communityOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))
        })

        it("Should set merkle tree root successfully by admin; revert without admin", async () => {
            const { pool0, buyRootHash, admin1, collaborator0, errors, Events } = await loadFixture(deployPool0Fixture)

            await pool0.connect(admin1).setRoot(buyRootHash);

            expect(await pool0.root()).to.be.equal(buyRootHash)

            const randomBuyRootHash = hexlify(randomBytes(32))

            await expect(pool0.connect(collaborator0).setRoot(randomBuyRootHash)).to.be.revertedWithCustomError(pool0, 'CallerNotAdmin')
        })

        it("Should close pool by admin; revert without admin", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).cancelPool(true)).to.be.emit(pool0, Events.Pool.CancelPool).withArgs(true);
            expect(await pool0.paused()).to.be.true;
        })

        it("Should buy token in galaxy pool, early access and open time successfully by all types of user; revert out of time and vesting", async () => {
            const { owner, getProof, PERCENTAGE_DENOMINATOR, errors, Events, poolInfoList, collaborator0, IDOTokens, purchaseTokens, buyMerkleTree, pool0, admin1, buyRootHash, investors, buyWhiteList, vesting0 } = await loadFixture(deployPool0Fixture)

            // collaborator transfer IDO token to IDO pool
            // await IDOTokens[0].connect(collaborator0).transfer(pool0.address, parseUnits('1000000', '28'))

            // update root
            await pool0.connect(admin1).setRoot(buyRootHash)

            // get proof for investor0 in galaxy pool
            const leafInfo0 = buyWhiteList[0]
            const proof0 = getProof(leafInfo0)

            // revert TimeOutToBuyToken (buy before whaleOpentime)
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, 100000, leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // buy successfully (investor0, WHALE, KYC user, galaxy pool)
            await time.increaseTo(await pool0.whaleOpenTime())
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'NotEnoughAllowance')
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, ethers.constants.MaxUint256)
            await purchaseTokens[0].connect(investors[0]).approve(pool0.address, BigNumber.from(leafInfo0.maxPurchaseBaseOnAllocation).add(1000))
            expect(await pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)
            expect(await pool0.purchasedAmount()).to.be.equal(Number(parseUnits('90', 6)))
            expect((await pool0.userPurchasedAmount(investors[0].address)).principal).to.be.equal(Number(parseUnits('90', 6)))

            // get proof for investor1 in galaxy pool
            const leafInfo1 = buyWhiteList[1]
            const proof1 = getProof(leafInfo1)

            // revert buy more than max purchase amount for KYC user (investor1, WHALE, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[1]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[1]).approve(pool0.address, BigNumber.from(leafInfo1.maxPurchaseBaseOnAllocation))
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('11000', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof for investor2 in galaxy pool
            const leafInfo4 = buyWhiteList[4]
            const proof4 = getProof(leafInfo4)

            // buy successfully (investor2, WHALE, Not KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[2]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[2]).approve(pool0.address, BigNumber.from(leafInfo4.maxPurchaseBaseOnAllocation))
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('870', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // buy successfully twice (investor2, WHALE, Not KYC user, galaxy pool)
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('100', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase amount for Not KYC user in twice (investor2, WHALE, Not KYC user, galaxy pool)
            await expect(pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('50', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForNonKYCUser')

            // get proof for investor5
            const leafInfo8 = buyWhiteList[8]
            const proof8 = getProof(leafInfo8)

            // revert normal, KYC user buy in galaxy pool (investor4, NORMAL, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[5]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[5]).approve(pool0.address, parseUnits('1000000',20))
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, leafInfo8.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForUser')
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, 10)).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            // get proof for investor0 in early access
            const leaf0EA = buyWhiteList[2]
            const proof0EA = getProof(leaf0EA)

            // buy successfully (investor0, WHALE, KYC User, early access)
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, parseUnits('1000000',20))
            const balanceOfInvestor0BeforeBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0BeforeBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)
            const balanceOfInvestor0AfterBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0AfterBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect((balanceOfInvestor0AfterBuyToken).sub(balanceOfInvestor0BeforeBuyToken)).to.be.equal(parseUnits('-110', 6))
            expect((balanceOfPool0AfterBuyToken).sub(balanceOfPool0BeforeBuyToken)).to.be.equal(parseUnits('110', 6))

            // buy successfully upto max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('9800', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof of investor 3 for early access
            const leaf7EA = buyWhiteList[7]
            const proof7EA = getProof(leaf7EA)

            // buy successfully (investor3, WHALE, Not KYC User, early access)
            await purchaseTokens[0].connect(investors[3]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[3]).approve(pool0.address, parseUnits('10',20))
            expect(await pool0.connect(investors[3]).buyTokenInCrowdfundingPool(proof7EA, parseUnits('10', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy (investor5, NORMAL, KYC User, early access)
            await expect(pool0.connect(investors[5]).buyTokenInCrowdfundingPool(proof8, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            await time.increaseTo(await pool0.whaleCloseTime())

            // revert buy out of time for whale
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('100', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // get proof of investor 1 for community (not early access)
            const leaf10NU = buyWhiteList[10]
            const proof10NU = getProof(leaf10NU)

            // buy successfully (investor1, WHALE-NORMAL, KYC user, community pool)
            expect(await pool0.connect(investors[1]).buyTokenInCrowdfundingPool(proof10NU, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // get proof of investor 0 for community (not early access)
            const leaf9NU = buyWhiteList[9]
            const proof9NU = getProof(leaf9NU)

            // revert buy more than max purchase of KYC in galaxy, after in early access and lately in community pool (not early access) (investor0, WHALE, KYC User, community pool)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof9NU, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // buy successfully (investor6, NORMAL, Not KYC user, community pool)
            await purchaseTokens[0].connect(investors[6]).approve(pool0.address, ethers.constants.MaxUint256);
            // await purchaseTokens[0].connect(investors[6]).approve(pool0.address, parseUnits('100',20));
            const leaf17 = buyWhiteList[17]
            const proof17 = getProof(leaf17)

            expect(await pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            await time.increaseTo(await pool0.communityCloseTime())
            // revert buy because out of time
            await expect(pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // vesting
            // check vesting info
            expect((await vesting0.vestingAmountInfo(investors[0].address)).totalAmount).to.be.equal(parseUnits('124875', await IDOTokens[0].decimals())) // 1125 + 1250 + 122500 = 124875
            expect((await vesting0.vestingAmountInfo(investors[1].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[2].address)).totalAmount).to.be.equal(parseUnits('12125', await IDOTokens[0].decimals())) // 10875 + 1250 = 12125
            expect((await vesting0.vestingAmountInfo(investors[3].address)).totalAmount).to.be.equal(parseUnits('125', await IDOTokens[0].decimals())) // 125
            expect((await vesting0.vestingAmountInfo(investors[4].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[5].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[6].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[7].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))

            // // fund IDO token by collaborator
            // expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            // await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            // await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            // const domain = {
            //     name: 'Pool',
            //     version: '1',
            //     chainId: 31337,
            //     verifyingContract: pool0.address
            // }
            // const signature = await buildFundSignature(owner, { ...domain }, IDOTokens[0].address, pool0.address, solidityKeccak256(['string'], [await IDOTokens[0].symbol()]), await IDOTokens[0].decimals())

            // expect(await pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, signature)).to.be.emit(pool0, Events.Pool.FundIDOToken)
            // expect(await IDOTokens[0].balanceOf(vesting0.address)).to.be.equal(await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            // expect(await purchaseTokens[0].balanceOf(pool0.address)).to.be.equal(parseUnits('12181', await purchaseTokens[0].decimals())) // 11170 + 1011 = 12181
            // expect(await pool0.participationFeeAmount()).to.be.equal(parseUnits('1011', await purchaseTokens[0].decimals())) // 1011
            await time.increaseTo(await vesting0.TGEDate())

            expect(await purchaseTokens[0].balanceOf(pool0.address)).to.be.equal(parseUnits('12181', await purchaseTokens[0].decimals())) // 11170 + 1011 = 12181
            expect(await pool0.participationFeeAmount()).to.be.equal(parseUnits('1011', await purchaseTokens[0].decimals())) // 1011

            // participant fee: 1011, token fee + profit: 11170
            // claim participation fee and token fee by admin
            await expect(pool0.connect(owner).claimParticipationFee(owner.address)).to.be.revertedWithCustomError(pool0, 'NotFunded')
            await expect(pool0.connect(owner).claimTokenFee(owner.address)).to.be.revertedWithCustomError(pool0, 'NotFunded')

            // fund IDO token by collaborator
            expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            const domain = {
                name: 'Pool',
                version: '1',
                chainId: 31337,
                verifyingContract: pool0.address
            }
            const signature = await buildFundSignature(owner, { ...domain }, IDOTokens[0].address, pool0.address, solidityKeccak256(['string'], [await IDOTokens[0].symbol()]), await IDOTokens[0].decimals())
            await expect(pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, signature)).to.be.revertedWithCustomError(pool0, 'NotAllowedToDoAfterTGEDate')

            // claim purchase amount by investor
            expect(await pool0.connect(investors[0]).withdrawPurchasedAmount(investors[0].address)).to.be.emit(pool0, Events.Pool.WithdrawPurchasedAmount).to.changeTokenBalance(purchaseTokens[0], investors[0].address, parseUnits('124875', await IDOTokens[0].decimals()))
            await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWithCustomError(pool0, 'NotFunded')
        })
    })

    describe("Buy with deployed IDO token and vesting, then pool is emergency cancelled", () => {
        async function deployPool0Fixture() {
            const { jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, vesting, poolLogic,
                poolInfoList, provider, IDOTokens, purchaseTokens, PERCENTAGE_DENOMINATOR, errors, Events, vestingLogic, VestingFrequency } = await loadFixture(deployFactoryFixture)
            let poolInfo0 = jsonCopy(poolInfoList[0])

            poolInfo0.vestingCliff = BigNumber.from('6').mul(VestingFrequency.DAY)
            poolInfo0.vestingFrequency = VestingFrequency.DAY
            let tx
            let txRs
            tx = await factory.connect(collaborator0).createPool(
                [
                    poolInfo0.IDOToken,
                    poolInfo0.purchaseToken
                ],
                [
                    poolInfo0.maxPurchaseAmountForKYCUser,
                    poolInfo0.maxPurchaseAmountForNotKYCUser,
                    poolInfo0.tokenFeePercentage,
                    poolInfo0.galaxyParticipationFeePercentage,
                    poolInfo0.crowdfundingParticipationFeePercentage,
                    poolInfo0.galaxyPoolProportion,
                    poolInfo0.earlyAccessProportion,
                    poolInfo0.totalRaiseAmount,
                    poolInfo0.whaleOpenTime,
                    poolInfo0.whaleDuration,
                    poolInfo0.communityDuration,
                    poolInfo0.rate,
                    poolInfo0.decimal,
                    poolInfo0.TGEDate,
                    poolInfo0.TGEPercentage,
                    poolInfo0.vestingCliff,
                    poolInfo0.vestingFrequency,
                    poolInfo0.numberOfVestingRelease
                ],
                1671095858080
            )
            txRs = await tx.wait()
            // console.log(txRs.events)

            const abiCoder = new ethers.utils.AbiCoder()
            const encodeData = abiCoder.encode(
                ['address[2]', 'uint[18]', 'address', 'uint'],
                [
                    [poolInfo0.IDOToken, poolInfo0.purchaseToken],
                    [poolInfo0.maxPurchaseAmountForKYCUser, poolInfo0.maxPurchaseAmountForNotKYCUser, poolInfo0.tokenFeePercentage, poolInfo0.galaxyParticipationFeePercentage, poolInfo0.crowdfundingParticipationFeePercentage, poolInfo0.galaxyPoolProportion, poolInfo0.earlyAccessProportion, poolInfo0.totalRaiseAmount, poolInfo0.whaleOpenTime, poolInfo0.whaleDuration, poolInfo0.communityDuration, poolInfo0.rate, poolInfo0.decimal, poolInfo0.TGEDate, poolInfo0.TGEPercentage, poolInfo0.vestingCliff, poolInfo0.vestingFrequency, poolInfo0.numberOfVestingRelease],
                    collaborator0.address,
                    1671095858080
                ])
            const salt = solidityKeccak256(['bytes'], [encodeData])

            const poolMinimalByteCode = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' + pool.address.slice(2) + '5af43d82803e903d91602b57fd5bf3'
            const initCodeHash = solidityKeccak256(['bytes'], [arrayify(poolMinimalByteCode)])

            const pool0Address = ethers.utils.getCreate2Address(
                factory.address,
                salt,
                initCodeHash
            )

            const vesting0Address = ethers.utils.getContractAddress(
                {
                    from: factory.address,
                    nonce: 2
                }
            )
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            const pool0 = new Pool__factory({
                ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(pool0Address)
            expect(await pool0.vesting()).to.be.equal(vesting0Address)

            const vesting0 = new Vesting__factory({
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(vesting0Address)

            const WHALE_HASH = solidityKeccak256(["string"], ["WHALE"])
            const NORMAL_USER_HASH = solidityKeccak256(["string"], ["NORMAL_USER"])

            // whale: investors: 0, 1, 2, 3
            // normal_user: investors: 4, 5, 6
            // KYC_user: investors: 0, 1, 5

            // whale + KYC: 0,1    (1)
            // whale + notKYC: 2,3 (2)
            // normal + KYC: 5     (3)

            // leaf [address+WHALE+10_000+maxPurchaseBaseOnAllocation]: (1) (>> Galaxy pool)
            // leaf [address+WHALE+10_000+0]:                           (1) (>> Early access pool)
            // leaf [address+WHALE+1_000+maxPurchaseBaseOnAllocation]:  (2) (>> Galaxy pool)
            // leaf [address+WHALE+1_000+0]:                            (2) (>> Early access pool)
            // leaf [address+NORMAL_USER+10_000+0]:                     (3)+(1)

            const PAIDBalanceList = [
                75000, //0
                180000, //1
                93750, //2
                245750, //3
                18750, //4
                1000, //5
                10000, //6
            ]

            const allocationList = PAIDBalanceList.map((balance) => {
                return Math.floor(Number((balance / 75000)))
            })

            const allocationForGalaxyPool = allocationList.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );

            const maxPurchaseAmountForGalaxyPool_pool0 = BigNumber.from(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / PERCENTAGE_DENOMINATOR);

            const buyWhiteList = [
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[0])))
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[1])))
                },
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[2])))
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[3])))
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[4].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[6].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                }
            ]

            const leafNodes = buyWhiteList.map((obj) => {
                let leafNode = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [obj.candidate, obj.userType, obj.maxPurchaseWhetherOrNotKYC, obj.maxPurchaseBaseOnAllocation]
                );
                return ethers.utils.solidityKeccak256(["bytes"], [leafNode]);
            });

            const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
                sortPairs: true,
            });

            const buyRootHash = hexlify(buyMerkleTree.getRoot());

            function getProof(leafInfo: { candidate: string, userType: string, maxPurchaseWhetherOrNotKYC: number, maxPurchaseBaseOnAllocation: number }) {
                const leaf = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [leafInfo.candidate, leafInfo.userType, leafInfo.maxPurchaseWhetherOrNotKYC, leafInfo.maxPurchaseBaseOnAllocation]
                )
                const leafNode = solidityKeccak256(["bytes"], [leaf])
                const proof = buyMerkleTree.getHexProof(leafNode)
                return proof
            }


            return { VestingFrequency, getProof, PERCENTAGE_DENOMINATOR, buyMerkleTree, buyWhiteList, buyRootHash, jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, poolInfoList, provider, IDOTokens, purchaseTokens, pool0, vesting0, errors, Events }
        }
        it("Should get info from pool after created", async () => {
            const { VestingFrequency, jsonCopy, pool0, poolInfoList, vesting0 } = await loadFixture(deployPool0Fixture)
            const poolInfo0 = jsonCopy(poolInfoList[0])

            expect(await vesting0.IDOToken()).to.be.equal(poolInfo0.IDOToken)
            expect(await pool0.purchaseToken()).to.be.equal(poolInfo0.purchaseToken)
            expect((await pool0.offeredCurrency()).rate).to.be.equal(Number(poolInfo0.rate.hex))
            expect((await pool0.offeredCurrency()).decimal).to.be.equal(Number(poolInfo0.decimal.hex))
            expect(await pool0.maxPurchaseAmountForKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForKYCUser.hex))
            expect(await pool0.maxPurchaseAmountForNotKYCUser()).to.be.equal(Number(poolInfo0.maxPurchaseAmountForNotKYCUser.hex))
            expect(await vesting0.TGEPercentage()).to.be.equal(Number(poolInfo0.TGEPercentage.hex))
            expect(await pool0.galaxyParticipationFeePercentage()).to.be.equal(Number(poolInfo0.galaxyParticipationFeePercentage.hex))
            expect(await pool0.crowdfundingParticipationFeePercentage()).to.be.equal(Number(poolInfo0.crowdfundingParticipationFeePercentage.hex))
            expect(await pool0.galaxyPoolProportion()).to.be.equal(Number(poolInfo0.galaxyPoolProportion.hex))
            expect(await pool0.earlyAccessProportion()).to.be.equal(Number(poolInfo0.earlyAccessProportion.hex))
            expect(await pool0.totalRaiseAmount()).to.be.equal(Number(poolInfo0.totalRaiseAmount.hex))
            expect(await pool0.whaleOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.whaleCloseTime()).to.be.equal(Number(poolInfo0.whaleDuration.hex) + Number(poolInfo0.whaleOpenTime.hex))
            expect(await pool0.communityCloseTime()).to.be.equal(Number(poolInfo0.communityDuration.hex) + Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))

            // expect(await pool0.maxPurchaseAmountForGalaxyPool()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * Number(poolInfo0.galaxyPoolProportion.hex) / 10000))
            expect(await pool0.maxPurchaseAmountForEarlyAccess()).to.be.equal(Math.floor(Number(poolInfo0.totalRaiseAmount.hex) * (10000 - Number(poolInfo0.galaxyPoolProportion.hex)) * Number(poolInfo0.earlyAccessProportion.hex) / 10000 / 10000))
            expect(await pool0.communityOpenTime()).to.be.equal(Number(poolInfo0.whaleOpenTime.hex) + Number(poolInfo0.whaleDuration.hex))
        })

        it("Should set merkle tree root successfully by admin; revert without admin", async () => {
            const { pool0, buyRootHash, admin1, collaborator0, errors, Events } = await loadFixture(deployPool0Fixture)

            await pool0.connect(admin1).setRoot(buyRootHash);

            expect(await pool0.root()).to.be.equal(buyRootHash)

            const randomBuyRootHash = hexlify(randomBytes(32))

            await expect(pool0.connect(collaborator0).setRoot(randomBuyRootHash)).to.be.revertedWithCustomError(pool0, 'CallerNotAdmin')
        })

        it("Should close pool by admin; revert without admin", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).cancelPool(true)).to.be.emit(pool0, Events.Pool.CancelPool).withArgs(true);
            expect(await pool0.paused()).to.be.true;
        })

        it("Should update time includes whale close time, crowdfunding close time, TGE date", async () => {
            const { pool0, admin1, Events } = await loadFixture(deployPool0Fixture)
            expect(await pool0.connect(admin1).updateTGEDate((await pool0.communityCloseTime()).add(100))).to.be.emit(pool0, Events.Vesting.UpdateTGEDate)
            expect(await pool0.connect(admin1).updateTime(await pool0.whaleCloseTime(), (await pool0.communityCloseTime()).add(50))).to.be.emit(pool0, Events.Pool.UpdateTime)
        })

        it("Should buy token in galaxy pool, early access and open time successfully by all types of user; revert out of time and vesting", async () => {
            const { owner, getProof, PERCENTAGE_DENOMINATOR, errors, Events, poolInfoList, collaborator0, IDOTokens, purchaseTokens, buyMerkleTree, pool0, admin1, buyRootHash, investors, buyWhiteList, vesting0 } = await loadFixture(deployPool0Fixture)

            // collaborator transfer IDO token to IDO pool
            // await IDOTokens[0].connect(collaborator0).transfer(pool0.address, parseUnits('1000000', '28'))

            // update root
            await pool0.connect(admin1).setRoot(buyRootHash)

            // get proof for investor0 in galaxy pool
            const leafInfo0 = buyWhiteList[0]
            const proof0 = getProof(leafInfo0)

            // revert TimeOutToBuyToken (buy before whaleOpentime)
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, 100000, leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // buy successfully (investor0, WHALE, KYC user, galaxy pool)
            await time.increaseTo(await pool0.whaleOpenTime())
            await expect(pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'NotEnoughAllowance')
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, ethers.constants.MaxUint256)
            await purchaseTokens[0].connect(investors[0]).approve(pool0.address, BigNumber.from(leafInfo0.maxPurchaseBaseOnAllocation).add(1000))
            expect(await pool0.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)
            expect(await pool0.purchasedAmount()).to.be.equal(Number(parseUnits('90', 6)))
            expect((await pool0.userPurchasedAmount(investors[0].address)).principal).to.be.equal(Number(parseUnits('90', 6)))

            // get proof for investor1 in galaxy pool
            const leafInfo1 = buyWhiteList[1]
            const proof1 = getProof(leafInfo1)

            // revert buy more than max purchase amount for KYC user (investor1, WHALE, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[1]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[1]).approve(pool0.address, BigNumber.from(leafInfo1.maxPurchaseBaseOnAllocation))
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('11000', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof for investor2 in galaxy pool
            const leafInfo4 = buyWhiteList[4]
            const proof4 = getProof(leafInfo4)

            // buy successfully (investor2, WHALE, Not KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[2]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[2]).approve(pool0.address, BigNumber.from(leafInfo4.maxPurchaseBaseOnAllocation))
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('870', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // buy successfully twice (investor2, WHALE, Not KYC user, galaxy pool)
            expect(await pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('100', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase amount for Not KYC user in twice (investor2, WHALE, Not KYC user, galaxy pool)
            await expect(pool0.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('50', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForNonKYCUser')

            // get proof for investor5
            const leafInfo8 = buyWhiteList[8]
            const proof8 = getProof(leafInfo8)

            // revert normal, KYC user buy in galaxy pool (investor4, NORMAL, KYC user, galaxy pool)
            await purchaseTokens[0].connect(investors[5]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[5]).approve(pool0.address, parseUnits('1000000',20))
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, leafInfo8.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForUser')
            await expect(pool0.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, 10)).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            // get proof for investor0 in early access
            const leaf0EA = buyWhiteList[2]
            const proof0EA = getProof(leaf0EA)

            // buy successfully (investor0, WHALE, KYC User, early access)
            // await purchaseTokens[0].connect(investors[0]).approve(pool0.address, parseUnits('1000000',20))
            const balanceOfInvestor0BeforeBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0BeforeBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)
            const balanceOfInvestor0AfterBuyToken = await purchaseTokens[0].balanceOf(investors[0].address)
            const balanceOfPool0AfterBuyToken = await purchaseTokens[0].balanceOf(pool0.address)
            expect((balanceOfInvestor0AfterBuyToken).sub(balanceOfInvestor0BeforeBuyToken)).to.be.equal(parseUnits('-110', 6))
            expect((balanceOfPool0AfterBuyToken).sub(balanceOfPool0BeforeBuyToken)).to.be.equal(parseUnits('110', 6))

            // buy successfully upto max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            expect(await pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('9800', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy more than max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // get proof of investor 3 for early access
            const leaf7EA = buyWhiteList[7]
            const proof7EA = getProof(leaf7EA)

            // buy successfully (investor3, WHALE, Not KYC User, early access)
            await purchaseTokens[0].connect(investors[3]).approve(pool0.address, ethers.constants.MaxUint256)
            // await purchaseTokens[0].connect(investors[3]).approve(pool0.address, parseUnits('10',20))
            expect(await pool0.connect(investors[3]).buyTokenInCrowdfundingPool(proof7EA, parseUnits('10', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // revert buy (investor5, NORMAL, KYC User, early access)
            await expect(pool0.connect(investors[5]).buyTokenInCrowdfundingPool(proof8, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'NotInWhaleList')

            await time.increaseTo(await pool0.whaleCloseTime())

            // revert buy out of time for whale
            await expect(pool0.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('100', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // get proof of investor 1 for community (not early access)
            const leaf10NU = buyWhiteList[10]
            const proof10NU = getProof(leaf10NU)

            // buy successfully (investor1, WHALE-NORMAL, KYC user, community pool)
            expect(await pool0.connect(investors[1]).buyTokenInCrowdfundingPool(proof10NU, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            // get proof of investor 0 for community (not early access)
            const leaf9NU = buyWhiteList[9]
            const proof9NU = getProof(leaf9NU)

            // revert buy more than max purchase of KYC in galaxy, after in early access and lately in community pool (not early access) (investor0, WHALE, KYC User, community pool)
            await expect(pool0.connect(investors[0]).buyTokenInCrowdfundingPool(proof9NU, parseUnits('100', 6))).to.be.revertedWithCustomError(pool0, 'ExceedMaxPurchaseAmountForKYCUser')

            // buy successfully (investor6, NORMAL, Not KYC user, community pool)
            await purchaseTokens[0].connect(investors[6]).approve(pool0.address, ethers.constants.MaxUint256);
            // await purchaseTokens[0].connect(investors[6]).approve(pool0.address, parseUnits('100',20));
            const leaf17 = buyWhiteList[17]
            const proof17 = getProof(leaf17)

            expect(await pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('100', 6))).to.be.emit(pool0, Events.Pool.BuyToken)

            await time.increaseTo(await pool0.communityCloseTime())
            // revert buy because out of time
            await expect(pool0.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('10', 6))).to.be.revertedWithCustomError(pool0, 'TimeOutToBuyIDOToken')

            // vesting
            // check vesting info
            expect((await vesting0.vestingAmountInfo(investors[0].address)).totalAmount).to.be.equal(parseUnits('124875', await IDOTokens[0].decimals())) // 1125 + 1250 + 122500 = 124875
            expect((await vesting0.vestingAmountInfo(investors[1].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[2].address)).totalAmount).to.be.equal(parseUnits('12125', await IDOTokens[0].decimals())) // 10875 + 1250 = 12125
            expect((await vesting0.vestingAmountInfo(investors[3].address)).totalAmount).to.be.equal(parseUnits('125', await IDOTokens[0].decimals())) // 125
            expect((await vesting0.vestingAmountInfo(investors[4].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[5].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))
            expect((await vesting0.vestingAmountInfo(investors[6].address)).totalAmount).to.be.equal(parseUnits('1250', await IDOTokens[0].decimals())) // 1250
            expect((await vesting0.vestingAmountInfo(investors[7].address)).totalAmount).to.be.equal(parseUnits('0', await IDOTokens[0].decimals()))

            expect(await IDOTokens[0].balanceOf(pool0.address)).to.be.equal(0)
            await IDOTokens[0].connect(collaborator0).mint(collaborator0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))
            await IDOTokens[0].connect(collaborator0).approve(pool0.address, await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            expect(await pool0.connect(collaborator0).fundIDOToken(IDOTokens[0].address, '0x')).to.be.emit(pool0, Events.Pool.FundIDOToken)
            expect(await IDOTokens[0].balanceOf(vesting0.address)).to.be.equal(await pool0.getIDOTokenAmountByOfferedCurrency(await pool0.totalRaiseAmount()))

            expect(await purchaseTokens[0].balanceOf(pool0.address)).to.be.equal(parseUnits('12181', await purchaseTokens[0].decimals())) // 11170 + 1011 = 12181
            expect(await pool0.participationFeeAmount()).to.be.equal(parseUnits('1011', await purchaseTokens[0].decimals())) // 1011
            await time.increaseTo(await vesting0.TGEDate())
            await vesting0.connect(investors[0]).claimIDOToken(investors[0].address)

            await time.increase(await vesting0.vestingCliff())
            await vesting0.connect(investors[0]).claimIDOToken(investors[0].address)
            await time.increase(await vesting0.vestingFrequency())
            await vesting0.connect(investors[0]).claimIDOToken(investors[0].address)

            // expect(await pool0.connect(owner).cancelPool(false)).to.be.emit(vesting0, Events.Vesting.SetEmergencyCancelled)
            // await time.increase(14 * 24 * 60 * 60)

            // // participant fee: 1011, token fee + profit: 11170
            // // claim participation fee and token fee by admin
            // await expect(pool0.connect(owner).claimParticipationFee(owner.address)).to.be.revertedWith('Pausable: paused')
            // const tokenFeeAmountWithDecimal = 11170 * (await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;
            // await expect(pool0.connect(owner).claimTokenFee(owner.address)).to.be.revertedWith('Pausable: paused')
            // const profitAmountWithDecimal = 11170 * (10000 - await pool0.tokenFeePercentage()) * 10 ** 6 / 10000;

            // // claim profit fee by collaborator and IDO token by investor
            // await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWith('Pausable: paused')
            // await expect(vesting0.connect(investors[0]).claimIDOToken(investors[0].address)).to.be.revertedWith(await errors.NOT_ALLOWED_TO_CLAIM_IDO_TOKEN())
            // await expect(vesting0.connect(investors[0]).claimIDOToken(collaborator0.address)).to.be.revertedWith(await errors.NOT_ALLOWED_TO_CLAIM_IDO_TOKEN())

            // await time.increase(await vesting0.vestingCliff())
            // await expect(pool0.connect(collaborator0).claimFund(collaborator0.address)).to.be.revertedWith('Pausable: paused')
            // await expect(vesting0.connect(investors[0]).claimIDOToken(investors[0].address)).to.be.rejectedWith(await errors.NOT_ALLOWED_TO_CLAIM_IDO_TOKEN())

            // expect(await pool0.connect(investors[0]).withdrawPurchasedAmount(investors[0].address)).to.be.emit(pool0, Events.Pool.WithdrawPurchasedAmount).to.changeTokenBalance(purchaseTokens[0], investors[0].address, parseUnits('124875', await IDOTokens[0].decimals()))

            // // withdraw redundant IDO token by collaborator
            // await expect(pool0.connect(collaborator0).withdrawRedundantIDOToken(collaborator0.address)).to.be.revertedWith(await errors.NOT_ALLOWED_TO_DO_AFTER_EMERGENCY_CANCELLED());
        })
    })

    describe("Buy with deployed IDO token with USDT", () => {
        async function deployPool1Fixture() {
            const { jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, vesting, poolLogic,
                poolInfoList, provider, IDOTokens, purchaseTokens, PERCENTAGE_DENOMINATOR, errors, Events, vestingLogic } = await loadFixture(deployFactoryFixture)
            const poolInfo1 = jsonCopy(poolInfoList[1])

            let tx
            let txRs
            tx = await factory.connect(collaborator0).createPool(
                [
                    poolInfo1.IDOToken,
                    poolInfo1.purchaseToken
                ],
                [
                    poolInfo1.maxPurchaseAmountForKYCUser,
                    poolInfo1.maxPurchaseAmountForNotKYCUser,
                    poolInfo1.tokenFeePercentage,
                    poolInfo1.galaxyParticipationFeePercentage,
                    poolInfo1.crowdfundingParticipationFeePercentage,
                    poolInfo1.galaxyPoolProportion,
                    poolInfo1.earlyAccessProportion,
                    poolInfo1.totalRaiseAmount,
                    poolInfo1.whaleOpenTime,
                    poolInfo1.whaleDuration,
                    poolInfo1.communityDuration,
                    poolInfo1.rate,
                    poolInfo1.decimal,
                    poolInfo1.TGEDate,
                    poolInfo1.TGEPercentage,
                    poolInfo1.vestingCliff,
                    poolInfo1.vestingFrequency,
                    poolInfo1.numberOfVestingRelease
                ],
                1671095858080
            )
            txRs = await tx.wait()
            // console.log(txRs.events)

            const abiCoder = new ethers.utils.AbiCoder()
            const encodeData = abiCoder.encode(
                ['address[2]', 'uint[18]', 'address', 'uint'],
                [
                    [poolInfo1.IDOToken, poolInfo1.purchaseToken],
                    [poolInfo1.maxPurchaseAmountForKYCUser, poolInfo1.maxPurchaseAmountForNotKYCUser, poolInfo1.tokenFeePercentage, poolInfo1.galaxyParticipationFeePercentage, poolInfo1.crowdfundingParticipationFeePercentage, poolInfo1.galaxyPoolProportion, poolInfo1.earlyAccessProportion, poolInfo1.totalRaiseAmount, poolInfo1.whaleOpenTime, poolInfo1.whaleDuration, poolInfo1.communityDuration, poolInfo1.rate, poolInfo1.decimal, poolInfo1.TGEDate, poolInfo1.TGEPercentage, poolInfo1.vestingCliff, poolInfo1.vestingFrequency, poolInfo1.numberOfVestingRelease],
                    collaborator0.address,
                    1671095858080
                ])
            const salt = solidityKeccak256(['bytes'], [encodeData])

            const poolMinimalByteCode = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73' + pool.address.slice(2) + '5af43d82803e903d91602b57fd5bf3'
            const initCodeHash = solidityKeccak256(['bytes'], [arrayify(poolMinimalByteCode)])

            const pool1Address = ethers.utils.getCreate2Address(
                factory.address,
                salt,
                initCodeHash
            )

            const vesting1Address = ethers.utils.getContractAddress(
                {
                    from: factory.address,
                    nonce: 2
                }
            )
            await factory.connect(owner).grantRole(keccak256(solidityPack(['string'], ['OWNER_ROLE'])), admin1.address)

            const pool1 = new Pool__factory({
                ["contracts/logics/PoolLogic.sol:PoolLogic"]: poolLogic.address,
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(pool1Address)
            expect(await pool1.vesting()).to.be.equal(vesting1Address)

            const vesting1 = new Vesting__factory({
                ["contracts/logics/VestingLogic.sol:VestingLogic"]: vestingLogic.address,
            }, owner).attach(vesting1Address)

            const WHALE_HASH = solidityKeccak256(["string"], ["WHALE"])
            const NORMAL_USER_HASH = solidityKeccak256(["string"], ["NORMAL_USER"])

            // whale: investors: 0, 1, 2, 3
            // normal_user: investors: 4, 5, 6
            // KYC_user: investors: 0, 1, 5

            // whale + KYC: 0,1    (1)
            // whale + notKYC: 2,3 (2)
            // normal + KYC: 5     (3)

            // leaf [address+WHALE+10_000+maxPurchaseBaseOnAllocation]: (1) (>> Galaxy pool)
            // leaf [address+WHALE+10_000+0]:                           (1) (>> Early access pool)
            // leaf [address+WHALE+1_000+maxPurchaseBaseOnAllocation]:  (2) (>> Galaxy pool)
            // leaf [address+WHALE+1_000+0]:                            (2) (>> Early access pool)
            // leaf [address+NORMAL_USER+10_000+0]:                     (3)+(1)

            const PAIDBalanceList = [
                75000, //0
                180000, //1
                93750, //2
                245750, //3
                18750, //4
                1000, //5
                10000, //6
            ]

            const allocationList = PAIDBalanceList.map((balance) => {
                return Math.floor(Number((balance / 75000)))
            })

            const allocationForGalaxyPool = allocationList.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            );

            const maxPurchaseAmountForGalaxyPool_pool0 = BigNumber.from(Number(poolInfo1.totalRaiseAmount.hex) * Number(poolInfo1.galaxyPoolProportion.hex) / PERCENTAGE_DENOMINATOR);

            const buyWhiteList = [
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[0])))
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[1])))
                },
                {
                    candidate: investors[0].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[2])))
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: Math.floor(Number((Number(maxPurchaseAmountForGalaxyPool_pool0) / allocationForGalaxyPool * allocationList[3])))
                },
                {
                    candidate: investors[2].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: WHALE_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[0].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[1].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[2].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[3].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[4].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[5].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                },
                {
                    candidate: investors[6].address,
                    userType: NORMAL_USER_HASH,
                    maxPurchaseWhetherOrNotKYC: Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex),
                    maxPurchaseBaseOnAllocation: 0
                }
            ]

            const leafNodes = buyWhiteList.map((obj) => {
                let leafNode = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [obj.candidate, obj.userType, obj.maxPurchaseWhetherOrNotKYC, obj.maxPurchaseBaseOnAllocation]
                );
                return ethers.utils.solidityKeccak256(["bytes"], [leafNode]);
            });

            const buyMerkleTree = new MerkleTree(leafNodes, keccak256, {
                sortPairs: true,
            });

            const buyRootHash = hexlify(buyMerkleTree.getRoot());

            function getProof(leafInfo: { candidate: string, userType: string, maxPurchaseWhetherOrNotKYC: number, maxPurchaseBaseOnAllocation: number }) {
                const leaf = solidityPack(
                    ["address", "bytes32", "uint256", "uint256"],
                    [leafInfo.candidate, leafInfo.userType, leafInfo.maxPurchaseWhetherOrNotKYC, leafInfo.maxPurchaseBaseOnAllocation]
                )
                const leafNode = solidityKeccak256(["bytes"], [leaf])
                const proof = buyMerkleTree.getHexProof(leafNode)
                return proof
            }


            return { getProof, PERCENTAGE_DENOMINATOR, buyMerkleTree, buyWhiteList, buyRootHash, jsonCopy, owner, admin1, admin2, admin3, collaborator0, collaborator1, collaborator2, investors, pool, factory, poolInfoList, provider, IDOTokens, purchaseTokens, pool1, vesting1, errors, Events }
        }
        it("Should get info from pool after created", async () => {
            const { jsonCopy, pool1, poolInfoList, vesting1 } = await loadFixture(deployPool1Fixture)
            const poolInfo1 = jsonCopy(poolInfoList[1])

            expect(await vesting1.IDOToken()).to.be.equal(poolInfo1.IDOToken)
            expect(await pool1.purchaseToken()).to.be.equal(poolInfo1.purchaseToken)
            expect((await pool1.offeredCurrency()).rate).to.be.equal(BigNumber.from(poolInfo1.rate.hex))
            expect((await pool1.offeredCurrency()).decimal).to.be.equal(Number(poolInfo1.decimal.hex))
            expect(await pool1.maxPurchaseAmountForKYCUser()).to.be.equal(Number(poolInfo1.maxPurchaseAmountForKYCUser.hex))
            expect(await pool1.maxPurchaseAmountForNotKYCUser()).to.be.equal(Number(poolInfo1.maxPurchaseAmountForNotKYCUser.hex))
            expect(await vesting1.TGEPercentage()).to.be.equal(Number(poolInfo1.TGEPercentage.hex))
            expect(await pool1.galaxyParticipationFeePercentage()).to.be.equal(Number(poolInfo1.galaxyParticipationFeePercentage.hex))
            expect(await pool1.crowdfundingParticipationFeePercentage()).to.be.equal(Number(poolInfo1.crowdfundingParticipationFeePercentage.hex))
            expect(await pool1.galaxyPoolProportion()).to.be.equal(Number(poolInfo1.galaxyPoolProportion.hex))
            expect(await pool1.earlyAccessProportion()).to.be.equal(Number(poolInfo1.earlyAccessProportion.hex))
            expect(await pool1.totalRaiseAmount()).to.be.equal(Number(poolInfo1.totalRaiseAmount.hex))
            expect(await pool1.whaleOpenTime()).to.be.equal(Number(poolInfo1.whaleOpenTime.hex))
            expect(await pool1.whaleCloseTime()).to.be.equal(Number(poolInfo1.whaleDuration.hex) + Number(poolInfo1.whaleOpenTime.hex))
            expect(await pool1.communityCloseTime()).to.be.equal(Number(poolInfo1.communityDuration.hex) + Number(poolInfo1.whaleOpenTime.hex) + Number(poolInfo1.whaleDuration.hex))

            // expect(await pool1.maxPurchaseAmountForGalaxyPool()).to.be.equal(Math.floor(Number(poolInfo1.totalRaiseAmount.hex) * Number(poolInfo1.galaxyPoolProportion.hex) / 10000))
            expect(await pool1.maxPurchaseAmountForEarlyAccess()).to.be.equal(Math.floor(Number(poolInfo1.totalRaiseAmount.hex) * (10000 - Number(poolInfo1.galaxyPoolProportion.hex)) * Number(poolInfo1.earlyAccessProportion.hex) / 10000 / 10000))
            expect(await pool1.communityOpenTime()).to.be.equal(Number(poolInfo1.whaleOpenTime.hex) + Number(poolInfo1.whaleDuration.hex))
        })

        it("Should set merkle tree root successfully by admin; revert without admin", async () => {
            const { pool1, buyRootHash, admin1, collaborator0, errors, Events } = await loadFixture(deployPool1Fixture)

            await pool1.connect(admin1).setRoot(buyRootHash);

            expect(await pool1.root()).to.be.equal(buyRootHash)

            const randomBuyRootHash = hexlify(randomBytes(32))

            await expect(pool1.connect(collaborator0).setRoot(randomBuyRootHash)).to.be.revertedWithCustomError(pool1, 'CallerNotAdmin')
        })

        it("Should close pool by admin; revert without admin", async () => {
            const { pool1, admin1, Events } = await loadFixture(deployPool1Fixture)
            expect(await pool1.connect(admin1).cancelPool(true)).to.be.emit(pool1, Events.Pool.CancelPool).withArgs(true);
            expect(await pool1.paused()).to.be.true;
        })

        it("Should update time includes whale close time, crowdfunding close time, TGE date", async () => {
            const { pool1, admin1, Events } = await loadFixture(deployPool1Fixture)
            expect(await pool1.connect(admin1).updateTGEDate((await pool1.communityCloseTime()).add(100))).to.be.emit(pool1, Events.Vesting.UpdateTGEDate)
            expect(await pool1.connect(admin1).updateTime(await pool1.whaleCloseTime(), (await pool1.communityCloseTime()).add(50))).to.be.emit(pool1, Events.Pool.UpdateTime)
        })

        it("Should buy token in galaxy pool, early access and open time successfully by all types of user; revert out of time and vesting", async () => {
            const { owner, getProof, PERCENTAGE_DENOMINATOR, errors, Events, poolInfoList, collaborator0, IDOTokens, purchaseTokens, buyMerkleTree, pool1, admin1, buyRootHash, investors, buyWhiteList, vesting1 } = await loadFixture(deployPool1Fixture)

            // collaborator transfer IDO token to IDO pool
            // await IDOTokens[0].connect(collaborator0).transfer(pool0.address, parseUnits('1000000', '28'))

            // update root
            await pool1.connect(admin1).setRoot(buyRootHash)

            // get proof for investor0 in galaxy pool
            const leafInfo0 = buyWhiteList[0]
            const proof0 = getProof(leafInfo0)

            // revert TimeOutToBuyToken (buy before whaleOpentime)
            await expect(pool1.connect(investors[0]).buyTokenInGalaxyPool(proof0, 100000, leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool1, 'TimeOutToBuyIDOToken')

            // buy successfully (investor0, WHALE, KYC user, galaxy pool)
            await time.increaseTo(await pool1.whaleOpenTime())
            await expect(pool1.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool1, 'NotEnoughAllowance')
            // await purchaseTokens[1].connect(investors[0]).approve(pool1.address, ethers.constants.MaxUint256)
            await purchaseTokens[1].connect(investors[0]).approve(pool1.address, BigNumber.from(leafInfo0.maxPurchaseBaseOnAllocation).add(1000))
            expect(await pool1.connect(investors[0]).buyTokenInGalaxyPool(proof0, parseUnits('90', 6), leafInfo0.maxPurchaseBaseOnAllocation)).to.be.emit(pool1, Events.Pool.BuyToken)
            expect(await pool1.purchasedAmount()).to.be.equal(Number(parseUnits('90', 6)))
            expect((await pool1.userPurchasedAmount(investors[0].address)).principal).to.be.equal(Number(parseUnits('90', 6)))

            // get proof for investor1 in galaxy pool
            const leafInfo1 = buyWhiteList[1]
            const proof1 = getProof(leafInfo1)

            // revert buy more than max purchase amount for KYC user (investor1, WHALE, KYC user, galaxy pool)
            await purchaseTokens[1].connect(investors[1]).approve(pool1.address, ethers.constants.MaxUint256)
            // await purchaseTokens[1].connect(investors[1]).approve(pool1.address, BigNumber.from(leafInfo1.maxPurchaseBaseOnAllocation))
            // await expect(pool1.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('11000', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWith(await errors.EXCEED_MAX_PURCHASE_AMOUNT_FOR_KYC_USER())

            // get proof for investor2 in galaxy pool
            const leafInfo4 = buyWhiteList[4]
            const proof4 = getProof(leafInfo4)

            // buy successfully (investor2, WHALE, Not KYC user, galaxy pool)
            await purchaseTokens[1].connect(investors[2]).approve(pool1.address, ethers.constants.MaxUint256)
            // await purchaseTokens[1].connect(investors[2]).approve(pool1.address, BigNumber.from(leafInfo4.maxPurchaseBaseOnAllocation))
            expect(await pool1.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('870', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool1, Events.Pool.BuyToken)

            // buy successfully twice (investor2, WHALE, Not KYC user, galaxy pool)
            expect(await pool1.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('100', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.emit(pool1, Events.Pool.BuyToken)

            // revert buy more than max purchase amount for Not KYC user in twice (investor2, WHALE, Not KYC user, galaxy pool)
            // await expect(pool1.connect(investors[2]).buyTokenInGalaxyPool(proof4, parseUnits('50', 6), leafInfo4.maxPurchaseBaseOnAllocation)).to.be.revertedWith(await errors.EXCEED_MAX_PURCHASE_AMOUNT_FOR_NOT_KYC_USER())

            // get proof for investor5
            const leafInfo8 = buyWhiteList[8]
            const proof8 = getProof(leafInfo8)

            // revert normal, KYC user buy in galaxy pool (investor4, NORMAL, KYC user, galaxy pool)
            await purchaseTokens[1].connect(investors[5]).approve(pool1.address, ethers.constants.MaxUint256)
            // await purchaseTokens[1].connect(investors[5]).approve(pool1.address, parseUnits('1000000',20))


            // await expect(pool1.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, leafInfo8.maxPurchaseBaseOnAllocation)).to.be.revertedWith(await errors.EXCEED_MAX_PURCHASE_AMOUNT_FOR_USER())
            await expect(pool1.connect(investors[5]).buyTokenInGalaxyPool(proof8, 10, 10)).to.be.revertedWithCustomError(pool1, 'NotInWhaleList')

            // get proof for investor0 in early access
            const leaf0EA = buyWhiteList[2]
            const proof0EA = getProof(leaf0EA)

            // buy successfully (investor0, WHALE, KYC User, early access)
            // await purchaseTokens[1].connect(investors[0]).approve(pool1.address, parseUnits('1000000',20))
            const balanceOfInvestor0BeforeBuyToken = await purchaseTokens[1].balanceOf(investors[0].address)
            const balanceOfpool1BeforeBuyToken = await purchaseTokens[1].balanceOf(pool1.address)

            expect(await pool1.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.emit(pool1, Events.Pool.BuyToken)

            const balanceOfInvestor0AfterBuyToken = await purchaseTokens[1].balanceOf(investors[0].address)
            const balanceOfpool1AfterBuyToken = await purchaseTokens[1].balanceOf(pool1.address)
            // expect((balanceOfInvestor0AfterBuyToken).sub(balanceOfInvestor0BeforeBuyToken)).to.be.equal(parseUnits('-110', 6))
            // expect((balanceOfpool1AfterBuyToken).sub(balanceOfpool1BeforeBuyToken)).to.be.equal(parseUnits('110', 6))
            await purchaseTokens[1].connect(investors[0]).approve(pool1.address, 0)
            await purchaseTokens[1].connect(investors[0]).approve(pool1.address, parseUnits('1127000', 6))
            // buy successfully upto max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            expect(await pool1.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('9800', 6))).to.be.emit(pool1, Events.Pool.BuyToken)

            // revert buy more than max purchase of KYC in galaxy and after in early access (investor0, WHALE, KYC User, early access)
            // await expect(pool1.connect(investors[0]).buyTokenInCrowdfundingPool(proof0EA, parseUnits('100', 6))).to.be.revertedWith(await errors.EXCEED_MAX_PURCHASE_AMOUNT_FOR_KYC_USER())

            // get proof of investor 3 for early access
            const leaf7EA = buyWhiteList[7]
            const proof7EA = getProof(leaf7EA)

            // buy successfully (investor3, WHALE, Not KYC User, early access)
            await purchaseTokens[1].connect(investors[3]).approve(pool1.address, ethers.constants.MaxUint256)
            // await purchaseTokens[1].connect(investors[3]).approve(pool1.address, parseUnits('10',20))
            expect(await pool1.connect(investors[3]).buyTokenInCrowdfundingPool(proof7EA, parseUnits('10', 6))).to.be.emit(pool1, Events.Pool.BuyToken)

            // revert buy (investor5, NORMAL, KYC User, early access)
            await expect(pool1.connect(investors[5]).buyTokenInCrowdfundingPool(proof8, parseUnits('10', 6))).to.be.revertedWithCustomError(pool1, 'NotInWhaleList')

            await time.increaseTo(await pool1.whaleCloseTime())

            // revert buy out of time for whale
            await expect(pool1.connect(investors[1]).buyTokenInGalaxyPool(proof1, parseUnits('100', 6), leafInfo1.maxPurchaseBaseOnAllocation)).to.be.revertedWithCustomError(pool1, 'TimeOutToBuyIDOToken')

            // get proof of investor 1 for community (not early access)
            const leaf10NU = buyWhiteList[10]
            const proof10NU = getProof(leaf10NU)

            // buy successfully (investor1, WHALE-NORMAL, KYC user, community pool)
            expect(await pool1.connect(investors[1]).buyTokenInCrowdfundingPool(proof10NU, parseUnits('100', 6))).to.be.emit(pool1, Events.Pool.BuyToken)

            // get proof of investor 0 for community (not early access)
            const leaf9NU = buyWhiteList[9]
            const proof9NU = getProof(leaf9NU)

            // revert buy more than max purchase of KYC in galaxy, after in early access and lately in community pool (not early access) (investor0, WHALE, KYC User, community pool)
            // await expect(pool1.connect(investors[0]).buyTokenInCrowdfundingPool(proof9NU, parseUnits('100', 6))).to.be.revertedWith(await errors.EXCEED_MAX_PURCHASE_AMOUNT_FOR_KYC_USER())

            // buy successfully (investor6, NORMAL, Not KYC user, community pool)
            await purchaseTokens[1].connect(investors[6]).approve(pool1.address, ethers.constants.MaxUint256);
            // await purchaseTokens[1].connect(investors[6]).approve(pool1.address, parseUnits('100',20));
            const leaf17 = buyWhiteList[17]
            const proof17 = getProof(leaf17)

            expect(await pool1.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('100', 6))).to.be.emit(pool1, Events.Pool.BuyToken)

            await time.increaseTo(await pool1.communityCloseTime())
            // revert buy because out of time
            await expect(pool1.connect(investors[6]).buyTokenInCrowdfundingPool(proof17, parseUnits('10', 6))).to.be.revertedWithCustomError(pool1, 'TimeOutToBuyIDOToken')
        })
    })
})

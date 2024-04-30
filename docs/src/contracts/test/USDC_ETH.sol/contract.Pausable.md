# Pausable
[Git Source](https://github.com/Sotatek-LoiNguyen2/ignition-sc/blob/6fd47416ac9b148d4f43e8bb90a990315ae49b42/contracts/test/USDC_ETH.sol)

**Inherits:**
[Ownable](/contracts/test/USDT_BSC.sol/contract.Ownable.md)

Copyright (c) 2016 Smart Contract Solutions, Inc.
Copyright (c) 2018-2020 CENTRE SECZ0
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Base contract which allows children to implement an emergency stop
mechanism

*Forked from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/feb665136c0dae9912e08397c1a21c4af3651ef3/contracts/lifecycle/Pausable.sol
Modifications:
1. Added pauser role, switched pause/unpause to be onlyPauser (6/14/2018)
2. Removed whenNotPause/whenPaused from pause/unpause (6/14/2018)
3. Removed whenPaused (6/14/2018)
4. Switches ownable library to use ZeppelinOS (7/12/18)
5. Remove constructor (7/13/18)
6. Reformat, conform to Solidity 0.6 syntax and add error messages (5/13/20)
7. Make public functions external (5/27/20)*


## State Variables
### pauser

```solidity
address public pauser;
```


### paused

```solidity
bool public paused = false;
```


## Functions
### whenNotPaused

*Modifier to make a function callable only when the contract is not paused.*


```solidity
modifier whenNotPaused();
```

### onlyPauser

*throws if called by any account other than the pauser*


```solidity
modifier onlyPauser();
```

### pause

*called by the owner to pause, triggers stopped state*


```solidity
function pause() external onlyPauser;
```

### unpause

*called by the owner to unpause, returns to normal state*


```solidity
function unpause() external onlyPauser;
```

### updatePauser

*update the pauser role*


```solidity
function updatePauser(address _newPauser) external onlyOwner;
```

## Events
### Pause

```solidity
event Pause();
```

### Unpause

```solidity
event Unpause();
```

### PauserChanged

```solidity
event PauserChanged(address indexed newAddress);
```


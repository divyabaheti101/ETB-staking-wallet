// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './Wallet.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

contract Staking is ERC20 {

    event WalletCreate(uint256 _walletiD, address _walletAddr);
    event WalletDeposit(uint256 _walletId, uint256 amount);
    event WalletWithdraw(uint256 _walletId, address receiver, uint256 amount);
    event StakeEth(uint256 _walletid, uint256 stakedAmount, uint256 startTime);
    event UnstakeETH(uint256 _walletId, uint256 stakedAmount, uint256 reward);

    using EnumerableMap for EnumerableMap.UintToAddressMap;

    struct StakeWallet{
        Wallet user;
        uint256 stakedAMount;
        uint256 sinceBlock;
        uint256 untilBlock;
    }

    StakeWallet[] private stakeWallets;



    // TODO: It may be a good idea to keep track of all the new stakes in an array
    EnumerableMap.UintToAddressMap private walletsStaked;

    // This defines the total percentage of reward(WEB3 ERC20 token) to be accumulated per second
    uint256 public constant percentPerBlock = 1; // Bonus Exercise: use more granular units

    constructor() ERC20("WEB3 101", "WEB3"){}

    function walletCreate() public returns (uint256 _walletId, address _walletAddr) {
        Wallet wallet = new Wallet();
        stakeWallets.push(StakeWallet(wallet, 0, 0, 0));
        uint256 walletId = stakeWallets.length -1;
        emit WalletCreate(walletId, address(wallet));
        return (walletId, address(wallet));
    }

    function getWallets() public view returns (StakeWallet[] memory) {
        return stakeWallets;
    }

    function walletDeposit(uint256 _walletId)
        public
        payable
        isWalletOwner(_walletId)
    {
        StakeWallet storage wallet = stakeWallets[_walletId];
        wallet.user.deposit{value: msg.value}();
        emit WalletDeposit(_walletId, msg.value);
    }

    function walletBalance(uint256 _walletId) public view returns (uint256) {
        StakeWallet storage wallet = stakeWallets[_walletId];
        return wallet.user.balanceOf();
    }

    function walletWithdraw(
        uint256 _walletId,
        address payable _to,
        uint _amount
    ) public payable isWalletOwner(_walletId) {
        StakeWallet storage wallet = stakeWallets[_walletId];
        wallet.user.withdraw(_to, _amount);
        emit WalletWithdraw(_walletId, _to, _amount);
    }

    // Bonus Exercise: Let user stake any amount of ETH rather than the whole balance
    function stakeEth(uint256 _walletId) public isWalletOwner(_walletId) {
        StakeWallet storage wallet = stakeWallets[_walletId];

        uint256 balanceOfWallet = wallet.user.balanceOf();
        require(balanceOfWallet > 0, "require non zero balance");

        wallet.user.withdraw(payable(address(this)), balanceOfWallet);

        uint256 stakedForBlocks = block.timestamp - wallet.sinceBlock;
        uint256 unclaimedReward = (stakedForBlocks * wallet.stakedAMount * percentPerBlock) /100;
        _mint(msg.sender, unclaimedReward);

        wallet.stakedAMount += balanceOfWallet;
        wallet.sinceBlock = block.timestamp;
        wallet.untilBlock = 0;

        walletsStaked.set(_walletId, address(wallet.user));

        emit StakeEth(_walletId, balanceOfWallet, block.timestamp);
    }

    function currentStake(uint256 _walletId) public view returns (uint256) {
        StakeWallet memory wallet = stakeWallets[_walletId];
        return wallet.stakedAMount;
    }

    function currentReward(uint256 _walletId) public view returns (uint256) {
        StakeWallet memory wallet = stakeWallets[_walletId];
        uint256 stakedForBlocks = block.timestamp - wallet.sinceBlock;
        uint256 unclaimedReward = (stakedForBlocks * wallet.stakedAMount * percentPerBlock) /100;
        return unclaimedReward;
    }

    function totalAddressesStaked() public view returns (uint256) {
        return walletsStaked.length();
    }

    function isWalletStaked(uint256 _walletId) public view returns (bool) {
        return walletsStaked.contains(_walletId);
    }

    function unstakeEth(uint256 _walletId)
        public
        payable
        isWalletOwner(_walletId)
    {
        StakeWallet storage wallet = stakeWallets[_walletId];
        require(wallet.untilBlock == 0, "has already unstaked");

        uint256 currentBalance = wallet.stakedAMount;
        payable(address(wallet.user)).transfer(currentBalance);

        uint256 rewardAmount = currentReward(_walletId);
        _mint(msg.sender, rewardAmount);

        wallet.untilBlock = block.timestamp;
        wallet.sinceBlock = 0;
        wallet.stakedAMount = 0;

        walletsStaked.remove(_walletId);

        emit UnstakeETH(_walletId, wallet.stakedAMount, rewardAmount);
    }

    receive() external payable{}

    modifier isWalletOwner(uint256 walletId) {
        require(msg.sender != address(0), "Invalid owner");
        StakeWallet memory wallet = stakeWallets[walletId];
        require(wallet.user.owner() == msg.sender, "Not owner of the wallet");
        _;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title NeuraWallet
 * @dev Smart contract wallet with multi-signature and spending limits
 * @notice This contract provides enhanced wallet functionality for the Neura ecosystem
 */
contract NeuraWallet is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Structs
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
        uint256 timestamp;
    }

    struct SpendingLimit {
        uint256 dailyLimit;
        uint256 spentToday;
        uint256 lastResetTime;
    }

    // State variables
    mapping(address => bool) public isGuardian;
    mapping(uint256 => mapping(address => bool)) public isConfirmed;
    mapping(address => SpendingLimit) public spendingLimits;
    
    Transaction[] public transactions;
    address[] public guardians;
    
    uint256 public requiredConfirmations;
    uint256 public defaultDailyLimit;
    
    // Events
    event Deposit(address indexed sender, uint256 amount);
    event TransactionSubmitted(uint256 indexed txId, address indexed to, uint256 value);
    event TransactionConfirmed(uint256 indexed txId, address indexed guardian);
    event TransactionExecuted(uint256 indexed txId);
    event TransactionRevoked(uint256 indexed txId, address indexed guardian);
    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);
    event SpendingLimitUpdated(address indexed token, uint256 newLimit);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    // Modifiers
    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "Not a guardian");
        _;
    }

    modifier txExists(uint256 txId) {
        require(txId < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 txId) {
        require(!transactions[txId].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint256 txId) {
        require(!isConfirmed[txId][msg.sender], "Transaction already confirmed");
        _;
    }

    constructor(
        address[] memory _guardians,
        uint256 _requiredConfirmations,
        uint256 _defaultDailyLimit
    ) Ownable(msg.sender) {
        require(_guardians.length > 0, "Guardians required");
        require(
            _requiredConfirmations > 0 && _requiredConfirmations <= _guardians.length,
            "Invalid confirmations"
        );

        for (uint256 i = 0; i < _guardians.length; i++) {
            address guardian = _guardians[i];
            require(guardian != address(0), "Invalid guardian");
            require(!isGuardian[guardian], "Duplicate guardian");
            
            isGuardian[guardian] = true;
            guardians.push(guardian);
        }

        requiredConfirmations = _requiredConfirmations;
        defaultDailyLimit = _defaultDailyLimit;
        
        // Set spending limit for native token (address(0))
        spendingLimits[address(0)] = SpendingLimit({
            dailyLimit: _defaultDailyLimit,
            spentToday: 0,
            lastResetTime: block.timestamp
        });
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Submit a new transaction for approval
     * @param to Destination address
     * @param value Amount of native token to send
     * @param data Transaction data
     */
    function submitTransaction(
        address to,
        uint256 value,
        bytes calldata data
    ) external onlyGuardian returns (uint256) {
        uint256 txId = transactions.length;
        
        transactions.push(Transaction({
            to: to,
            value: value,
            data: data,
            executed: false,
            confirmations: 0,
            timestamp: block.timestamp
        }));

        emit TransactionSubmitted(txId, to, value);
        return txId;
    }

    /**
     * @dev Confirm a pending transaction
     * @param txId Transaction ID to confirm
     */
    function confirmTransaction(uint256 txId)
        external
        onlyGuardian
        txExists(txId)
        notExecuted(txId)
        notConfirmed(txId)
    {
        Transaction storage transaction = transactions[txId];
        transaction.confirmations += 1;
        isConfirmed[txId][msg.sender] = true;

        emit TransactionConfirmed(txId, msg.sender);
    }

    /**
     * @dev Execute a confirmed transaction
     * @param txId Transaction ID to execute
     */
    function executeTransaction(uint256 txId)
        external
        onlyGuardian
        txExists(txId)
        notExecuted(txId)
        nonReentrant
    {
        Transaction storage transaction = transactions[txId];
        
        require(
            transaction.confirmations >= requiredConfirmations,
            "Not enough confirmations"
        );

        // Check spending limit
        _checkAndUpdateSpendingLimit(address(0), transaction.value);

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Transaction failed");

        emit TransactionExecuted(txId);
    }

    /**
     * @dev Revoke confirmation for a transaction
     * @param txId Transaction ID to revoke
     */
    function revokeConfirmation(uint256 txId)
        external
        onlyGuardian
        txExists(txId)
        notExecuted(txId)
    {
        require(isConfirmed[txId][msg.sender], "Transaction not confirmed");

        Transaction storage transaction = transactions[txId];
        transaction.confirmations -= 1;
        isConfirmed[txId][msg.sender] = false;

        emit TransactionRevoked(txId, msg.sender);
    }

    /**
     * @dev Add a new guardian (requires owner)
     * @param guardian Address of new guardian
     */
    function addGuardian(address guardian) external onlyOwner {
        require(guardian != address(0), "Invalid guardian");
        require(!isGuardian[guardian], "Already a guardian");

        isGuardian[guardian] = true;
        guardians.push(guardian);

        emit GuardianAdded(guardian);
    }

    /**
     * @dev Remove a guardian (requires owner)
     * @param guardian Address of guardian to remove
     */
    function removeGuardian(address guardian) external onlyOwner {
        require(isGuardian[guardian], "Not a guardian");
        require(guardians.length - 1 >= requiredConfirmations, "Cannot remove guardian");

        isGuardian[guardian] = false;

        for (uint256 i = 0; i < guardians.length; i++) {
            if (guardians[i] == guardian) {
                guardians[i] = guardians[guardians.length - 1];
                guardians.pop();
                break;
            }
        }

        emit GuardianRemoved(guardian);
    }

    /**
     * @dev Update spending limit for a token
     * @param token Token address (address(0) for native token)
     * @param newLimit New daily limit
     */
    function updateSpendingLimit(address token, uint256 newLimit) external onlyOwner {
        spendingLimits[token].dailyLimit = newLimit;
        emit SpendingLimitUpdated(token, newLimit);
    }

    /**
     * @dev Emergency withdraw (requires owner)
     * @param token Token address (address(0) for native token)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0)) {
            require(address(this).balance >= amount, "Insufficient balance");
            (bool success, ) = owner().call{value: amount}("");
            require(success, "Transfer failed");
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
        
        emit EmergencyWithdraw(token, amount);
    }

    /**
     * @dev Check and update spending limit
     */
    function _checkAndUpdateSpendingLimit(address token, uint256 amount) internal {
        SpendingLimit storage limit = spendingLimits[token];
        
        // Reset daily spending if new day
        if (block.timestamp >= limit.lastResetTime + 1 days) {
            limit.spentToday = 0;
            limit.lastResetTime = block.timestamp;
        }
        
        require(
            limit.spentToday + amount <= limit.dailyLimit,
            "Daily spending limit exceeded"
        );
        
        limit.spentToday += amount;
    }

    // View functions
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getGuardians() external view returns (address[] memory) {
        return guardians;
    }

    function getTransaction(uint256 txId)
        external
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 confirmations,
            uint256 timestamp
        )
    {
        Transaction storage transaction = transactions[txId];
        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.confirmations,
            transaction.timestamp
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NeuraToken
 * @dev ERC20 Token for Neura Testnet ecosystem
 */
contract NeuraToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10**18;
    
    mapping(address => bool) public isExcludedFromFees;
    uint256 public transferFee = 0;
    address public feeRecipient;
    
    event FeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);
    event ExclusionUpdated(address account, bool excluded);

    constructor() ERC20("Neura Token", "NEURA") {
        _mint(msg.sender, 1_000_000_000 * 10**18); // 1 billion initial supply
        feeRecipient = msg.sender;
        isExcludedFromFees[msg.sender] = true;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        _mint(to, amount);
    }

    function setTransferFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        transferFee = newFee;
        emit FeeUpdated(newFee);
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    function setExcludedFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
        emit ExclusionUpdated(account, excluded);
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address sender = _msgSender();
        _executeTransfer(sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _executeTransfer(from, to, amount);
        return true;
    }

    function _executeTransfer(address from, address to, uint256 amount) internal {
        if (transferFee > 0 && !isExcludedFromFees[from] && !isExcludedFromFees[to]) {
            uint256 feeAmount = (amount * transferFee) / 10000;
            uint256 transferAmount = amount - feeAmount;
            
            _transfer(from, feeRecipient, feeAmount);
            _transfer(from, to, transferAmount);
        } else {
            _transfer(from, to, amount);
        }
    }

    function batchTransfer(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 100, "Too many recipients");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }
}

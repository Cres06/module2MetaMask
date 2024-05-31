// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
  address payable public owner;
  uint256 public allowance; 

  uint256 public constant myAllowance = 100 ether;

  event Allowance(address receiver, uint256 amount);

  function getAvailableAmount() public view returns (uint256) {
    return allowance;
  }

  function saveFunds(uint256 amount) public payable {
    require(msg.value >= amount * myAllowance, "Insufficient funds");
    require(allowance >= amount, "Insufficient funds");

    allowance -= amount;

    payable(msg.sender).transfer(amount);

    if (msg.value > amount * myAllowance) {
      payable(msg.sender).transfer(msg.value - amount * myAllowance);
    }

    emit Allowance(msg.sender, amount);
  }

  function spendFunds(uint256 amount) public onlyOwner {
    require(address(this).balance >= amount, "Insufficient funds to spend");
    owner.transfer(amount);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _; 
  }
}
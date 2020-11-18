// SPDX-License-Identifier: MIT

pragma solidity >=0.4.21 <0.7.0;

contract Cause {
    /// @notice entity which created the Cause
    /// @return Etherium Address of Cause Creator 
    address public Owner;

    /// @notice Cause Title
    /// @dev Should not be too long, place some limit
    /// @return Cause Title
    string public Title;

    /// @notice Cause Detail, any description, http links etc...
    /// @dev Should not be too long, place some limit
    /// @return Cause Details
    string public Details;

    /// @notice Total amount(In Ether) Owner wants to raise money from
    /// @dev Dont accept donations once limit is reached
    /// @return Amount in Ether
    uint public TargetAmount;       //TODO: is it required?
    
    /// @notice Total amount(In Ether) collected till now
    /// @dev Sanitize
    /// @return Amount in Ether
    uint public CollectedAmount;
    
    uint public StartTime; //TODO: How to set these values from front end?
    uint public EndTime;


    //TODO: Pass Data in Constructor
    //TODO: Define Event of Donation
    //TODO: Circuit Breaker Pattern
    //TODO: Donate Operation
    //TODO: CanWithdraw modifier
    //TODO: Withdraw Operation
}
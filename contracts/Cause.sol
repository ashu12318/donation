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

    event CauseCreated(address indexed owner, string indexed title);

    constructor(string memory title, string memory details, uint targetAmount, uint startTime, uint endTime) public {
        //GTH: Make use of string library such as https://github.com/willitscale/solidity-util or https://github.com/Arachnid/solidity-stringutils
        
        require(bytes(title).length <= 20, "Please provide a short title which is under 20 character.");
        require(bytes(details).length <= 100, "Please provide a short detail which is under 100 character.");
        require(targetAmount > 0, "Please provide a valid amount for Target Amount.");
        require(startTime > now, "Start time should be a future time.");
        require(endTime > startTime, "End time should be in future compared to Start time.");
        //TODO: Start time, End Time should be in future

        Owner = msg.sender;
        Title = title;
        Details = details;
        TargetAmount = targetAmount;
        StartTime = startTime;
        EndTime = endTime;
        emit CauseCreated(msg.sender, title);
    }

    //TODO: Solidity string library
    //TODO: Define Event of Donation
    //TODO: Donate Operation
    //TODO: Circuit Breaker Pattern: StartDate started, timeline is over
    //TODO: CanWithdraw modifier
    //TODO: Withdraw Operation
}

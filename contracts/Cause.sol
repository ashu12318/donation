// SPDX-License-Identifier: MIT

pragma solidity 0.5.16;

/// @title Cause Contract for Managing Cause Details and Operations
/// @author Ashutosh Singh Parmar
/// @notice Enables user to donate fund and admin to withdraw those funds once cause timeline is over
/// @dev It will be created per Cause
contract Cause {

    bool private WithdrawalDone;

    /// @notice entity which created the Cause
    /// @return Etherium Address of Cause Creator 
    address payable public Owner;

    /// @notice Address responsible for creation of this Contract
    /// @return Address of the Factory Contract
    address public Creator;

    /// @notice Cause Title
    /// @dev Should not be too long, place some limit
    /// @return Cause Title
    string public Title;

    /// @notice Cause Detail, any description, http links etc...
    /// @dev Should not be too long, place some limit
    /// @return Cause Details
    string public Details;

    /// @notice Total amount Owner wants to raise money from
    /// @dev Dont accept donations once limit is reached
    /// @return Amount
    uint public TargetAmount;
    
    /// @notice Time from which contract starts accepting donations
    /// @return Seconds from unix epoch
    uint public StartTime;

    /// @notice Time after which contract will not accept donation
    /// @return Seconds from unix epoch
    uint public EndTime;

    /// @notice Event fired when a Cause Contract is created
    /// @dev For each contract this event must be fired
    /// @param owner Address resposible for creating the contract instance
    /// @param title Title of the Cause
    event CauseCreated(address indexed owner, string indexed title);

    /// @notice Event fired when a donation is made to a cause
    /// @dev fire with everty donation made
    /// @param causeAddress Address of the Cause Contract to which donation is made
    /// @param doner Address which made the donation to cause
    /// @param amount Amount of the donation
    event DonationDone(address indexed causeAddress, address indexed doner, uint amount, uint balance);

    /// @notice Event fired when withdrawal of fund is done successfully from the contract
    /// @dev There will always be only one withdraw event log for a Cause
    /// @param sender Address of the current Cause contract
    /// @param beneficiary Address of the owner i.e. beneficiary of this transaction
    /// @param amount total amount withdrawn  
    event Withdrawal(address indexed sender, address indexed beneficiary, uint amount);

    constructor(string memory title, string memory details, uint targetAmount, uint startTime, uint endTime, address payable owner) public {
        //GTH: Make use of string library such as https://github.com/willitscale/solidity-util or https://github.com/Arachnid/solidity-stringutils
        
        require(bytes(title).length <= 20, "Please provide a short title which is under 20 character.");
        require(bytes(details).length <= 100, "Please provide a short detail which is under 100 character.");
        require(targetAmount > 0, "Please provide a valid amount for Target Amount.");
        require(startTime > now, "Start time should be a future time.");
        require(endTime > startTime, "End time should be in future compared to Start time.");

        Creator = msg.sender;
        Owner = owner;
        Title = title;
        Details = details;
        TargetAmount = targetAmount;
        StartTime = startTime;
        EndTime = endTime;
        WithdrawalDone = false;
        emit CauseCreated(owner, title);
    }

    //Design: AutoDeprication of Operation
    modifier isAcceptingDonation() {
        require(now >= StartTime, "Donation is not being accepted for this cause. Donation period haven't started.");
        require(now <= EndTime, "Donation is not being accepted for this cause. Donation period has expired.");
        require(address(this).balance <= TargetAmount , "Donation is not being accepted for this cause. Target has been achieved.");
        _;
    }

    //Design: Restricted Access
    modifier onlyOwner() {
        require(msg.sender == Owner, "This account is not allowed to invoke this operation.");
        _;
    }

    //Design: Autodeprication of Operation
    modifier canWithdrawFunds() {
        require(EndTime < now, "Withdraw operation not allowed. Cause is still active and accepting donations.");
        require(WithdrawalDone == false, "Withdraw operation not allowed. Funds already withdrawn.");
        _;
    }

    /// @notice Accepts donation payment for the cause from sender active only for a duration
    function Donate() 
        external
        payable 
        isAcceptingDonation {
        emit DonationDone(address(this), msg.sender, msg.value, address(this).balance);
    }

    /// @notice Allows owner of the Cause to withdraw fund once the Cause timeline for donation is over
    /// @dev After this operation Contract instance is of no use
    function Withdraw() 
        external
        onlyOwner
        canWithdrawFunds
    {
        //Design: Instead of using send or transfer, used call: https://consensys.github.io/smart-contract-best-practices/recommendations/#dont-use-transfer-or-send
        uint amountToWithdraw = address(this).balance;
        WithdrawalDone = true; //Design: Reenterancy Attack avoided by updating the state variable
        (bool success, ) = Owner.call.value(amountToWithdraw)(""); //Design: Handling error of external call
        require(success);
        emit Withdrawal(address(this), Owner, amountToWithdraw);
    }
    //TODO: Put a fallback function to revert accidentally sent ethers
}

// SPDX-License-Identifier: MIT

import "./Cause.sol";

pragma solidity 0.5.16;

/// @title Factory Contract for management of Cause Contract
/// @author Ashutosh Singh Parmar
/// @notice Enables to create Cause
contract CauseFactory {
    
    /// @notice Owner of this Factory Contract
    /// @dev Owner will have admin privilages for this Contract
    /// @return Address of the Owner of this Contract
    address public Admin;

    mapping(address => address[]) public CreatorCauseMap; //Design Factory

    mapping(address => CauseStatus) public CauseStatusMap; //Design: Registry of Contract Status, https://medium.com/@i6mi6/solidty-smart-contracts-design-patterns-ecfa3b1e9784
    
    constructor() public {
        Admin = msg.sender;
    }

    /// @notice Structure to hold Cause status
    struct CauseStatus {
        bool Exists;
        bool Active;
    }

    /// @notice Event emitted when a cause is created
    /// @param creator Account Address which created the Cause
    /// @param cause Address of the newly created Cause
    /// @param title Title of the newly created Cause
    event CauseCreated(address indexed creator, address cause, string title);

    /// @notice Creates a new Cause with the provided parameters and emits an Event
    /// @param title Title for Cause
    /// @param detail A brief detail about Cause
    /// @param targetAmount Target Amount for Cause
    /// @param startTime Start Time for Cause
    /// @param endTime End Time for Cause
    function CreateCause(string memory title, string memory detail, uint targetAmount, uint startTime, uint endTime) 
    public
    {
        Cause causeInstance = new Cause(title, detail, targetAmount, startTime, endTime, msg.sender);
        
        CreatorCauseMap[msg.sender].push(address(causeInstance));
        
        CauseStatusMap[address(causeInstance)].Exists = true;
        CauseStatusMap[address(causeInstance)].Active = true;

        emit CauseCreated(msg.sender, address(causeInstance), title);
    }

    /// @notice Gets all the Cause Contract Addresses created by supplied Creator 
    /// @param creator Account Address which created Causes
    /// @return causeAddresses Cause Contract Addresses created by Creator 
    function GetCauses(address creator) 
    public
    view
    returns(address[] memory causeAddresses) {
        return CreatorCauseMap[creator];
    }

    //TODO: Provide Operation Mark Contract InActive, it will be called once fund has been withdrawn from the Contract successfully
}
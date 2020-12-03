# Design Patterns  

Following are the Design Patterns used in this Smart Contract Development  

## CauseFactory.sol  

1. **Circuit Breaker**  
Admin can disable/enable the creation of new Causes in exceptional cases using "ToggleContractStatus" method.  
Rationale: This patterns is necessary in case of emergency where we want to restrict the user from creating new instances of Cause    

2. **Access Restriction**  
Only Admin is allowed to Disable/Enable the CauseFactory Contract using "ToggleContractStatus" method.  
Rationale: This operation should not be available to everyone since they can mess with it and make the system not-usable  

3. **Factory Pattern**  
This Contract act as a Factory which allows user to create as many as Cause Contracts for each Cause created by User  
Rationale: If we maintain all the cause in a single Contract then it will add the overhead of storage, also Cause contracts are not usable after a period. Hence decided to go with individual contract for each cause and maintain only their address at Factory.  

4. **Registry Pattern**  
This Contract maintains a registry of every Cause created.  
It maintains a map of User's Address and Cause Address created by that user  
It maintains a map of Cause Address and its Status which can be used for other functionality in future  

## Cause.sol  

1. **Access Restriction**  
Withdraw Operation is only allowed to the Owner of the Cause i.e. User who created that Cause  

2. **Auto Depricate**  
"Donate" operation automatically depricates once the timeline for donation is over  

3. **Withdrawal Pattern: Pull over Push**  
"Withdraw" operation is Cause's owner responsibility to call and withdraw and hence shifting risk from Contract to User  


## MockCause.sol  
1. Time Dependent Logic Test  
Cause Contract opertaions are time dependent hence in order to test those logic we need to shift time.  
To enable that feature I used MockCause contract to provide a method "shiftTime" which shifts the desired time storage variables.  
It inherits the Cause contract hence it have all the features of Cause contract while testing.  
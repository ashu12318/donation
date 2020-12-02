A document called avoiding_common_attacks.md explaining security steps you took what measures you took to ensure your contracts are not susceptible to common attacks AND

Security Tools / Common Attacks:
○  	Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks

# Security Steps

Following are the Security meausres implemented to ensure Contract is not susceptible to common attacks  

## Cause.sol

1. Withdrawal Pattern  
In order to avoid DOS risk, this pattern was used.  
Here user is responsible to withdraw funds once the timeline for donation is over.  
"Withdraw" operation is used to withdraw funds  

2. Reenterancy Attack
In "Withdraw" operation we are updating a storage variable to avoid multiple withdrawal from the Contract.
Here we are updating all the storage state variables before begining the transfer of fund.

3. Avoid using transfer or send to transfer fund
To transfer fund to user I used call, to avoid a situation where gas requirement is more than fixed(2300 gas) supply sent to transfer or send
"Withdraw" operation implements this.

4. Handle errors in external calls
Response of call() method call is being checked to ensure transfer was success, and reverted the whole transaction if it fails.
"Withdraw" operation implements this.
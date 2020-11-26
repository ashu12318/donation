# donation
Donation in crypto

# Users
- Doner 
- Organiztion/Individual Raising the money

# Feature
- Create a Cause w/
-- Header
-- Description(Potentialy an offchain link)
-- Target Amount
-- Accumulated Fund
-- Deadline
-- Start Date
-- Owner/Creator

- Accept Ether

- Donate
-- Auto Deprication: Based on timeline and Target Amount

- Withdraw Donation: Withdrawal Pattern
-- Once timeline is finished
-- Creator of the Contract
-- Auto Deprication: Close the contract after there is no fund...

- Contract for each Cause
-- Factory Pattern
---- Use it for creating a new contract for every cause 
---- Act as Registry(To provide address of all the causes)
---- Circuit Breaker: Disable Contract after timeline is over

- Fetch List of all active/future causes
- Fetch all Cause by creator's address

# Transactions
- Create a Cause: Creator/Owner
- Donate: Users
- Withdraw: Creator/Owner
# Read Operations
- Fetch all Causes/Donations: Users
- Fetch Single Cause: Users

# Future Goals
- Accept Donation in Any Token: Uniswap/Metamask Integration
- Auto Swap to a Target stable coin
-- Add target Stable Coin token while creating Cause

- Organization's Dashboard with all the causes

# Flow
- Cause Details/Doation Page
- Landing Page
- Create Cause Page
- Browser All Cause Page

# TODO
- Any library use?
- Security Risk Handled
- Include SafeMath
- Testing
-- Inculed Openzappline Test Helper

# TODO: Non-Functional
- Deploy to testnet
- 

# Bonus
- Ugradability

# Concerns
- Authenticity of Cause Creator?
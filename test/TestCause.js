let BN = web3.utils.BN;
const Cause = artifacts.require("Cause");
const MockCause = artifacts.require("MockCause");
let catchRevert = require("./exceptionHelper.js").catchRevert

contract("Cause", accounts => {
    let ownerAccount = accounts[0];
    let donerAccount1 = accounts[1];
    let account3 = accounts[2];

    it("Constructor Initialization", async () => {
        //Arrange
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;

        //Act
        let causeInstance = await Cause.new(title, detail, targetAmount, startTime, endTime);

        //Assert
        let actualTitle = await causeInstance.Title.call();
        let actualDetail = await causeInstance.Details.call();
        let actualTargetAmount = await causeInstance.TargetAmount.call();
        let actualStartTime = await causeInstance.StartTime.call();
        let actualEndTime = await causeInstance.EndTime.call();

        assert.equal(actualTitle, title, "Title do not match.");
        assert.equal(actualDetail, detail, "Details do not match.");
        assert(actualTargetAmount.eq(new BN(targetAmount)), "Target Amount do not match.");
        assert(actualStartTime.eq(new BN(startTime)), "Start Time do not match."); 
        assert(actualEndTime.eq(new BN(endTime)), "End Time do not match.");
    });

    it("Constructor Initialization should fail: Title length should be less than 20 characters", async () => {
        //Arrange
        let title = "Covid Relief Fund12 ThisPartIsExtra";
        let detail = "A fund for relief measures for local businesses.";
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;

        //Act
        let createInstancePromise = Cause.new(title, detail, targetAmount, startTime, endTime);

        //Assert
        await catchRevert(createInstancePromise, "Please provide a short title which is under 20 character.");
    });

    it("Constructor Initialization should fail: Detail length should be less than 100 characters", async () => {
        //Arrange
        let title = "Covid Relief Fund";
        let detail = "A very long string with more than 100 characters. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.";
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;

        //Act
        let createInstancePromise = Cause.new(title, detail, targetAmount, startTime, endTime);

        //Assert
        await catchRevert(createInstancePromise, "Please provide a short detail which is under 100 character.");
    });
    
    it("Constructor Initialization should fail: Target amount should be a positive value.", async () => {
        //Arrange
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 0;

        //Act
        let createInstancePromise = Cause.new(title, detail, targetAmount, startTime, endTime);

        //Assert
        await catchRevert(createInstancePromise, "Please provide a valid amount for Target Amount.");
    });

    it("Constructor Initialization should fail: Start time should be in furure.", async () => {
        //Arrange
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let startTime = Math.floor(Date.now() / 1000) - 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;

        //Act
        let createInstancePromise = Cause.new(title, detail, targetAmount, startTime, endTime);

        //Assert
        await catchRevert(createInstancePromise, "Start time should be a future time.");
    });

    it("Constructor Initialization should fail: End Time should be higher than Start Time.", async () => {
        //Arrange
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 10;
        let targetAmount = 100;

        //Act
        let createInstancePromise = Cause.new(title, detail, targetAmount, startTime, endTime);

        //Assert
        await catchRevert(createInstancePromise, "End time should be in future compared to Start time.");
    });

    //TODO: Verify emitted events during constructor call

    it("Accept Donation", async () => {
        //Arrange
        let secondsToAdd = 100;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 1000;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        var donationAmount = 500;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);

        //Act
        await mockCauseInstance.shiftTime(secondsToAdd + 10);
        let result = await mockCauseInstance.Donate({ from: donerAccount1, value: donationAmount });

        //Assert
        assert.equal(result.logs.length, 1, "Only one event is expected during this operation.");
        assert.equal(result.logs[0].event, "DonationDone", "Wrong event emitted. Expected DonationDone event.");
        assert(new BN(donationAmount).eq(result.logs[0].args.amount), "Wrong amount donated. Donate full amount to cause."); //TODO: Insert dynamic values in this error message string
    });

    it("Donation should completely go to Contract", async () => {
        //Arrange
        let secondsToAdd = 100;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 1000;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        var donationAmount = 500;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);
        let initialBalance = await web3.eth.getBalance(mockCauseInstance.address);

        //Act
        await mockCauseInstance.shiftTime(secondsToAdd + 10);
        let result = await mockCauseInstance.Donate({ from: donerAccount1, value: donationAmount });
        let finalBalance = await web3.eth.getBalance(mockCauseInstance.address);
        let expectedFinalBalance = new BN(initialBalance).add(new BN(donationAmount));

        //Assert
        assert(new BN(finalBalance).eq(expectedFinalBalance), "Contract Balance after donation do not match with expected value.");
    });

    it("Do not accept Donation before Start Time", async () => {
        //Arrange
        let secondsToAdd = 1000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        var donationAmount = 1000;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);

        //Act
        let donatePromise = mockCauseInstance.Donate({ from: donerAccount1, value: donationAmount });

        //Assert
        await catchRevert(donatePromise, "Donation is not being accepted for this cause. Donation period haven't started.");
    });
    
    it("Do not accept Donation after End Time", async () => {
        //Arrange
        let secondsToAdd = 1000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let donationAmount = 1000;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);

        //Act
        await mockCauseInstance.shiftTime(secondsToAdd + 10);
        let donatePromise = mockCauseInstance.Donate({ from: donerAccount1, value: donationAmount });

        //Assert
        await catchRevert(donatePromise, "Donation is not being accepted for this cause. Donation period has expired.");
    });

    it("Do not accept Donation after Target amount has reached", async () => {
        //Arrange
        let secondsToAdd = 1000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let donationAmount = 100;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);

        //Act
        await mockCauseInstance.shiftTime(secondsToAdd + 10);
        let donation1Result = await mockCauseInstance.Donate({ from: donerAccount1, value: donationAmount });
        let donation2Promise = mockCauseInstance.Donate({ from: donerAccount1, value: donationAmount });

        //Assert
        await catchRevert(donation2Promise, "Donation is not being accepted for this cause. Target has been achieved.");
    });

    it("Withdraw Fund", async () => {
        //Arrange
        let secondsToAdd = 100;
        let secondsToAddEndTime = 2000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + secondsToAddEndTime;
        let donationAmount = 100;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);
        let gasPrice = 50;

        await mockCauseInstance.shiftTime(secondsToAdd + 10);

        let result = await mockCauseInstance.Donate({from : donerAccount1, value: donationAmount});
        let contractBalanceAfterDonation = new BN(await web3.eth.getBalance(mockCauseInstance.address));
        await mockCauseInstance.shiftTime(secondsToAddEndTime + 10);

        let initialBalanceOfOwner = new BN(await web3.eth.getBalance(await mockCauseInstance.Owner.call()));

        //Act
        let withdrawResult = await mockCauseInstance.Withdraw({gasPrice: gasPrice});
        let gasCost = new BN(withdrawResult.receipt.gasUsed * gasPrice);
        let finalBalanceOfOwner = new BN(await web3.eth.getBalance(await mockCauseInstance.Owner.call()));
        let expectedfinalBalanceOfOwner = initialBalanceOfOwner.add(contractBalanceAfterDonation).sub(gasCost);

        //Assert
        assert(finalBalanceOfOwner.eq(expectedfinalBalanceOfOwner), "Withdrawal failed. Owner's fund do not match.");
    });

    it("Withdraw: Emit Withdrawal event", async () => {
        //Arrange
        let secondsToAdd = 100;
        let secondsToAddEndTime = 2000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + secondsToAddEndTime;
        let donationAmount = 100;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);

        await mockCauseInstance.shiftTime(secondsToAdd + 10);

        let result = await mockCauseInstance.Donate({from : donerAccount1, value: donationAmount});
        let contractBalanceAfterDonation = new BN(await web3.eth.getBalance(mockCauseInstance.address));
        
        await mockCauseInstance.shiftTime(secondsToAddEndTime + 10);
        //Act
        let withdrawResult = await mockCauseInstance.Withdraw();

        //Assert
        assert.equal(withdrawResult.logs.length, 1, "Withdrawal failed. Only one event is expected.");
        assert.equal(withdrawResult.logs[0].event, "Withdrawal", "Withdrawal failed. Withdrawal event expected.");
        assert.equal(withdrawResult.logs[0].args.sender, mockCauseInstance.address, "Withdrawal failed. Cause Address do not match.");
        assert.equal(withdrawResult.logs[0].args.beneficiary, await mockCauseInstance.Owner.call(), "Withdrawal failed. Benificiary Address do not match.");
        assert(withdrawResult.logs[0].args.amount.eq(contractBalanceAfterDonation), "Withdrawal failed. Amount do not match.");
    });

    it("Withdraw should fail: Withdrawal done by an account who is not the owner", async () => {
        //Arrange
        let secondsToAdd = 100;
        let secondsToAddEndTime = 2000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + secondsToAddEndTime;
        let donationAmount = 100;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);

        await mockCauseInstance.shiftTime(secondsToAdd + 10);
        await mockCauseInstance.Donate({from : donerAccount1, value: donationAmount});
        await mockCauseInstance.shiftTime(secondsToAddEndTime + 10);

        //Act
        let withdrawPromise = mockCauseInstance.Withdraw({from: account3});

        //Assert
        await catchRevert(withdrawPromise, "This account is not allowed to invoke this operation.");
    });

    it("Withdraw should fail: Withdrawal done before End Time", async () => {
        //Arrange
        let secondsToAdd = 100;
        let secondsToAddEndTime = 2000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + secondsToAddEndTime;
        let donationAmount = 100;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);
        
        await mockCauseInstance.shiftTime(secondsToAdd + 10);
        await mockCauseInstance.Donate({from : donerAccount1, value: donationAmount});

        //Act
        let withdrawPromise = mockCauseInstance.Withdraw();
        
        //Assert
        await catchRevert(withdrawPromise, "Withdraw operation not allowed. Cause is still active and accepting donations.");
    });

    it("Withdraw should fail: Withdrawal done more than once", async () => {
        //Arrange
        let secondsToAdd = 100;
        let secondsToAddEndTime = 2000;
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let targetAmount = 100;
        let startTime = Math.floor(Date.now() / 1000) + secondsToAdd;
        let endTime = Math.floor(Date.now() / 1000) + secondsToAddEndTime;
        let donationAmount = 50;
        let mockCauseInstance = await MockCause.new(title, detail, targetAmount, startTime, endTime);
        
        await mockCauseInstance.shiftTime(secondsToAdd + 10);
        await mockCauseInstance.Donate({from : donerAccount1, value: donationAmount});
        await mockCauseInstance.shiftTime(secondsToAddEndTime + 10);

        //Act
        await mockCauseInstance.Withdraw();
        let withdrawPromise = mockCauseInstance.Withdraw();
        
        //Assert
        await catchRevert(withdrawPromise, "Withdraw operation not allowed. Funds already withdrawn.");
    });
});
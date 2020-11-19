const Cause = artifacts.require("Cause");

contract("Cause", accounts => {
    let ownerAccount = accounts[0];

    it("Check Constructor Initialization", async () => {
        //Act
        const causeInstance = await Cause.deployed();

        //Assert
        let title = await causeInstance.Title.call();
        let details = await causeInstance.Details.call();
        let targetAmount = await causeInstance.TargetAmount.call();
        let startTime = await causeInstance.StartTime.call();
        let endTime = await causeInstance.EndTime.call();

        console.log(startTime);
        console.log(startTime.toNumber());

        let expectedStartTime = Math.floor(Date.now() / 1000) + 1000;
        let expectedEndTime = Math.floor(Date.now() / 1000) + 2000;

        assert.equal(title, "Covid Relief Fund", "Title do not match.");
        assert.equal(details, "A fund for relief measures for local businesses.", "Details do not match.");
        assert.equal(targetAmount, 100, "Target Amount do not match.");
        assert.equal(startTime, expectedStartTime, "Start Time do not match.");
        assert.equal(endTime, expectedEndTime, "End Time do not match.");
    });

    //TODO: Write Tests for Exceptions i.e. invalid inputs in constructor


});
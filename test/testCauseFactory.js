const CauseFactory = artifacts.require("CauseFactory");
let catchRevert = require('./exceptionHelper.js').catchRevert;

contract("CauseFactory", accounts => {
    let account1 = accounts[0];
    let account2 = accounts[1];

    it("Constructor Initialization", async () => {
        //Act
        let causeFactoryInstance = await CauseFactory.new({from: account1});

        //Assert
        let admin = await causeFactoryInstance.Admin.call();
        assert.equal(admin, account1, "Expected Admin for this contract do not match.");
    });

    it("Create Cause", async () => {
        //Arrange
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;
        let causeFactoryInstance = await CauseFactory.new({from: account1});

        //Act
        let createCauseResult = await causeFactoryInstance.CreateCause(title, detail, targetAmount, startTime, endTime, { from: account1});

        //Assert
        let causeAddress = await causeFactoryInstance.Causes.call(0);
        let causeAddressSaved = await causeFactoryInstance.CreatorCauseMap.call(account1, 0);
        let causeStatus = await causeFactoryInstance.CauseStatusMap.call(causeAddress);
        assert(causeAddressSaved, causeAddress);
        assert(causeStatus.Exists, "Cause status Exists not updated properly in mapping.");
        assert(causeStatus.Active, "Cause status Active not updated properly in mapping.");
    });

    it("Create Cause: Emit CauseCreated Event", async () => {
        //Arrange
        let title = "Covid Relief Fund";
        let detail = "A fund for relief measures for local businesses.";
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;
        let causeFactoryInstance = await CauseFactory.new({from: account1});

        //Act
        let createCauseResult = await causeFactoryInstance.CreateCause(title, detail, targetAmount, startTime, endTime, { from: account1});

        //Assert
        assert.equal(createCauseResult.logs.length, 1, "Expected CauseCreated event. Exactly one event was expected.");
        assert.equal(createCauseResult.logs[0].event, "CauseCreated", "Expected CauseCreated event. Some other event was fired.");
        assert.equal(createCauseResult.logs[0].args.creator, account1, "Expected CauseCreated event. Creator of event do not match.");
        assert.equal(createCauseResult.logs[0].args.title, title, "Expected CauseCreated event. Title of event do not match.");
    });

    it("Get All Cause", async () => {
        //Arrange
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;
        let causeFactoryInstance = await CauseFactory.new({from: account1});

        //Act
        await causeFactoryInstance.CreateCause("Title1", "Detail 1", 100, startTime, endTime, { from: account1});
        await causeFactoryInstance.CreateCause("Title2", "Detail 2", 100, startTime, endTime, { from: account1});
        await causeFactoryInstance.CreateCause("Title3", "Detail 3", 100, startTime, endTime, { from: account1});

        //Assert
        let causeAddresses = await causeFactoryInstance.GetAllCauses.call({ from: account2 });
        assert.equal(causeAddresses.length, 3, "Expected 3 Causes.");
    });

    it("Get all Cause for a Creator", async () => {
        //Arrange
        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;
        let causeFactoryInstance = await CauseFactory.new({from: account1});

        //Act
        let createCauseResult1 = await causeFactoryInstance.CreateCause("Title1", "Detail 1", 100, startTime, endTime, { from: account1});
        let createCauseResult2 = await causeFactoryInstance.CreateCause("Title2", "Detail 2", 100, startTime, endTime, { from: account1});

        //Assert
        let causeAddresses = await causeFactoryInstance.GetCauses.call(account1, {from: account2});
        assert.equal(causeAddresses.length, 2, "Expected 2 Causes.");
    });

    it("Disable Cause Factory: Do not allow contract creation operation", async () => {
        //Arrange
        let causeFactoryInstance = await CauseFactory.new({ from: account1 });
        await causeFactoryInstance.ToggleContractStatus({ from: account1 });

        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;

        //Act
        let createCauseResult = causeFactoryInstance.CreateCause("Title1", "Detail 1", 100, startTime, endTime, { from: account1});

        //Assert
        catchRevert(createCauseResult, "Contract is disabled. No operation allowed.");
    });

    it("Enable Cause Factory", async () => {
        //Arrange
        let causeFactoryInstance = await CauseFactory.new({ from: account1 });
        await causeFactoryInstance.ToggleContractStatus({ from: account1 });
        await causeFactoryInstance.ToggleContractStatus({ from: account1 });

        let startTime = Math.floor(Date.now() / 1000) + 100;
        let endTime = Math.floor(Date.now() / 1000) + 2000;
        let targetAmount = 100;

        //Act
        let createCauseResult = await causeFactoryInstance.CreateCause("Title1", "Detail 1", 100, startTime, endTime, { from: account1});

        //Assert
        let causeAddress = await causeFactoryInstance.Causes.call(0);
        let causeAddressSaved = await causeFactoryInstance.CreatorCauseMap.call(account1, 0);
        let causeStatus = await causeFactoryInstance.CauseStatusMap.call(causeAddress);
        assert(causeAddressSaved, causeAddress);
        assert(causeStatus.Exists, "Cause status Exists not updated properly in mapping.");
        assert(causeStatus.Active, "Cause status Active not updated properly in mapping.");
    });

    it("Disable Cause Factory: Only Admin is allowed", async () => {
        //Arrange
        let causeFactoryInstance = await CauseFactory.new({ from: account1 });

        //Act
        let response = causeFactoryInstance.ToggleContractStatus({ from: account2 });

        //Assert
        catchRevert(response, "Only admin is allowed to execute this operation.");
    });
});
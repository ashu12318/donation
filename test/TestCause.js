const Cause = artifacts.require("Cause");

contract("Cause", accounts => {
    let ownerAccount = accounts[0];

    it("Set the Value", async () => {
        let valueToSave = 10;
        const causeInstance = await Cause.deployed();
        let returnValue = await causeInstance.UpdateStorage(valueToSave, {from: ownerAccount});
        //await debug(causeInstance.UpdateStorage(valueToSave, {from: ownerAccount}));
        let storedValue = await causeInstance.dummyStorageVariable.call();

        assert.equal(storedValue, valueToSave, "The value 10 was not stored.");
    });
});
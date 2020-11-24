const errorString = "VM Exception while processing transaction: ";

async function tryCatch(promise, reason, message) {
    try {
        await promise;
        throw null;
    }
    catch (error) {
        assert(error, "Expected a VM exception but did not get one");
        assert(error.message.search(errorString + reason) >= 0, "Expected an error containing '" + errorString + reason + "' but got '" + error.message + "' instead");
        assert(error.message.search(message) >= 0, "Expected an error containing '" + message + "' but got '" + error.message + "' instead");
    }
};

module.exports = {
    catchRevert            : async function(promise, message) {await tryCatch(promise, "revert"             , message);},
    catchOutOfGas          : async function(promise, message) {await tryCatch(promise, "out of gas"         , message);},
    catchInvalidJump       : async function(promise, message) {await tryCatch(promise, "invalid JUMP"       , message);},
    catchInvalidOpcode     : async function(promise, message) {await tryCatch(promise, "invalid opcode"     , message);},
    catchStackOverflow     : async function(promise, message) {await tryCatch(promise, "stack overflow"     , message);},
    catchStackUnderflow    : async function(promise, message) {await tryCatch(promise, "stack underflow"    , message);},
    catchStaticStateChange : async function(promise, message) {await tryCatch(promise, "static state change", message);},
};

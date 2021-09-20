var sequential = require("sequential-ids");

var generator = new sequential.Generator({
    digits:7,
    restore:"5000000"
})

generator.start();

module.exports = generator;
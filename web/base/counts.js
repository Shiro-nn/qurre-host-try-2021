const mongoose = require("mongoose");
module.exports = mongoose.model("counts", new mongoose.Schema({
    accounts: { type: Number, default: 0 },
    hosts: { type: Number, default: 0 },
}));
const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("host", new Schema({
    id: { type: Number, default: 0 },
    name: { type: String, default: '' },
    ip: { type: String, default: '' },
    port: { type: Number, default: 7777 },
}));
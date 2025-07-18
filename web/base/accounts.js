const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("accounts", new Schema({
    email: { type: String, default: '' },
    id: { type: Number, default: 0 },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
    ips: { type: Array, default: [] },
    ip: { type: String, default: '' },
    cookie: { type: String, default: '' },
    passKey: { type: String, default: '' },
}));
const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("processes", new Schema({
    id: { type: String, default: '' },
    owner: { type: Number, default: 0 },
    name: { type: String, default: '' },
    host: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    pay: { type: String, default: '' },
    pay_link: { type: String, default: '' },
}));
const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("servers", new Schema({
    id: { type: String, default: '' },
    owner: { type: Number, default: 0 },
    name: { type: String, default: '' },
    ip: { type: String, default: '' },
    password: { type: String },
    port: { type: Number, default: 0 },
    host: { type: Number, default: 0 },
    expires: { type: Number, default: Date.now() + (1000 * 60 * 60 * 24 * 30) },
	process: {
		type: Object,
		default: {
			builded: false,
			cf: 0,
			id: 0,
		}
	},
}));
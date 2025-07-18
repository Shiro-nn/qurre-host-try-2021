const mongoose = require("mongoose");
const logger = require("./helpers/logger");
const config = require("./config");
require("moment-duration-format");

const init = async () => {
    mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        logger.log("Connected to the Mongodb database.", "log");
        require("./dashboard/app").load();
        require("./socket").create();
    }).catch((err) => {
        logger.log("Unable to connect to the Mongodb database. Error:"+err, "error");
    });
};

init();
process.on("unhandledRejection", (err) => {
    console.error(err);
});
process.on("uncaughtException", (err) => {
    console.error(err);
});
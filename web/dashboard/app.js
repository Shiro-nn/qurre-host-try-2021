const config = require('../config');

module.exports.load = async() => {
    const express = require("express");
    const path = require("path");
    const bodyParser = require("body-parser");
    const https = require("https");
    const session = require("express-session");
    const cookieParser = require('cookie-parser');
    const passport = require('passport');

    const apiRouter = require("./routes/api");
    const authRouter = require("./routes/authorization");
    const allRouter = require("./routes/all");
    const productsRouter = require("./routes/products");

    const cdn_host_link = config.dashboard.cdn;
    const cdn_reserve = config.dashboard.cdn_reserve;

    app = express();
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    })
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    app.use(passport.initialize());
    app.use(passport.session());
    app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .engine("html", require("ejs").renderFile)
    .set("view engine", "ejs")
    .use(cookieParser())
    .use(express.static(path.join(__dirname, "/public")))
    .set('views', path.join(__dirname, "/views"))
    .use(session({
        secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
        proxy: true,
        resave: true,
        saveUninitialized: true
        })
    )
    //.use("/", apiRouter)
    .use("/", authRouter)
    .use("/", allRouter)
    .use("/", productsRouter)
    .use(function(req, res){
        let cdn_host = cdn_host_link;
        if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
        res.status(404).render("errors/404.ejs", {cdn_host});
    })
    .use(function(err, req, res, next) {
        let cdn_host = cdn_host_link;
        if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
        res.status(500).render("errors/500.ejs", {cdn_host});
        const { Webhook } = require('discord-webhook-node');
        const hook = new Webhook("https://discord.com/api/webhooks/811153851570061364/OAJHaKlspZQC4imQ8Rvp_n0M09AzeNyJJyQYsniJ6yqaWYX6Izwxf9kHqwNaBBLqF6yH");
        hook.setUsername('Qurre Host'); hook.setAvatar('https://cdn.scpsl.store/qurre/host.png');
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
    })
    .listen(80);
    https.createServer({
        key: require("./crt").key,
        cert: require("./crt").crt,
        passphrase: ''
    }, app)
    .listen(443);
};
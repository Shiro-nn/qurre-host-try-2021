const vhost = require('vhost');
const express = require("express"),
router = express.Router();
let accountsData = require("../../base/accounts");
const config = require("../../config");
const host = config.dashboard.baseURL;
let cdn_host_link = config.dashboard.cdn;
let cdn_reserve = config.dashboard.cdn_reserve;
router.get('/', vhost(host, async(req, res) => {
	let cdn_host = cdn_host_link;
	if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
	let is_logged =  false;
	if (req.session.user != null){
		let userData = await accountsData.findOne({ id: req.session.user.id });
		req.session.user = userData;
        is_logged = true;
    }
	let udata = req.session.user;
	res.render("index.ejs", {cdn_host, is_logged, udata});
}));
module.exports = router;
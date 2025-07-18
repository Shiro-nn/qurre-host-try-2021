const vhost = require('vhost');
const express = require("express"),
router = express.Router();
const crypto = require('crypto');
const Emails = require('./modules/email-dispatcher');
let accountsData = require("../../base/accounts");
let countsData = require("../../base/counts");
const config = require("../../config");
const host = config.dashboard.baseURL;
let cdn_host_link = config.dashboard.cdn;
let cdn_reserve = config.dashboard.cdn_reserve;
router.get('/authorization', vhost(host, async(req, res) => {
    let query = '/';
    if(req.query.redirect !== null && req.query.redirect !== undefined) query += req.query.redirect;
    if(req.session.user != null && req.session.user != undefined) return res.redirect(query);
	let cdn_host = cdn_host_link;
	if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
    if (req.cookies.login == undefined) return res.render("authorization/authorization.ejs", {cdn_host});
    let ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.replace('::ffff:', '');
    let userData = await accountsData.findOne({cookie:req.cookies.login, ip});
	if (userData == null || userData == undefined) return res.render("authorization/authorization.ejs", {cdn_host});
    req.session.user = userData;
    res.redirect(query);
}));
router.get('/authorization/reset-password', vhost(host, async(req, res) => {
	let cdn_host = cdn_host_link;
	if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
    const passKey = req.query.key;
    const _data = await accountsData.findOne({passKey});
    if(passKey == '' || passKey == null || _data == null || _data == undefined) return res.redirect('/authorization');
    req.session.passKey = passKey;
    res.render("authorization/reset.ejs", {cdn_host});
}));
router.post('/authorization/login', vhost(host, async(req, res) => {
    let userData = await accountsData.findOne({user: req.body.user});
    if(userData == null || userData == undefined) return res.status(404).send('user-not-found');
    const right = validatePassword(req.body.pass, userData.pass);
    if(!right) return res.status(400).send('invalid-password');
    let ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.replace('::ffff:', '');
    if(req.body.remember){
        const key = await generateLoginKey(userData.user, ip);
        res.cookie('login', key, { expires: new Date(253402300000000) });
    }
    req.session.user = userData;
    res.send(`successfully`);
    if(userData.ips.filter(x => x == ip).length < 1){
        userData.ips.push(ip);
		userData.markModified("ips");
        await userData.save();
        require("ipinfo")(ip, '').then(cLoc => {
            userData.ip_info = cLoc;
            userData.ip = ip;
            Emails.new_login(userData);
        });
    }
}));
router.post('/authorization/signup', vhost(host, async(req, res) => {
    if(req.body.user == null || req.body.user == undefined || req.body.user.length > 25) return res.status(400).send('username-many');
    if(req.body.pass == null || req.body.pass == undefined || req.body.pass.length < 6) return res.status(400).send('password-few-length');
    if(!validateEmail(req.body.email)) return res.status(400).send('email-null');
    let _data1 = await accountsData.findOne({user: req.body.user});
    if(_data1 != null && _data1 != undefined) return res.status(400).send('username-taken');
    let _data2 = await accountsData.findOne({email: req.body.email});
    if(_data2 != null && _data2 != undefined) return res.status(400).send('email-taken');
    let ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.replace('::ffff:', '');
    let pass = saltAndHash(req.body.pass);
    let counts = await countsData.findOne();
    if(counts === null || counts === undefined) counts = new countsData({accounts: 0});
    counts.accounts++;
    await counts.save();
    let userData = await new accountsData({
        email: req.body.email,
        user: req.body.user,
        id: counts.accounts,
        pass, ip,
    });
    userData.ips.push(ip);
    await userData.save();
    req.session.user = userData;
    res.status(200).send('successfully');
    Emails.register(userData);
}));
router.post('/authorization/logout', vhost(host, async(req, res) => {
	res.clearCookie('login');
	req.session.destroy(function(e){ res.status(200).send('successfully'); });
}));
router.post('/authorization/lost-password', vhost(host, async(req, res) => {
	let email = req.body.email;
    if(!validateEmail(email)) return res.status(400).send('email-null');
    let ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.replace('::ffff:', '');
    let passKey = guid() + guid();
    let userData = await accountsData.findOne({email});
    if(userData == null || userData == undefined) return res.status(404).send('account not found');
    userData.ip = ip;
    userData.passKey = passKey;
    userData.cookie = '';
    await userData.save();
    Emails.dispatchResetPasswordLink(userData, function(e, m){
        if (!e) return res.status(200).send('successfully');
        for (k in e) console.log('ERROR : ', k, e[k]);
        res.status(400).send('email error');
    });
}));
router.post('/authorization/reset-password', vhost(host, async(req, res) => {
    const _pass = req.body.pass;
    if(_pass == null || _pass == undefined || _pass.length < 6) return res.status(400).send('password-few-length');
	let passKey = req.session.passKey;
    let ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.replace('::ffff:', '');
    const hash = saltAndHash(_pass);
	req.session.destroy();
    let newPass = hash;
    let userData = await accountsData.findOne({passKey});
    if(userData == null || userData == undefined) return res.status(404).send('account not found');
    userData.pass = newPass;
    userData.ip = ip;
    userData.passKey = '';
    await userData.save();
    res.status(200).send('successfully');
    require("ipinfo")(ip, '').then(cLoc => {
        userData.ip_info = cLoc;
        userData.ip = ip;
        Emails.reset_password(o);
    }).catch(() => Emails.reset_password(userData));
}));
module.exports = router;
const guid = function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
var sha256 = function(str) {
	return crypto.createHash('sha256').update(str).digest('hex');
}
var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}
var saltAndHash = function(pass)
{
	var salt = generateSalt();
	return salt + sha256(pass + salt);
}
var validatePassword = function(plainPass, hashedPass)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + sha256(plainPass + salt);
	return hashedPass === validHash;
}
var generateLoginKey = async function(user, ipAddress)
{
	let cookie = guid();
	let userData = await accountsData.findOne({user:user});
	userData.ip = ipAddress;
	userData.cookie = cookie;
	await userData.save();
    return cookie;
}
function validateEmail(e) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
}
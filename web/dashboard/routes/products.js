const vhost = require('vhost');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const express = require("express"),
router = express.Router();
const processesData = require("../../base/processes");
const accountsData = require("../../base/accounts");
const serversData = require("../../base/servers");
const config = require("../../config");
const Hosts = require("./modules/Hosts");
const HostManager = require("./modules/HostManager");
const host = config.dashboard.baseURL;
const cdn_host_link = config.dashboard.cdn;
const cdn_reserve = config.dashboard.cdn_reserve;
const QurreAPI = require('qurre-pay');
const Qurre = new QurreAPI(config.payments.secret, config.payments.public);
router.get('/products', vhost(host, async(req, res) => {
	if (req.session.user == null) return res.redirect(`/authorization?redirect=products`);
	let cdn_host = cdn_host_link;
	if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
    let userData = await accountsData.findOne({ id: req.session.user.id });
    let servers = await serversData.find({ owner: req.session.user.id });
    req.session.user = userData;
	res.render("products/list.ejs", {cdn_host, is_logged: true, udata: req.session.user, servers});
}));
router.get('/products/buy', vhost(host, async(req, res) => {
	if (req.session.user == null) return res.redirect(`/authorization?redirect=products/buy`);
	let cdn_host = cdn_host_link;
	if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
    let userData = await accountsData.findOne({ id: req.session.user.id });
    req.session.user = userData;
	res.render("products/buy.ejs", {cdn_host, is_logged: true, udata: req.session.user, hosts:config.hosts});
}));
router.get('/products/process/:id', vhost(host, async(req, res, next) => {
	if (req.session.user == null) return res.redirect(`/authorization?redirect=products/process/${req.params.id}`);
	let cdn_host = cdn_host_link;
	if (req.cookies.cdn != undefined) cdn_host = cdn_reserve;
    let userData = await accountsData.findOne({id: req.session.user.id});
    let processData = await processesData.findOne({id: req.params.id, owner: userData.id});
	if(processData == null || processData == undefined) return next();
	if(processData.paid) return res.redirect(`/server/${req.params.id}`);
	let pay = await Qurre.GetPaymentInfo(processData.pay);
	const host = Hosts.GetById(processData.host);
	if(host == null || pay == null){
		processData.remove();
		return res.redirect('/products/buy');
	}
	res.render("products/process.ejs", {cdn_host, is_logged: true, udata: userData, host, process:processData, pay});
}));
router.post('/products/buy', vhost(host, async(req, res) => {
	if (req.session.user == null) return res.status(401).send('401');
	const body = req.body;
	if(body.name.length < 4) return res.status(400).send('name-few-length');
	if(!isNumber(body.host) || body.host < 1 || body.host > config.hosts.length) return res.status(400).send('host');
	async function RenderId() {
		const id = guid();
		const AlreadyID = await processesData.findOne({id});
		if(AlreadyID == null || AlreadyID == undefined) DoCreate();
		else RenderId();
		async function DoCreate() {
			const Host = Hosts.GetById(body.host);
			if(Host == null) return res.status(400).send('host');
			const Payment = await Qurre.CreatePayment(Host.sum, `Покупка сервера в ${Hosts.GetDataCenterById(Host.dc)} | ${Host.cpu} & ${Host.ram}`);
			await new processesData({id, owner: req.session.user.id, name:body.name, host:body.host, pay:Payment.payment, pay_link:Payment.link}).save();
			res.json({status: 'successfully', link: `/products/process/${id}`})
		}
	}
	RenderId();
}));
router.post('/products/checkpays', vhost(host, async(req, res) => {
    const ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.replace('::ffff:', '');
	try{
		if(req.body.payment == '') return res.sendStatus(403);
		const Ips = await Qurre.GetServiceIps();
		if(!Ips.includes(ip)) return res.sendStatus(403);
		const Pay = await Qurre.GetPaymentInfo(req.body.payment);
		if(!Pay.paid) return res.sendStatus(403);
		const processData = await processesData.findOne({pay: req.body.payment});
		if(processData == null || processData == undefined) return res.sendStatus(403);
		processData.pay = '';
		processData.paid = true;
		await processData.save();

		const Host = Hosts.GetById(processData.host);
		if(Host != null) HostManager.Create(Host, processData);
		const hook = new Webhook("https://discord.com/api/webhooks/874385265895014450/nyC5ziLIAOOMjOf03_CQBdzLtFjSQe9q95nQYtk7XY1xXX3F06PW1RAzX-s5Ld15q3b4");
        hook.setUsername('Qurre Host'); hook.setAvatar('https://cdn.fydne.xyz/qurre/host.png');
		const embed = new MessageBuilder()
        .setTitle('Куплен новый сервер')
        .setAuthor('Qurre Host', 'https://cdn.fydne.xyz/qurre/host.png', `https://${config.dashboard.baseURL}`)
        .setURL(`https://${config.dashboard.baseURL}/products/process/${processData.id}`)
        .setColor('#15ff00')
        .setTimestamp();
		if(Host == null) return hook.send(embed);
		embed
        .addField('Сумма:', `${Host.sum}₽`, true)
        .addField('Характеристики:', `${Host.cpu} & ${Host.ram}`, true)
        .addField('Дата-центр:', Hosts.GetDataCenterById(Host.dc), true)
		hook.send(embed);
	}catch(err){
        const hook = new Webhook("https://discord.com/api/webhooks/811153851570061364/OAJHaKlspZQC4imQ8Rvp_n0M09AzeNyJJyQYsniJ6yqaWYX6Izwxf9kHqwNaBBLqF6yH");
        hook.setUsername('Qurre Host'); hook.setAvatar('https://cdn.fydne.xyz/qurre/host.png');
        hook.send(`Произошла ошибка.\nМестоположение: \`${req.protocol}://${req.get("host")}${req.originalUrl}\`\nКод ошибки:\n${err}`);
		res.sendStatus(400);
    }
}));
const guid = function(){return 'xxxyxxyxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
var isNumber = function isNumber(value) {return typeof value === 'number' && isFinite(value);}
module.exports = router;
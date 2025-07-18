var Emails = {};
module.exports = Emails;
const { SMTPClient } =  require('./emailjs');
var Mails = require('./mails');

Emails.server = new SMTPClient(
{
  host 	    : 'smtp.yandex.ru',//smtp.yandex.ru
  user 	    : 'accounts@qurre.store',//accounts@fydne.xyz
  password  : 'hjjjaayjrhkmxfxh',//fnytbavazkoxogxw
  ssl		    : true
});
Emails.register = function(account, callback)
{
	Emails.server.send({
		from         : 'Успешная регистрация <accounts@qurre.store>',
		to           : account.email,
		subject      : 'Успешная регистрация ✔',
		text         : 'что-то пошло не так... :(',
		attachment   : Mails.composeEmail(account, 1)
	}, callback );
}
Emails.dispatchResetPasswordLink = function(account, callback)
{
  Emails.server.send({
    from         : 'Сброс пароля <accounts@qurre.store>',
    to           : account.email,
    subject      : 'Сброс пароля',
    text         : 'что-то пошло не так... :(',
    attachment   : Mails.composeEmail(account, 2)
  }, callback );
};
Emails.reset_password = function(account, callback)
{
  Emails.server.send({
    from         : 'Пароль успешно сброшен <accounts@qurre.store>',
    to           : account.email,
    subject      : 'Пароль успешно сброшен',
    text         : 'что-то пошло не так... :(',
    attachment   : Mails.composeEmail(account, 3)
  }, callback );
};
Emails.new_login = function(account)
{
  new SMTPClient(
  {
    host : 'smtp.yandex.ru',
    user : 'ips@qurre.store',
    password : 'lbbcilkmvnofqefz',
    ssl : true
  }).send({
		from         : 'Вход с нового IP <ips@qurre.store>',
		to           : account.email,
		subject      : 'Вход с нового IP',
		text         : `iP: ${account.ip}`,
		attachment   : Mails.composeEmail(account, 4)
	});
}
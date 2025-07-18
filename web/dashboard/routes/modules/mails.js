var Mails = {};
module.exports = Mails;
let baseurl = 'https://qurre.store';
Mails.composeEmail = function(o, m)
{
    let msg = "";
    if(m == 1) msg = `Вы успешно зарегистрировали аккаунт на сайте <a href='${baseurl}' style="color: red;">Qurre-Pay</a><br>Логин: <b>${o.user}</b>`;
    else if(m == 2) msg = `Кто-то запросил сброс вашего пароля, если это вы, то перейдите по <a href='${baseurl}/authorization/reset-password?key=${o.passKey}' style="color: red;">ссылке</a>`;
    else if(m == 3){
        msg = `Вы успешно сбросили свой пароль.<br>Если это не вы, то заново сбросьте пароль.<br>`
        msg += `Вы можете открыть тикет в дискорде, если вы хотите откатить данные аккаунта.<br><b>Ip:</b> ${o.ip}`;
        if(o.ip_info != undefined && o.ip_info.ip != '127.0.0.1') msg = `${msg}<br><b>Местоположение:</b> ${o.ip_info.city}, ${o.ip_info.region}, ${o.ip_info.country}`;
    }
    else if(m == 4){
        msg = `В ваш аккаунт авторизировались с нового IP.<br><b>Ip:</b> ${o.ip}`;
        if(o.ip_info != undefined && o.ip_info.ip != '127.0.0.1') msg = `${msg}<br><b>Местоположение:</b> ${o.ip_info.city}, ${o.ip_info.region}, ${o.ip_info.country}`;
    }
    const html = `
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head><title></title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css">#outlook a{padding: 0;}.ReadMsgBody{width: 100%;}
.ExternalClass{width: 100%;}.ExternalClass *{line-height: 100%;}body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}p{display: block; margin: 13px 0;}</style>
<!--[if !mso]><!--><style type="text/css">@media only screen and (max-width:480px) {@-ms-viewport {width:320px;}@viewport {width:320px;}}</style><!--<![endif]-->
<!--[if mso]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<!--[if lte mso 11]><style type="text/css">.outlook-group-fix{width:100% !important;}</style><![endif]-->
<style type="text/css">@media only screen and (min-width:480px) {.dys-column-per-100 {width: 100.000000% !important;max-width: 100.000000%;}}
@media only screen and (max-width:480px) {table.full-width-mobile { width: 100% !important; }td.full-width-mobile { width: auto !important; }}
@media only screen and (min-width:480px) {.dys-column-per-90 {width: 90% !important;max-width: 90%;}}
@media only screen and (min-width:480px) {.dys-column-per-100 {width: 100.000000% !important;max-width: 100.000000%;}}</style></head><body><div>
<table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#f7f7f7;background-color:#f7f7f7;width:100%;'>
<tbody><tr><td><div style='margin:0px auto;max-width:600px;'>
<table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'><tbody><tr>
<td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:540px;"><![endif]-->
<div class='dys-column-per-90 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
<table border='0' cellpadding='0' cellspacing='0' role='presentation' width='100%'>
<tbody><tr><td style='background-color:#ffffff;border:1px solid #ccc;padding:45px 75px;vertical-align:top;'>
<table border='0' cellpadding='0' cellspacing='0' role='presentation' style='' width='100%'>
<td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
<div style='color:#777777;font-family:Oxygen, Helvetica neue, sans-serif;font-size:14px;line-height:21px;text-align:center;'>
<a style='display:block; color: #ff6f6f; font-weight: bold; text-decoration: none;'>Доброго времени суток, <b>${o.user}</b>.</a><br><span>${msg}</span></div></td></tr>
</table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div></td></tr></tbody></table>
<table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#f7f7f7;background-color:#f7f7f7;width:100%;'>
<tbody><tr><td><div style='margin:0px auto;max-width:600px;'>
<table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'>
<tbody><tr><td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;"><![endif]-->
<div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
<table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
<tr><td align='center' style='font-size:0px;padding:5px 25px;word-break:break-word;'>
<div style='color:#777777;font-family:Oxygen, Helvetica neue, sans-serif;font-size:14px;font-style:bold;font-weight:700;line-height:21px;text-align:center;'>
</div></td></tr><tr><td align='center' style='font-size:0px;padding:5px 25px;word-break:break-word;'>
<div style='color:#777777;font-family:Oxygen, Helvetica neue, sans-serif;font-size:14px;font-style:bold;line-height:1;text-align:center;'>
Copyright © Qurre Team ${new Date().getFullYear()}</div></td></tr><tr><td align='center' style='font-size:0px;padding:5px 25px;word-break:break-word;'>
<div style='color:#777777;font-family:Oxygen, Helvetica neue, sans-serif;font-size:14px;font-style:bold;line-height:1;text-align:center;'></div></td></tr></table></div>
<!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div></td></tr></tbody></table></div></body></html>`;
return [{data:html, alternative:true}];
}
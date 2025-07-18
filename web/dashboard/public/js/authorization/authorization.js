$(function() {
	var tab = $('.tabs h3 a');
	tab.on('click', function(event) {
		event.preventDefault();
		tab.removeClass('active');
		$(this).addClass('active');
		tab_content = $(this).attr('href');
		$('div[id$="tab-content"]').removeClass('active');
		$(tab_content).addClass('active');
	});
});

(function($) {
	'use strict';
	$.fn.swapClass = function(remove, add) {
		this.removeClass(remove).addClass(add);
        //for low-level browsers, ex: safari, yandex
        const el = document.querySelector(`.${add}`);
        var styles = getComputedStyle(el);
        var itWorks = !!(styles.animation || styles.webkitAnimation);
        if(!itWorks){
            if(add == 'open') el.style.opacity = 1;
            else if(add == 'closed') el.style.opacity = 0;
        }
		return this;
	};
}(jQuery));

$(function() {
	$('.agree,.forgot, #toggle-terms, .log-in, .sign-up').on('click', function(event) {
		event.preventDefault();
		var recovery = $('.recovery'),
        close = $('#toggle-terms'),
        arrow = $('.tabs-content .fa');
        if ($(this).hasClass('forgot') || $(this).hasClass('sign-up') || $(this).is('#toggle-terms')) {
			if (recovery.hasClass('open')) {
				recovery.swapClass('open', 'closed');
				close.swapClass('open', 'closed');
				arrow.swapClass('active', 'inactive');
			} else {
				if ($(this).hasClass('sign-up')) {
					return;
				}
				recovery.swapClass('closed', 'open');
				close.swapClass('closed', 'open');
				arrow.swapClass('inactive', 'active');
			}
		}
	});
});

$(function() {
    let already = false;
	$('.recovery .button').on('click', function(event) {
		event.preventDefault();
		$('.recovery .mssg').addClass('animate');
        if(!validateEmail(document.getElementById('user_recover').value)){
            document.getElementsByClassName('mssg')[0].innerHTML = 'Пожалуйста, введите действительный адрес электронной почты.';
            return;
        }
        if(already) return;
        already = true;
        document.getElementsByClassName('mssg')[0].innerHTML = 'Отправка...';
        const email = document.getElementById('user_recover').value;
        $.ajax({
            type:'post',
            url:`/authorization/lost-password`,
            dataType: 'json',
            contentType: 'application/json',
            timeout: 15000,
            data: JSON.stringify({email}),
            success: (data) => Later(),
            error:function(e, d, m) {
                if(e.responseText == undefined) return;
                if(e.responseText == 'successfully') return Later();
                already = false;
                if(e.responseText == 'email-null') document.getElementsByClassName('mssg')[0].innerHTML = 'Пожалуйста, введите действительный адрес электронной почты.';
                else if(e.responseText == 'account not found') document.getElementsByClassName('mssg')[0].innerHTML = 'Аккаунт с данной почтой не найден.';
                else if(e.responseText == 'email error') document.getElementsByClassName('mssg')[0].innerHTML = 'Произошла ошибка при отправке сообщения.';
            }
        });
        function Later() {
            already = false;
            document.getElementsByClassName('mssg')[0].innerHTML = 'Вам было отправлено электронное письмо с дальнейшими инструкциями.';
            setTimeout(function() {
                $('.recovery').swapClass('open', 'closed');
                $('#toggle-terms').swapClass('open', 'closed');
                $('.tabs-content .fa').swapClass('active', 'inactive');
                $('.recovery .mssg').removeClass('animate');
                document.getElementById('user_recover').value = '';
            }, 2500);
        }
	});
});
function validateEmail(e) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
}

$('#login_submit').on('click', function(ev) {
    const user = document.getElementById('user_login').value;
    const pass = document.getElementById('user_pass_login').value;
    const remember = document.getElementById('remember_me').checked;
    $.ajax({
        type:'post',
        url:`/authorization/login`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 15000,
        data: JSON.stringify({user, pass, remember}),
        success:function(data) {
            location.reload();
        },
        error:function(e, d, m) {
            if(e.responseText == undefined) return;
            if(e.responseText == 'successfully') return location.reload();
            document.getElementsByClassName('content')[0].className += ' error';
            if(e.responseText == 'user-not-found') document.getElementById('iferrortext').innerHTML = 'Пожалуйста, введите действительное имя пользователя.';
            if(e.responseText == 'invalid-password') document.getElementById('iferrortext').innerHTML = 'Пожалуйста, введите правильный пароль.';
        }
    });
})
let signup_already = false;
$('#signup_submit').on('click', function(ev) {
    const email = document.getElementById('user_email').value;
    const user = document.getElementById('user_name').value;
    const pass = document.getElementById('user_pass').value;
    if(user.length > 25){
        document.getElementsByClassName('content')[0].className += ' error';
        document.getElementById('iferrortext').innerHTML = 'Слишком длинный логин.';
        return;
    }
    if(signup_already) return;
    signup_already = true;
    $.ajax({
        type:'post',
        url:`/authorization/signup`,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 15000,
        data: JSON.stringify({user, pass, email}),
        success:function(data) {
            signup_already = false;
            location.reload();
        },
        error:function(e, d, m) {
            signup_already = false;
            if(e.responseText == undefined) return;
            if(e.responseText == 'successfully') return location.reload();
            document.getElementsByClassName('content')[0].className += ' error';
            if(e.responseText == 'email-taken') document.getElementById('iferrortext').innerHTML = 'Данный адрес электронной почты уже используется.';
            else if(e.responseText == 'username-taken') document.getElementById('iferrortext').innerHTML = 'Данный логин уже используется.';
            else if(e.responseText == 'email-null') document.getElementById('iferrortext').innerHTML = 'Пожалуйста, введите действительный адрес электронной почты.';
            else if(e.responseText == 'password-few-length') document.getElementById('iferrortext').innerHTML = 'Пароль должен быть не менее 6 символов.';
            else if(e.responseText == 'username-many') document.getElementById('iferrortext').innerHTML = 'Слишком длинный логин.';
        }
    });
})
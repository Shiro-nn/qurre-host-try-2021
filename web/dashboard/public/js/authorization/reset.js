$(function() {
    let already = false;
	$('#reset_password').on('click', function(event) {
		event.preventDefault();
        if(already) return;
		$('.mssg').addClass('animate');
        already = true;
        document.getElementsByClassName('mssg')[0].innerHTML = 'Отправка...';
        const pass = document.getElementById('user_pass').value;
        $.ajax({
            type:'post',
            url:`/authorization/reset-password`,
            dataType: 'json',
            contentType: 'application/json',
            timeout: 15000,
            data: JSON.stringify({pass}),
            success:function(data){
                already = false;
                location.href = '/authorization';
            },
            error:function(e, d, m) {
                if(e.responseText == undefined) return;
                already = false;
                if(e.responseText == 'successfully') return location.href = '/authorization';
                if(e.responseText == 'account not found') document.getElementsByClassName('mssg')[0].innerHTML = 'Аккаунт не найден.';
                else if(e.responseText == 'password-few-length') document.getElementsByClassName('mssg')[0].innerHTML = 'Пароль должен быть не менее 6 символов.';
            }
        });
	});
});
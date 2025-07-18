window.addEventListener("load", function() {
    let host = 0;
    const hosts = 12;
    const dcs = 2;
    const cpus = 2;
    for (let q = 1; cpus >= q; q++) {
        $(`.cpu${q}`).on('click', function () {
            for (let i = 1; cpus >= i; i++) {
                document.getElementsByClassName(`cpu${i}`)[0].className = document.getElementsByClassName(`cpu${i}`)[0].className.replace(' selected', '');
                document.querySelectorAll(`#cpu${i}`).forEach((el) => el.style.display = 'none');
            }
            document.getElementsByClassName(`cpu${q}`)[0].className += ' selected';
            document.querySelectorAll(`#cpu${q}`).forEach((el) => el.style = '');
        });
    }
    for (let q = 1; dcs >= q; q++) {
        $(`.dc${q}`).on('click', function () {
            for (let i = 1; dcs >= i; i++) {
                document.getElementsByClassName(`dc${i}`)[0].className = document.getElementsByClassName(`dc${i}`)[0].className.replace(' selected', '');
                document.querySelectorAll(`#dc${i}`).forEach((el) => el.style.display = 'none');
            }
            document.getElementsByClassName(`dc${q}`)[0].className += ' selected';
            document.querySelectorAll(`#dc${q}`).forEach((el) => el.style = '');
        });
    }
    for (let q = 1; hosts >= q; q++) {
        $(`#buy-${q}`).on('click', function () {
            for (let i = 1; hosts >= i; i++) {
                document.getElementById(`buy-${i}`).className = document.getElementById(`buy-${i}`).className.replace(' selected', '');
            }
            document.getElementById(`buy-${q}`).className += ' selected';
            host = q;
        });
    }
    document.getElementsByClassName('dc2')[0].click();
    document.getElementsByClassName('cpu2')[0].click();
    let already = false;
    $('.q13').on('click', function (ev) {
        const mssg = document.getElementsByClassName('q14')[0];
        if(host == 0){
            if(!mssg.className.includes(' show')) mssg.className += ' show';
            mssg.innerHTML = 'Выберите конфигурацию сервера.';
            return;
        }
        const el = document.getElementsByClassName('q11')[0];
        if(el.value == '' || el.value.length < 4){
            if(!mssg.className.includes(' show')) mssg.className += ' show';
            mssg.innerHTML = 'Название сервера должно быть не менее 4х символов.';
            return;
        }
        if(already) return;
        already = true;
        $.ajax({
            type:'post',
            url:'/products/buy',
            dataType: 'json',
            contentType: 'application/json',
            timeout: 15000,
            data: JSON.stringify({host, name:el.value}),
            success: (data) => location.href = data.link,
            error:function(e, d, m) {
                if(e.responseText == undefined) return;
                if(e.responseText.status == 'successfully') return location.href = e.responseText.link;
                already = false;
                if(!mssg.className.includes(' show')) mssg.className += ' show';
                if(e.responseText == 'name-few-length') mssg.innerHTML = 'Название сервера должно быть не менее 4х символов.';
                else if(e.responseText == 'host') mssg.innerHTML = 'Выберите правильную конфигурацию сервера.';
                else if(e.responseText == '401') location.reload();
            }
        });
    });
});
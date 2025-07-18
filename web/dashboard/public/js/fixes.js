try { $(document).ready(function () { }); } catch {
    document.body.innerHTML += `
    <link rel="stylesheet" href="/css/modules/alert.css">
    <div class="alert">
    <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    Скрипты не загрузились, возможно, проблема из-за ADBlock'a, если он у вас включен, то лучше отключите.
    </div>`;
    if (getCDNCookie() == '') {
        var request = new XMLHttpRequest();
        request.open("POST", `/api/cdn_reserve`);
        request.onload = function () { location.reload(); };
        request.send(null);
    }
}
function getCDNCookie() {
    var name = "cdn=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
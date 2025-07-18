const Downloader = require('nodejs-file-downloader');
const fs = require("fs");
const Helpers = require('./Helpers');
const cliProgress = require('cli-progress');
const os = require('os');
const appdata = require('appdata-path').getAppDataPath();
const _colors = require('colors');
const user = os.userInfo();
let os_data = 0;
const init = async () => {
    let path = '\\';
    let archive_name = 'SCP-Server-win.tar.gz';
    if(os_data == 1){
        url = 'SCP-Server-linux.tar.gz';
        path = '/';
    }
    const main_dir = user.homedir + path +'qurre-installer';
    setInterval(() => {}, 1000);
    if (!fs.existsSync(main_dir)) await fs.promises.mkdir(main_dir, {recursive: true});
    if (fs.existsSync(main_dir+'/SCP-Server')) fs.rmSync(main_dir+'/SCP-Server', { recursive: true });
    if (fs.existsSync(main_dir+'/data')) fs.rmSync(main_dir+'/data', { recursive: true });
    const bar_steam = new cliProgress.SingleBar({
        format: `Установка SCP   |${_colors.red('{bar}')}| {percentage}% || {value}/{total} || {speed}`,
        formatValue,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        autopadding: true,
        hideCursor: true
    });
    bar_steam.start(100, 0, {speed: "N/A"});
    const bar_steam_speed = {date: Date.now(), size: 0, text: '', full: 100, first: true, total: 0}
    const scp_downloader = new Downloader({
        url: 'https://cdn.scpsl.store/qurre/installer/'+archive_name,
        directory: main_dir+'/data',
        onProgress:function(percentage, chunk, remainingSize){
            bar_steam_speed.total += chunk.length;
            if(bar_steam_speed.first){
                bar_steam_speed.full = remainingSize;
                bar_steam_speed.first = false;
                bar_steam.setTotal(remainingSize);
            }
            const diff = (Date.now() - bar_steam_speed.date) / 1000;
            const load_diff = formatBytes((bar_steam_speed.total - bar_steam_speed.size) / diff) + '/s';
            bar_steam_speed.size = bar_steam_speed.total;
            bar_steam_speed.date = Date.now();
            if(`${load_diff}` != 'NaN/s') bar_steam_speed.text = load_diff;
            bar_steam.update(parseInt(bar_steam_speed.total), {speed: bar_steam_speed.text});
        }
    });
    await scp_downloader.download();
    bar_steam.update(bar_steam_speed.full, {speed: bar_steam_speed.text});
    bar_steam.stop();
    await Helpers.UnArchiveAndDelete(main_dir+'/data/'+archive_name,main_dir);
    const bar_qurre = new cliProgress.SingleBar({
        format: `Установка Qurre |${_colors.green('{bar}')}| {percentage}% || {value}/{total} || Speed: {speed}`,
        formatValue,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        autopadding: true,
        hideCursor: true
    });
    bar_qurre.start(100, 0, {speed: "N/A"});
    const bar_qurre_speed = {date: Date.now(), size: 0, text: '', full: 100, first: true, total: 0}
    const script = new Downloader({
        url: 'https://github.com/Qurre-Team/Qurre-sl/releases/latest/download/Qurre.tar.gz',
        directory: main_dir+'/data',
        onProgress:function(percentage, chunk, remainingSize){
            bar_qurre_speed.total += chunk.length;
            if(bar_qurre_speed.first){
                bar_qurre_speed.full = remainingSize;
                bar_qurre_speed.first = false;
                bar_qurre.setTotal(remainingSize);
            }
            const diff = (Date.now() - bar_qurre_speed.date) / 1000;
            const load_diff = formatBytes((bar_qurre_speed.total - bar_qurre_speed.size) / diff) + '/s';
            bar_qurre_speed.size = bar_qurre_speed.total;
            bar_qurre_speed.date = Date.now();
            if(`${load_diff}` != 'NaN/s') bar_qurre_speed.text = load_diff;
            bar_qurre.update(parseInt(bar_qurre_speed.total), {speed: bar_qurre_speed.text});
        }
    });
    await script.download();
    bar_qurre.update(bar_qurre_speed.full, {speed: bar_qurre_speed.text});
    bar_qurre.stop();
    await Helpers.UnArchiveAndDelete(main_dir+'/data/Qurre.tar.gz',appdata);
    fs.renameSync(appdata+'/Assembly-CSharp.dll', main_dir+'/SCP-Server/SCPSL_Data/Managed/Assembly-CSharp.dll');
    console.log(_colors.red('Местоположение сервера:\n')+_colors.green(main_dir+path+'SCP-Server'));
    process.exit();
};
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}
function formatValue(v, options, type){
    if (options.autopadding !== true){
        return v;
    }
    function autopadding(value, length){
        return (options.autopaddingChar + value).slice(-length);
    }
    if(type == 'percentage') return autopadding(v, 3);
    if(type == 'value' || type == 'total') return formatBytes(v, 0);
    return v;
}
const initialize = async () => {
    const os_type = os.type();
    if(os_type == 'Linux') os_data = 1; //Linux
    else if(os_type == 'Windows_NT') os_data = 2; //Windows
    init();
}
initialize();
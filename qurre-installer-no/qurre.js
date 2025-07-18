const { SteamCmd } = require('steamcmd-interface');
const { tmux } = require('node-tmux');
const Downloader = require('nodejs-file-downloader');
const { exec } = require("child_process");
const fs = require("fs");
const Helpers = require('./Helpers');
const cliProgress = require('cli-progress');
const os = require('os');
const appdata = require('appdata-path').getAppDataPath();
const main_dir = 'C:/Users/fydne/Desktop/code/js/my/qurre_host/test';// /root
const init = async () => {
    const os_type = os.type();
    let os_data = 0;
    console.log(os_type)
    console.log(os.userInfo());
    if(os_type == 'Darwin') os_data = 1; //MacOS
    else if(os_type == 'Linux') os_data = 2; //Linux
    else if(os_type == 'Windows_NT') os_data = 3; //Windows
    if (fs.existsSync(main_dir+'/scp')) fs.rmSync(main_dir+'/scp', { recursive: true });
    if (fs.existsSync(main_dir+'/data')) fs.rmSync(main_dir+'/data', { recursive: true });
    console.log('Инициализация Steam...');
    const steamCmd = await SteamCmd.init({binDir:main_dir+'/steam', installDir:main_dir+'/scp'});
    const bar_steam = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);
    console.log('Установка SCP...');
    bar_steam.start(100, 0);
    let bar_steam_first = true;
    let bar_steam_full = 100;
    for await(const progress of steamCmd.updateApp(996560)) {
        if(progress.state == 'downloading'){
            if(bar_steam_first){
                bar_steam_full = progress.progressTotalAmount;
                bar_steam.start(progress.progressTotalAmount, 0);
            }
            bar_steam_first = false;
            bar_steam.update(progress.progressAmount);
        }
    }
    bar_steam.update(bar_steam_full);
    bar_steam.stop();
    console.log('Установка Qurre...');
    const bar_qurre = new cliProgress.SingleBar({}, cliProgress.Presets.shades_grey);
    bar_qurre.start(100, 0);
    const script = new Downloader({
        url: 'https://github.com/Qurre-Team/Qurre-sl/releases/latest/download/Qurre.tar.gz',
        directory: main_dir+'/data',
        onProgress:function(percentage){
            bar_qurre.update(parseInt(percentage));
        }
    });
    await script.download();
    bar_qurre.update(100);
    bar_qurre.stop();
    await Helpers.UnArchiveAndDelete(main_dir+'/data/Qurre.tar.gz',appdata);
    fs.rename(appdata+'/Assembly-CSharp.dll', main_dir+'/scp/SCPSL_Data/Managed/Assembly-CSharp.dll', () => {});
    /*exec(`bash ${main_dir}/data/update.sh`);
    const downloader = new Downloader({
        url: 'https://cdn.scpsl.store/qurre/host/manager',
        directory: main_dir+'/data',
        onProgress:function(percentage){
            console.log('% ',percentage)
        }
    });
    await downloader.download();
    function TmuxInitial() {
        tmux().then(tm => {
            tm.newSession('manager', `cd ${main_dir}/data && chmod 555 ./manager && clear && ./manager`)
        }).catch(() => exec('apt install tmux', async() => TmuxInitial()));
    }
    TmuxInitial();*/
};
init();
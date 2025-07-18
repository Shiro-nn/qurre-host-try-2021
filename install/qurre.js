const { SteamCmd } = require('steamcmd-interface');
const { tmux } = require('node-tmux');
const Downloader = require('nodejs-file-downloader');
const { exec } = require("child_process");
const fs = require("fs");
const main_dir = '/root';// /root
const init = async () => {
    if (fs.existsSync(main_dir+'/scp')) fs.rmSync(main_dir+'/scp', { recursive: true });
    const steamCmd = await SteamCmd.init({binDir:main_dir+'/steam', installDir:main_dir+'/scp'});
    for await(const progress of steamCmd.updateApp(996560)) {
        console.log(`${progress.state} ${progress.progressPercent}%`);
    }
    const script = new Downloader({
      url: 'https://cdn.scpsl.store/qurre/host/update.sh',
      directory: main_dir+'/data',
    });
    await script.download();
    exec(`bash ${main_dir}/data/update.sh`);
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
    TmuxInitial();
};
init();
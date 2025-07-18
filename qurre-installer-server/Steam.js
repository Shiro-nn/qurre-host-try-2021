'use strict'
const Helpers = require('./Helpers');
const Downloader = require('nodejs-file-downloader');
const fs = require("fs");
const cp = require('child_process');
module.exports = class Steam {
    constructor(options) {
        this.binDir = options.binDir;
        this.installDir = options.installDir;
        switch (process.platform) {
            case 'win32':
                this._downloadUrl = 'https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip';
                this._appName = 'steamcmd.exe';
                this._archiveName = 'steamcmd.zip';
                this.os = 1;
            break;
            case 'darwin':
                this._downloadUrl = 'https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz';
                this._appName = 'steamcmd.sh';
                this._archiveName = 'steamcmd_osx.tar.gz';
                this.os = 2;
            break;
            case 'linux':
                this._downloadUrl = 'https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz';
                this._appName = 'steamcmd.sh';
                this._archiveName = 'steamcmd_linux.tar.gz';
                this.os = 3;
            break;
            default: throw new Error(`Platform "${process.platform}" is not supported`);
        }
    }
    async initialize(downloadCB = ()=>{}){
        const CDNDir = '/root/js/cdn/uploads/qurre/installer/';
        if (!fs.existsSync(CDNDir)) await fs.promises.mkdir(CDNDir, {recursive: true});
        if (!fs.existsSync(this.binDir)) await DownloadSteam(this, downloadCB);
        else if(Helpers.GetFiles(this.binDir).filter(x => x == this._appName).length == 0) await DownloadSteam(this, downloadCB);
        if(this.os == 3) await exec('apt-get install lib32gcc1 -y');
        {
            const archivePath = CDNDir+'SCP-Server-win.tar.gz';
            const osPath = `${this.installDir}/win`;
            const os = 'windows';
            if (fs.existsSync(osPath)) fs.rmSync(osPath, { recursive: true });
            const args = ['@sSteamCmdForcePlatformType '+os, '@ShutdownOnFailedCommand 1', '@NoPromptForPassword 1',
            `force_install_dir ${osPath}/SCP-Server`, 'login anonymous', 'app_update 996560'].concat('quit').map(function (x) {
              return '+' + x
            }).join(' ').split(' ')
            const child = cp.spawn(`${this.binDir}/${this._appName}`, args, {
                stdio:  'pipe',
                cwd: this.binDir
            });
            child.on('close', function(code) {
                if (fs.existsSync(archivePath)) fs.rmSync(archivePath, { recursive: true });
                Helpers.Tar(archivePath, osPath, 'SCP-Server');
            });
        }
        {
            const archivePath = CDNDir+'SCP-Server-linux.tar.gz';
            const osPath = `${this.installDir}/linux`;
            const os = 'linux';
            if (fs.existsSync(osPath)) fs.rmSync(osPath, { recursive: true });
            const args = ['@sSteamCmdForcePlatformType '+os, '@ShutdownOnFailedCommand 1', '@NoPromptForPassword 1',
            `force_install_dir ${osPath}/SCP-Server`, 'login anonymous', 'app_update 996560'].concat('quit').map(function (x) {
              return '+' + x
            }).join(' ').split(' ')
            const child = cp.spawn(`${this.binDir}/${this._appName}`, args, {
                stdio:  'pipe',
                cwd: this.binDir
            });
            child.on('close', function(code) {
                if (fs.existsSync(archivePath)) fs.rmSync(archivePath, { recursive: true });
                Helpers.Tar(archivePath, osPath, 'SCP-Server');
            });
        }

        async function DownloadSteam(cls, cb) {
            if(fs.existsSync(cls.binDir) && Helpers.GetFiles(cls.binDir).filter(x => x == cls._archiveName).length != 0) fs.unlinkSync(`${cls.binDir}/${cls._archiveName}`);
            const _steam_data = {date: Date.now(), size: 0, speed: '', full: 100, first: true, total: 0}
            const steam_downloader = new Downloader({
                url:cls._downloadUrl, directory: cls.binDir,
                onProgress:function(p, chunk, remainingSize){
                    _steam_data.total += chunk.length;
                    if(_steam_data.first){
                        _steam_data.full = remainingSize;
                        _steam_data.first = false;
                    }
                    const diff = (Date.now() - _steam_data.date) / 1000;
                    const load_diff = formatBytes((_steam_data.total - _steam_data.size) / diff) + '/s';
                    _steam_data.size = _steam_data.total;
                    _steam_data.date = Date.now();
                    if(`${load_diff}` != 'NaN undefined/s') _steam_data.speed = load_diff;
                    cb({full:_steam_data.full,downloaded:_steam_data.total,speed:_steam_data.speed});
                }
            });
            await steam_downloader.download();
            await Helpers.UnArchiveAndDelete(`${cls.binDir}/${cls._archiveName}`, cls.binDir);
        }
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        function exec(data) {
            return new Promise(resolve => cp.exec(data, (err) => resolve(err)));
        }
    }
}
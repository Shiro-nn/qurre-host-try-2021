const Steam = require('./Steam');
const os = require('os');
const user = os.userInfo();
const fs = require('fs');
const main_dir = user.homedir + '/scripts/qurre-installer-server';
async function Init() {
    if (!fs.existsSync(main_dir)) await fs.promises.mkdir(main_dir, {recursive: true});
    const steamCmd = new Steam({binDir:main_dir+'/steam', installDir:main_dir+'/scp'});
    await steamCmd.initialize((data)=>console.log(data));
}
Init();
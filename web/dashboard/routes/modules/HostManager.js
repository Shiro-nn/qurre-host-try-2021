const io = require("socket.io-client");
const socket = io("https://localhost", {secure: true, rejectUnauthorized: false});
const serversData = require("../../../base/servers");
const hostsData = require("../../../base/host");
const HostsModule = require("./Hosts");
module.exports = {
    Create: async function(server, process){
        let host = await hostsData.findOne({id:process.host});
        if(host == null || host == undefined){
            const _host = HostsModule.GetFullDataCenterById(process.host);
            host = new hostsData({id:_host.id, name:_host.name, ip:_host.ip});
        }
        const password = guid();
        const _server = await new serversData({id:process.id, owner:process.owner, name:process.name, host:process.host, ip:host.ip, port:host.port, password}).save();
        host.port++;
        await host.save();
		socket.emit('web_create_kvm', server.data.cpus, server.data.ram, password, process.name, process.id);
    }
}
const guid = function(){return 'xxxyxxyxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}
module.exports.load = async(server) => {
    const serversData = require("./base/servers");
    const DataCenter = io("https://DataCenter.scpsl.store", {secure: true, rejectUnauthorized: false});
    const { Server } = require("socket.io");
    const io = new Server(server);
    let Sockets = [];
    let AllSockets = [];
    io.on('connection', (socket) => {
        const address = socket.handshake.address?.replace('::ffff:', '');
        AllSockets.push(socket);
        socket.on('initial', (uid, socketID) => {
            if(address != '::1' && address != '127.0.0.1') return;
            if(AllSockets.filter(x => x.id == socketID).length == 0) return;
            const thisSocket = AllSockets.find(x => x.id == socketID);
            Sockets.push({socket:thisSocket, uid});
        });
        socket.on('disconnect', () => {
            {
                const DoSockets = Sockets;
                Sockets = [];
                for (let i = 0; i < DoSockets.length; i++) {
                    const DoSocket = DoSockets[i];
                    if(DoSocket.socket.id != socket.id) Sockets.push(DoSocket);
                }
            }
            {
                const DoAllSockets = AllSockets;
                AllSockets = [];
                for (let i = 0; i < DoAllSockets.length; i++) {
                    const DoSocket = DoAllSockets[i];
                    if(DoSocket.id != socket.id) AllSockets.push(DoSocket);
                }
            }
        });
        socket.on('web_create_kvm', async(cpus, ram, password, name, uid) => {
            if(address != '::1' && address != '127.0.0.1') return;
            const server = await serversData.findOne({id:uid});
            server.process.id = 1;
			server.markModified("process");
            await server.save();
            DataCenter.emit('server_create_kvm', cpus, ram, password, name, uid);
        });
        socket.on('client_server_builded', async(uid) => {
            if(address != '::1' && address != '127.0.0.1') return;
            const server = await serversData.findOne({id:uid});
            server.process.id = 2;
			server.markModified("process");
            await server.save();
        });
        socket.on('client_server_installed', async(uid) => {
            if(address != '::1' && address != '127.0.0.1') return;
            const server = await serversData.findOne({id:uid});
            server.process.id = 3;
			server.markModified("process");
            await server.save();
        });
    });
}
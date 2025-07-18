module.exports.load = async(server) => {
    const { Server } = require("socket.io");
    const { exec } = require("child_process");
    const io = new Server(server);
    io.on('connection', (socket) => {
        const address = socket.handshake.address?.replace('::ffff:', '');
        if(address != '::1' && address != '127.0.0.1') return;
        socket.on('server_create_kvm', async(cpus, ram, password, name, uid) => {
            exec(`virt-builder debian-9 \
            --size=40G \
            --format qcow2 -o /var/lib/libvirt/images/${uid}.qcow2 \
            --hostname ${name} \
            --network \
            --firstboot-command 'echo "${uid}" > /uid' \
            --firstboot /root/scripts/first_vps.sh \
            --root-password password:${password} \
            --timezone Europe/Moscow`, async () => {
                socket.emit('client_server_builded', uid);
                exec(`virt-install --import --name ${uid} \
                --ram ${ram} \
                --vcpu ${cpus} \
                --disk path=/var/lib/libvirt/images/${uid}.qcow2,format=qcow2 \
                --os-variant debian9 \
                --network=bridge=br0,model=virtio \
                --noautoconsole`, async () => {
                    socket.emit('client_server_installed', uid);
                });
            });
        });
    });
}
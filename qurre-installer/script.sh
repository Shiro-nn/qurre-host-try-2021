#!/bin/bash
apt install curl -y
curl --insecure https://cdn.scpsl.store/qurre/modules/qurre-installer -o qurre-installer-module
chmod 555 ./qurre-installer-module && clear && ./qurre-installer-module
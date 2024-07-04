#!/bin/bash

vm_version=$1
directoryPath=$2

root="77148816"
mkdir -p /home/lucas/Documents/git/MTD/src/Coordinator/migation_image
echo "$root" | sudo -S cp "/var/lib/libvirt/images/UbuntuVM01.qcow2" "/home/lucas/Documents/git/MTD/src/Server/controller/migation_image/UbuntuVM0${vm_version}.qcow2"

virt-install --name="UbuntuVM0$vm_version" \
--vcpus=2 \
--memory=2024 \
--disk path="/home/lucas/Documents/git/MTD/src/Server/controller/migation_image/UbuntuVM0${vm_version}.qcow2",format=qcow2 \
--import \
--check path_in_use=off \
--disk size=10
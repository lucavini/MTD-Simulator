#!/bin/bash
vm_origin=$1
vm_destiny=$2

root="77148816"

echo "$root" | sudo -S cp "/home/lucas/Documents/git/MTD/src/Coordinator/migation_image/UbuntuVM0${vm_origin}.qcow2" "/home/lucas/Documents/git/MTD/src/Coordinator/migation_image/UbuntuVM0${vm_destiny}.qcow2"

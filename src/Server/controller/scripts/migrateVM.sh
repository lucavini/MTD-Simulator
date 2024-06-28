#!/bin/bash
vm_origin=$1
vm_destiny=$2
directoryPath=$3

root="77148816"

echo "$root" | sudo -S cp "${directoryPath}/migation_image/UbuntuVM0${vm_origin}.qcow2" "${directoryPath}/migation_image/UbuntuVM0${vm_destiny}.qcow2"

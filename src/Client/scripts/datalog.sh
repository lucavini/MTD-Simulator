#!/bin/bash

# echo "Quanto tempo vai executar (segundos): "
# read timeExe
# end=$((SECONDS+$timeExe))

echo "tempo,       mem, livreMem, swap, livreSwap, cpu, disponivel" > dados.csv

while : 
do
    
    mem=$(free --mega| grep Mem | cut -c28-32)
    freeMem=$(free --mega| grep Mem | cut -c40-44)
    swap=$(free --mega| grep Swap| cut -c29-34)
    freeSwap=$(free --mega| grep Swap| cut -c40-44)
    cpu=$(mpsta | grep all | cut -c21-27 | tr ',' '.')
    storage=$(free --mega| grep Mem | cut -c76-80)
    
    echo "$SECONDS,   $mem, $freeMem, $swap, $freeSwap, $cpu, $storage" >> dados.csv
    
    sleep 5
    
done
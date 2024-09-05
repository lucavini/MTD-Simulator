#!/bin/bash

# echo "Quanto tempo vai executar (segundos): "
# read timeExe
# end=$((SECONDS+$timeExe))

mkdir -p src/data
echo "tempo,       serviceUp, vmID" >> src/data/server.csv

while : 
do
    
    serviceUp=$1
    vmID=$2
    
    echo "$SECONDS,   $serviceUp, $vmID" >> src/data/server.csv
    
    sleep 1
    
done
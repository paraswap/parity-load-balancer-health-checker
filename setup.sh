#!/bin/bash

if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi

if which node > /dev/null
    then
      echo "node is installed, skipping..."
    else
      echo "Installing Node.js..."
      sudo curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
      sudo apt-get install -y nodejs
fi

node_user=$1

echo "Setting up config for user: $node_user..."
sed "s/USER/$node_user/g" parity-health-checker.service > /etc/systemd/system/parity-health-checker.service

echo "Starting..."
chmod +x ./run.sh
./run.sh


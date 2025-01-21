#!/usr/bin/env bash

set -euo pipefail

read -rp 'Use /home/spock/clients/viba/frontend_2.0 as path of the react app? ([y],n): ' useDefault
if [ "$useDefault" == "n" ]
then
    echo "What is the path of the react app?" && read -r appDir
else 
    appDir="/home/spock/clients/viba/frontend_2.0"
fi

deploy="y"
cd "$appDir"
if [ -d  /var/www/viba ]
then
    read -p "App has been deployed before, do you want to overwrite? (y, [n]): " overwrite
    if [ "$overwrite" == "y" ]
    then
        echo -e "\033[0;33mOverwriting ...\033[0m"
        sudo rm -rf /var/www/viba
        deploy="y"
    else
        deploy="n"
    fi
else
    echo "First time deploying app ..."
fi

if [ "$deploy" == "y" ]
then
    echo -e "\033[0;33mDeploying...\033[0m"
    start="$(date +%s)"

    cd "$appDir"
    npm run build

    sudo mkdir '/var/www/viba'
    sudo mv "$appDir"'/build'/* '/var/www/viba'/
    rmdir 'build'

    links=/var/www/viba/.htaccess
    sudo touch $links
    echo "Options -MultiViews" > "$links"
    echo "RewriteEngine On" >> "$links"
    echo -e "RewriteCond %{REQUEST_FILENAME} !-f" >> "$links"
    echo -e "RewriteRule ^ index.html [QSA,L]" >> "$links"

    sudo systemctl restart apache2.service

    runtime=$[ $(date +%s) - $start ]
    echo -e "\033[0;32mDeployed successfully in ${runtime} seconds!\033[0m"
else 
    echo -e "\033[0;33mDeployment halted!\033[0m"
fi

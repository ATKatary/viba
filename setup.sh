set -euo pipefail

read -rp "Enter app name: " appName
npx create-react-app $appName --template typescript
cd $appName 

echo installing firebase...
npm install firebase

echo installing react-bootstrap...
npm i react-bootstrap

echo installing react-router-dom...
npm i react-router-dom

echo installing mui...
npm install @mui/material @emotion/react @emotion/styled

echo installing mui icons...
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react

rm -rf src 
mkdir src
cp -R ../../templates/frontend/src/* src/
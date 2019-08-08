# Acryl IDE
## About
This repository contains [Acryl Web IDE](https://ide.acrylplatform.com) for RIDE smart contracts
You can set default seed, default network byte and node url via settings.

Console documentation can be found [here](https://github.com/wavesplatform/waves-repl) 
## Usage
##### First steps

Make sure you have node-js > 10.0, else https://nodejs.org/en/download/package-manager/

```npm
npm install
```

##### You need to build monaco editor and mocha
```npm
npm run build-monaco && npm run build-mocha
```
##### Run dev server on localhost:8080
```npm
npm start
```
##### Build 
```npm
npm run dist
```

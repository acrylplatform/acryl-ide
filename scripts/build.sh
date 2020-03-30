#!/usr/bin/env bash

npm i

if [ -z "$COMPILER_PARAM" ];
    then echo "Using compiler from package.json"
else
    echo "Using compiler from NODE branch/commit: $COMPILER_PARAM"
    mkdir temp
    cd temp
    git clone 'http://github.com/acrylplatform/Acryl'
    cd Acryl
    git checkout $COMPILER_PARAM
    sbt langJS/fullOptJS
    cd ..
    git clone 'https://github.com/acrylplatform/ride-js'
    cp Acryl/lang/js/target/lang-opt.js ride-js/src
    cd ride-js
    npm i
    npm run build
    npm link
    cd ../../
    npm link @acryl/ride-js
fi

npm run build-monaco
npm run build-mocha
npm run dist prod
rm -rf temp

if [ -z "$COMPILER_PARAM" ];
    then echo "Using compiler from package.json"
    npm unlink --no-save @acryl/ride-js
fi

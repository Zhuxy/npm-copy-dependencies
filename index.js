'use strict';

var fs = require('fs');

function merge(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

function readDependencies(deps, packageJsonFilePath) {
    // console.log('==========' + packageJsonFilePath);

    var buffer = fs.readFileSync(packageJsonFilePath || './package.json');
    var packages = JSON.parse(buffer.toString());
    for (var key in packages.dependencies) {
        if (deps[key]) {
            continue;
        }

        deps[key] = './node_modules/' + key + '/**/*';

        readDependencies(deps, './node_modules/' + key + '/package.json')
    }
}

module.exports = function(devDependencies, packageJsonFilePath) {
    var all = {}

    readDependencies(all, packageJsonFilePath);


    var buffer, packages;
    buffer = fs.readFileSync(packageJsonFilePath || './package.json');
    packages = JSON.parse(buffer.toString());

    if (devDependencies) {
        for (let key in packages.devDependencies) {
            // keys.push('./node_modules/' + key + '/**/*');
            readDependencies(all, './node_modules/' + key + '/package.json');
        }
    }

    var keys = [];
    for (let key in all) {
        keys.push(all[key]);
    }

    // console.log(keys);

    return keys;
};


var bower = require('bower');
var inquirer =  require('inquirer');
var path = require('path');
var fs= require('fs');
var child_process = require("child_process");
var needAll = {};

exports.run = function(){
    require("./bower-dependency-tree");

    bower.commands
        .update([], {},{interactive: true})
        .on('log', function (log) {
            if(log && log.level == 'conflict'){
                var need = {};
                needAll[log.data.name] = need;

                log.data.picks.forEach(function (pick) {
                    pick.dependants = pick.dependants.map(function (dependant) {
                        var release = dependant.pkgMeta._release;
                        return dependant.endpoint.name + (release ? '#' + release : '');
                    }).join(', ');

                    need[pick.endpoint.name+'#'+pick.endpoint.target] = pick.dependants;

                });
                fs.writeFile(path.join(__dirname, 'needAll.js'), "define([], function (){ return" + JSON.stringify(needAll) +  "});", function (err) {
                    if (err) throw err;
                });
            }

        })
        .on('end', function (installed) {
            // open browser in dependency-tree
        })
        .on('prompt', function (prompts, callback) {
            inquirer.prompt(prompts)
                .then(function (answer) {
                    callback(answer);
                });
        })
        .on('error', function (errors) {
        })
};


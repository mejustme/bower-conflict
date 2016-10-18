var path = require('path');
var fs= require('fs');
var child_process = require("child_process");

var allConflict = [];
var allCircularDependency = [];

function doSingle(obj,isDev){

  var need = {};
  var key;
  need.name = obj.name + '#' + obj.endpoint.split('#')[1];
  need.isDevDependencies = isDev;
  need.children = [];

  var arr = [];

  if(obj.failedToSatisfy){
    arr = [];
    if(allConflict.indexOf(obj.name) == -1){
      allConflict.push(obj.name);
    }
    for(key in  obj.failedToSatisfy){
      if(obj.failedToSatisfy[key].indexOf('nej') != -1){

      }
      console.log(obj.failedToSatisfy[key])
      arr.push(obj.failedToSatisfy[key].substr(1))
    }
    need.conflict= arr;
  }

  if(obj.circularDependency){
    arr = [];
    if(allCircularDependency.indexOf(obj.name) == -1){
      allCircularDependency.push(obj.name);
    }
    for(key in  obj.circularDependency){
      arr.push(obj.circularDependency[key].substr(1))
    }
    need.circularDependency = arr;
  }

  for(key in obj.dependencies){
    need.children.push(doSingle(obj.dependencies[key],false));
  }
  for(key in obj.devDependencies){
    need.children.push(doSingle(obj.devDependencies[key],true));
  }
  return need;
}

module.exports = function(preData){
  var resultData;
  resultData = doSingle(preData);
  resultData.allConflict = allConflict;
  resultData.allCircularDependency = allCircularDependency;
  fs.writeFile(path.join(__dirname, '../../../treeJson.js'),  "define([], function (){ return" + JSON.stringify(resultData) +  "});", function (err) {
    if (err) throw err;
  });
  return resultData
};

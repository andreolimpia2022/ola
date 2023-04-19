const bot = require('./bot.js');
const fs = require('fs-extra');

(async()=>{
  var someFile = "novo.js";
  fs.readFile(someFile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    let openStr = "socket.onmessage=function(event){";
    let init = data.indexOf(openStr);
    let end = data.indexOf("};socket.onerror");
    let subdata = data.substring(init + openStr.length, end);
    var result = data.replace(subdata, fs.readFileSync( "glengineb66e1c3b.js", "utf-8" ));
    //console.log(subdata);
    //var result = data.replace(/string to be replaced/g, 'replacement');
  
    fs.writeFile("template.js", result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });


  const botWorker = new bot();
  await botWorker.initiate();
  await botWorker.inject();
})();

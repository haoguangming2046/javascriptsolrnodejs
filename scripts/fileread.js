var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');

var instream = fs.createReadStream('C:/apps/nodejs/scripts/ReadMe.txt');
//var outstream = new stream;
var outstream = fs.createWriteStream('C:/apps/nodejs/scripts/ReadMeOut.txt');

instream.readable = true;
outstream.writable = true;

var rl = readline.createInterface({
    input: instream,
    terminal: false
});

function readFunc(line) {
    console.log(line);
    //Do your stuff ...
    //Then write to outstream
    outstream.write(line);
}

rl.on('line', readFunc);
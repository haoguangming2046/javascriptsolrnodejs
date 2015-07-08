var walk = require('fs-walk');
var fs = require('fs'),
    stream = require('stream'),
    file = require('file'),
    path = require('path'),
    http = require('http'),
    lineReader = require('line-reader');
    
global.maxFilesInFlight = 1000000;
//var directoryName = "C:\\apps\\nodejs\\";
var directoryName = "C:\\Users\\harcor\\workspaces\\sovren\\indexdata\\0\\00";
var MARKER = "------SearchHints------";


function readFile(directoryName,fileName){
	//console.log("file name " + directoryName);
	
	if( true ){
		var instream = fs.createReadStream(directoryName);
		instream.readable = true;
		
		var context = {body: "", doTerms: false,terms: "",fileName: fileName};
		
		function readLine(line, last) {
		  if( line.indexOf(MARKER) >= 0 ){
		  	this.doTerms = true;
		  }
		  else {
		  	if( this.doTerms ){
		  		this.terms += line;
		  	}
		  	else {
		  		this.body += line;
		  	}
		  }
		  if(last){
		    // or check if it's the last one
		    var cb = closeFunc.bind(context);
		    cb();
		  }
		}
		
		lineReader.eachLine(directoryName, readLine.bind(context));
		
		function closeFunc(){
			//console.log("write out");
			var idx = this.fileName.indexOf(".xml");
			var docId = this.fileName;
			if( idx >= 0 ){
					docId = this.fileName.substring(0,idx);
			}
			else {
				docId = this.fileName;
			}
			console.log("docId " + docId);
			//console.log("terms " + this.terms);
			//console.log("body " + this.body);
			
			var doc = { 
									"add": {
									  "overwrite": true,
									  "commitWithin": 5000,
									  "doc": {
									    "id": docId,
									    "body": this.body,
									    "terms": this.terms,
									    "contenttype": "RESUME"
									  }
									}
								};
			
			var docString = JSON.stringify(doc);
			
			//console.log(docString);
			
			var headers = {
			  'Content-Type': 'application/json'
			};
			
			var options = {
			  host: 'localhost',
			  port: 80,
			  path: '/solr/update/json',
			  method: 'POST',
			  headers: headers
			};
			var req = http.request(options, function(res) {
				console.log("statusCode " + res.statusCode + " docId " + docId);
				
			});
			
			//req.on('error', function(e) {
			//  console.log('problem with request: ' + e.message);
			//});
			
			req.write(docString);
			req.end();
			
		}
	}
}

function statHandler(err, stat){
	//console.log("this " + this.fileName);
	if( stat && stat.isDirectory()){
		//console.log("this is dir " + this.directoryName);
		fs.readdir(this.directoryName,readDir.bind({directoryName: this.directoryName,fileName: this.fileName}));
	}
	else {
		//console.log("this is file " + this.directoryName);
		readFile(this.directoryName,this.fileName);
	}
}

var readDir= function(err, list){
	for(var i in list){
			//console.log("file " + list[i]);
			var fileName = list[i];
			var context = {directoryName: this.directoryName + path.sep + fileName,fileName: fileName};
			
			fs.stat(context.directoryName,statHandler.bind(context));
	}
}

fs.readdir(directoryName,readDir.bind({directoryName: directoryName}));
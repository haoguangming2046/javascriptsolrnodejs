
var fs = require('fs');
var http = require('http');
var request = require('request');
var readline = require('readline');
var cheerio = require('cheerio');

var url = "http://www.ebay.com/itm/DELL-LAPTOP-LATITUDE-WINDOWS-7-DUAL-CORE-DVD-BURNER-WIFI-COMPUTER-WIRELESS-2GB-/310927458562?pt=Laptops_Nov05&hash=item4864b88102";

request(url, function(error, response, html) {
  console.log("Got response: " + response.statusCode);
  console.log("Got response: " + JSON.stringify(response.headers));
  //console.log("HTML: " + html);
  
  var outstream = fs.createWriteStream('c:/temp/urlreadwriteparse.txt');

	outstream.writable = true;
	var newDocument = {};
	
	if( !error ){
			var $ = cheerio.load(html);

		  newDocument.title = $("h1[id='itemTitle']").text();
		  newDocument.html = html;
		  newDocument.headers = response.headers;
		  newDocument.statusCode = response.statusCode;
		  
		  console.log("title: " + newDocument.title);
		  
		  
	}
	else {
		console.log(error);
		newDocument.error = "error: " + error;
	}
 
 	outstream.write(JSON.stringify(newDocument));
 	
});
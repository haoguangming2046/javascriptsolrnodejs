
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
  
  var outstream = fs.createWriteStream('c:/temp/urlreadwriteparsedetails.txt');

	outstream.writable = true;
	var newDocument = {};
	
	if( !error ){
			var $ = cheerio.load(html);

		  newDocument.title = $("h1[id='itemTitle']").text();
		  //newDocument.html = html;
		  newDocument.headers = response.headers;
		  newDocument.statusCode = response.statusCode;
		  newDocument.price = $("span[id='prcIsum']").text();
		  
		  newDocument.attributes = new Array();
		  
		  console.log("title: " + newDocument.title);
		  
		  var detailsRows = $("div[class=itemAttr] div[class=section] table"); 

    	detailsRows.each(function(index) {
        console.log("table index: " + index);
        $(this).children("tr").each(function() {
        		var newAttribute1 = {};
        		var newAttribute2 = {};
        		
        		$(this).children("td").each(function(cIdx) {
        			console.log(cIdx + " " + $(this).text());
        			if( cIdx == 0 ){
        				newAttribute1.name = $(this).text().trim();
        			}
        			else if( cIdx == 1 ){
        				newAttribute1.value = $(this).text().trim();
        			}
        			else if( cIdx == 2 ){
        				newAttribute2.name = $(this).text().trim();
        			}
        			else if( cIdx == 3 ){
        				newAttribute2.value = $(this).text().trim();
        			}
        		});
        		
        		if( newAttribute1.hasOwnProperty("name") && newAttribute1.hasOwnProperty("value") ) {
        			newDocument.attributes.push(newAttribute1);
        		}
        		
        		if( newAttribute2.hasOwnProperty("name") && newAttribute2.hasOwnProperty("value") ) {
        			newDocument.attributes.push(newAttribute2);
        		}
        });
    });
		  
	}
	else {
		console.log(error);
		newDocument.error = "error: " + error;
	}
 
 	outstream.write(JSON.stringify(newDocument));
 	
});





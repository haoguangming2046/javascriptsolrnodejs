//Lets require/import the HTTP module
var fs = require('fs');
var http = require('http');
var url = require("url");
var path = require('path');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css",
    "json":"application/json",
    "ico":"image/icon"};

//Lets define a port we want to listen to
const PORT=8988; 

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

//We need a function which handles requests and send response
function handleRequest(request, response){
    var result = {status: 0};
    var mode = request.method;

    var requestUrl = request.url;
    
    var headers = {"Content-Type": "application/json"};
    console.log("mode: " + mode + " url: " + requestUrl);
    if( requestUrl.indexOf('/authservice',0) > -1 ){
    	var requestObj = url.parse(requestUrl, true);
        var queryObj = requestObj.query;
        var contentType = queryObj.contenttype; 

    	if( contentType === 'AUTH' ){
    		var cookieObj = parseCookies(request);
    		if( cookieObj.zen ){
	    		result.status = 1;
	    		result.message = "AOK";
    		}
    		else {
	    		result.message = "FAILURE";
    		}
    	}
    	else if( contentType === 'LOGIN') {
            var userName = queryObj.username;
    		var userKey = queryObj.userkey;
            console.log("do login: " + userName + " " + userKey);
            
    		if( userName === userKey ){
	    		result.status = 1;
	    		result.message = "AOK";
	    		result.alias = userName;
                headers['Set-Cookie'] = 'zen=' + userName;
	    	}
	    	else {
	    		headers['Set-Cookie'] = 'zen=';
                result.status = -1;
	    		result.message = "FAILURE";
	    	}
    	}
        else if( contentType === 'LOGOUT') {
            var cookieObj = parseCookies(request);
            if( cookieObj.zen ){
                headers['Set-Cookie'] = 'zen=';
                result.status = 1;
                result.message = "AOK";
            }
            else {
                result.status = -1;
                result.message = "FAILURE";
            }
        }

    	result.contenttype = contentType;

        pumpResponse(response,headers,result);
    	
    }
    else if( requestUrl.indexOf('/restservice',0) > -1 ){
    	var cookieObj = parseCookies(request);
        if( cookieObj.zen ){
            if( mode === 'GET' ){
                var requestObj = url.parse(requestUrl, true);
                var queryObj = requestObj.query;
                var contentType = queryObj.contenttype; 
            	result.status = 1;
            	result.message = "AOK";

                var doFinally = function(data){
                    console.log("finally" + data);

                    if( data && data.response && data.response.numFound != null ){
                        result.totalCount = data.response.numFound;
                        result.items = data.response.docs;
                    }
                    else {
                        result.totalCount = 0;
                    }


                    pumpResponse(response,headers,result);
                }
                
                var tUrl = buildSolrQueryUrl('http://localhost:8983/solr/jsclosures/select',queryObj);
                readSolrData(tUrl,doFinally);
            }
            else if( mode === 'POST' ) {
                result.status = 1;

                var doFinally = function(data){
                    console.log(data);
                    result.message = "AOK";
                    result.contenttype = data.contenttype;
                    
                    pumpResponse(response,headers,result);
                }

                readChunkData(request,doFinally);
            }
            else if( mode === 'PUT' ) {

                result.status = 1;
                result.message = "AOK";

                var doFinally = function(data){
                    console.log(data);
                    result.message = "AOK";
                    result.contenttype = data.contenttype;
                    
                    pumpResponse(response,headers,result);
                }

                readChunkData(request,doFinally);
            }
            else if( mode === 'DELETE' ) {
                var requestObj = url.parse(requestUrl, true);
                var queryObj = requestObj.query;
                var contentType = queryObj.contenttype; 
                result.status = 1;
                result.message = "AOK";

                var doFinally = function(data){
                    console.log("finally" + data);
                    result.totalCount = data.response.numFound;
                    result.items = data.response.docs;

                    pumpResponse(response,headers,result);
                }
                var tUrl = buildSolrQueryUrl('http://localhost:8983/solr/jsclosures/select',queryObj);
                readSolrData(tUrl,doFinally);
            }
        }
        else {
            result.status = 0;
            result.message = "FAILURE";
            pumpResponse(response,headers,result);
        }
    }
    else if( true ){
        var uri = url.parse(request.url).pathname;
        var filename = path.join(process.cwd() + path.sep + "webapps" + path.sep, unescape(uri));
        var stats;

          try {
            stats = fs.lstatSync(filename); 
            if (stats.isFile()) {
                // path exists, is a file
                var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
                response.writeHead(200, {'Content-Type': mimeType} );

                var fileStream = fs.createReadStream(filename);
                fileStream.readable = true;
                fileStream.pipe(response);
              } else if (stats.isDirectory()) {
                headers["Content-Type"] = 'text/plain';
                pumpResponse(response,headers,'Index of '+uri+'\n'+'TODO, show index?\n');
              } else {
                headers["Content-Type"] = 'text/plain';
                pumpResponse(response,headers,'500 Internal server error\n');
              }
          } catch (e) {
            headers["Content-Type"] = 'text/plain';
            pumpResponse(response,headers,'404 Not Found\n' + filename + " " + e);
            }
    }
    else {
    	result.status = 0;
    	result.message = "FAILURE";
        pumpResponse(response,headers,result);
    }
}


function pumpResponse(response,headers,data){
    response.writeHead(200, headers);

    response.end(JSON.stringify(data));
}

function buildSolrQueryUrl(baseUrl,queryObj){
    var query = queryObj.query;
    if( !query ){
        query = "*:*";
    }
    var start = queryObj.start;
    if( start == null ){
        start = 0;
    }
    var rows = queryObj.rows;
    if( rows == null ){
        rows = 10;
    }
    return( baseUrl + '?wt=json&start=' + start + '&rows=' + rows + "&q=" + query );
}

function readSolrData(solrQuery, callback){
    http.get(solrQuery, function(res) {
    var str = "";
    console.log("solr query: " + solrQuery);

    res.on('data', function (chunk) {
                str += chunk;
          });

    res.on('end', function () {
          var resultObj = JSON.parse(str);
          callback(resultObj);
          
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

function writeSolrData(solrUrl,solrData, callback){

    var jsonData = JSON.stringify(solrData);

    var headers = {
      'content-type' : 'application/json; charset=utf-8',
      'content-length':  Buffer.byteLength(jsonData),
      'accept' : 'application/json; charset=utf-8'
    };

    var options = {
                    uri: solrUrl,
                    method: 'POST',
                    headers: headers
                  };

    var doFinally = function(response){
      readChunkData(response,callback);
    }

    var req = request(options);
    req.on('response', doFinally);
    req.on('error', doFinally);

    req.write(jsonData);
    req.end();
}

function addDocumentToSolr(solrServer,collection,doc,callback){
  var solrAddData = { "add": {"commitWithin": 1000, 
                            "doc": doc
                          }
                  };
  writeSolrData(solrServer + collection + '/update/json',solrAddData,callback);
}

function removeDocumentFromSolr(solrServer,collection,doc,callback){
  var solrDeleteData = { "delete": { "id": doc.id, "commitWithin": 500 }};

  writeSolrData(solrServer + collection + '/update/json',solrDeleteData,callback);
}

function readChunkData(request, callback){
    var str = "";

    request.on('data', function (chunk) {
                str += chunk;
          });

    request.on('end', function () {
          var resultObj = JSON.parse(str);
          callback(resultObj);
    });
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
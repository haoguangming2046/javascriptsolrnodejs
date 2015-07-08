var request = require('request');
var http = require('http');

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

    var doError = function(response){
      readChunkData(response,callback);
    }

    var req = request(options);
    req.on('response', doFinally);
    req.on('error', doError);

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
        console.log(str);
          var resultObj = JSON.parse(str);
          callback(resultObj);
    });
}


function loadTestData(howMany,seed,latitude,longitude) {

  if( howMany <= 0 ){
    console.log("done");
  }
  else {
    var doLater = function(data){
      console.log("recursing " + (howMany-1));
      loadTestData(howMany-1,seed,latitude,longitude);
    }

    var newDoc = {id: "id" + howMany,
                  contenttype: "CONTENT",
                  contenttitle: seed + " title" + howMany,
                  contentbody: seed + " body" + howMany,
                  contentlocation: latitude + "," + longitude};

    addDocumentToSolr('http://localhost:8983/solr/','jsclosures',newDoc,doLater);
  }
}

var latSeed = 40.726;
var longSeed = -73.989;

loadTestData(100,"solr is a cool animal that runs fast",latSeed,longSeed);


//addDocumentToSolr('http://localhost:8983/solr/','jsclosures',{"id": "TestDoc2","username": "TestDoc2"},doLater);

//removeDocumentFromSolr('http://localhost:8983/solr/','jsclosures',{"id": "TestDoc2"},doLater);

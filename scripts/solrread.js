
var fs = require('fs');
var http = require('http');

function readSolrData(solrQuery, callback){
    http.get(solrQuery, function(res) {
    var str = "";
    
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

var doLater = function(response){
  console.log(response);
}

readSolrData('http://192.168.1.200:9983/solr/sovren1_shard1_replica1/select?wt=json&q=*:*',doLater);

# javascriptsolrnodejs
A working 100% javascript MVC application that uses a simple nodejs httpserver script, and solr add, update, delete nodejs scripts.

Solr REST demo using pure javascript, a little bit of dojo (AMD and others), and nodejs.


A complete REST application using 

NodeJs

https://nodejs.org/dist/v0.12.6/x64/node-v0.12.6-x64.msi
https://nodejs.org/dist/v0.12.6/node-v0.12.6.pkg
https://nodejs.org/dist/v0.12.6/node-v0.12.6-linux-x64.tar.gz

Latest Solr

http://www.apache.org/dyn/closer.cgi/lucene/solr/5.2.1

install nodejs as follows:

c:\apps\nodejs

copy into nodejs

scripts
webapps

run the server as follows

node scripts/httpserver.js

http://localhost:8988/index.html

Login with 

any user and password as long as they are the same

username = password


Install Solr

solr.cmd -c -p 8983 -s d:\apps\solr-5.0.0\server\solr -e techproducts

D:\apps\solr-5.0.0\server\scripts\cloud-scripts>.\zkcli.bat -cmd downconfig -confname techproducts -z localhost:9883 -confdir d:\apps\solrconfig\techproducts

copy the techproducts directory to jsclosures

D:\apps\solr-5.0.0\server\scripts\cloud-scripts>.\zkcli.bat -cmd upconfig -confname jsclosures -z localhost:9883 -confdir d:\apps\solrconfig\jsclosures

solr.cmd -c -p 8983 -s d:\apps\solr-5.0.0\server\solr -e techproducts

D:\apps\solr-5.0.0\server\scripts\cloud-scripts>.\zkcli.bat -cmd downconfig -confname techproducts -z localhost:9983 -confdir d:\apps\solrconfig\techproducts

copy the techproducts directory to jsclosures

change the schema.xml

<field name="username" type="string" indexed="true" stored="true" multiValued="false"/>
<field name="userkey" type="string" indexed="true" stored="true" multiValued="false"/>
<field name="authname" type="string" indexed="true" stored="true" multiValued="false"/>
<field name="authkey" type="string" indexed="true" stored="true" multiValued="false"/>

<field name="contenttype" type="string" indexed="true" stored="true" multiValued="false"/>
<field name="contenttitle" type="text_general" indexed="true" stored="true" multiValued="false"/>
<field name="contentbody" type="text_general" indexed="true" stored="true" multiValued="false"/>
<field name="contentall" type="text_general" indexed="true" stored="true" multiValued="false"/>

D:\apps\solr-5.0.0\server\scripts\cloud-scripts>.\zkcli.bat -cmd upconfig -confname jsclosures -z localhost:9983 -confdir d:\apps\solrconfig\jsclosures

http://localhost:8888/solr/admin/cores?action=CREATE&name=jsclosures&collection=jsclosures&property.shard=shard1

http://localhost:8888/solr/jsclosures/update?stream.body=<delete><query>*:*</query></delete>

http://localhost:8888/solr/jsclosures/update?stream.body=<commit/>

solr.cmd stop -all

solr.cmd -c -p 8983 -s d:\apps\solr-5.0.0\server\solr

Load some test data

node scripts/solrwrite.js

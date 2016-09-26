/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), fs = require('fs');

var app = express();

var cloudant = require('cloudant')('https://512b6a00-e4a6-48ba-975f-c8e8acef062a-bluemix:c0f6f2d21676a8b0f6f369cf5076f649ef833da68e518b1b4c0fa79172723a1a@512b6a00-e4a6-48ba-975f-c8e8acef062a-bluemix.cloudant.com');
var db = cloudant.db.use('csc_dashboard');


var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));



app.get('/', routes.index);


app.get('/api/fetchassetsdtls', function(request, response) {
	console.log("Get method invoked..fetching assets details : ..... ");
	var docList = [];
	var i = 0;
	var document;
	var myDoc;
	db.list(function(err, body) {
		if (!err) {
			var len = body.rows.length;
			console.log('total # of docs -> '+len);
			if (len==0 )
				console.log('No document in db');
			else{
				body.rows.forEach(function(document) {
					
					db.get(document.id, { revs_info: true }, function(err, doc) {
						if (!err) {
							//get each field of the document and store as a JSON.
							var myDocument = {
									"_id": doc['_id'],
									"_rev": doc['_rev'],
									"title": doc['title'],
									"link": doc['link'],
									"industry": doc['industry'],
									"service_category": doc['service_category'],
									"description": doc['description'],
									"created_date": doc['created_date'],
									"modified_date": doc['modified_date']
							}
							//push the JSON to an array.
							docList.push(myDocument);
							i++;
							//if all documents are obtained then send the response (JSON Array) back.. 
							if(i==len){
								response.status(200);
								response.setHeader('Content-Type', 'application/json');
								response.write(JSON.stringify(docList));
						        response.end();
						        return;
							}
						}
			
					});
				});
				
							
			}
			
			
		}
		else{
			console.log('db listing failed..');
			response.status(500);
            response.setHeader('Content-Type', 'application/json');
            response.write('{\"Error\":\"' +err+'\"}');
            response.end();
            return;
		}
	});
	
});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});


/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), fs = require('fs');

var app = express();

var cloudant = require('cloudant')('https://512b6a00-e4a6-48ba-975f-c8e8acef062a-bluemix:c0f6f2d21676a8b0f6f369cf5076f649ef833da68e518b1b4c0fa79172723a1a@512b6a00-e4a6-48ba-975f-c8e8acef062a-bluemix.cloudant.com');
var db = cloudant.db.use('csc_dashboard');
var userdb = cloudant.db.use('csc_user');


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

app.get('/api/searchuser', function(request, response){
	console.log("POST method invoked..Verifying if the user is having admin right...");
	var i = 0;
	var found = 0;
	var docList = [];
	var document;
	var myDoc;
	
	
	
	
	console.log('User id is ..' + request.param("userid"));
	console.log('Password id is ..' + request.param("password"));
	
//	userdb.find({selector:{"userid": request.body.userid}}, function(er, result) {
	userdb.find({selector:{"userid": request.param("userid")}}, function(er, result) {
		  if (er) {
			console.log('selector failed..');
			response.status(500);
	        response.setHeader('Content-Type', 'application/json');
	        response.write('{\"Error\":\"' +er+'\"}');
	        response.end();
	        return;
		    //throw er;
		  }
		  response.status(200);
          response.setHeader('Content-Type', 'application/json');
          
		  if(result.docs.length == 0){
			  console.log('User not found!!');
			  response.write('{\"UserExists\":\"False\", \"PWCheck\":\"False\"}');
	          response.end();
	          return;
			  
		  }
		  else{
			  console.log('Found user with name '+ request.param("userid"))// request.body.userid);
			  /*for (var i = 0; i < result.docs.length; i++) {
			    console.log('  Doc id: %s', result.docs[i]._id);
			  }*/			  
//			  if(!(result.docs[i].password == request.body.password)){
			  if(!(result.docs[i].password == request.param("password"))){
				  console.log('Incorrect password!!');
				  response.write('{\"UserExists\":\"True\", \"PWCheck\":\"False\"}');
				  response.end();
				  return;				  
			  }
			  
			  else{ //both user name and password are correct!
				  
				  console.log('Password verified!');
				  //give all list of all docs present in db as response
				  //response.write('{\"UserExists\":\"True\", \"PWCheck\":\"True\"}');
		          
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
											var  strid = doc['_id'];
											var  substr = '_design';
											if(strid.indexOf(substr)== -1)
											{
												var myDocument = {
														"_id": doc['_id'],
														"_rev": doc['_rev'],
														"title": doc['title'],
														"link": doc['link'],
														"industry": doc['industry'],
														"service_category": doc['service_category'],
														"description": doc['description'],
														"created_date": doc['created_date'],
														"modified_date": doc['modified_date'],
														"protected": doc['protected']
												}
												//push the JSON to an array.
												docList.push(myDocument);
												
											}
											i++;						
										
											//if all documents are obtained then send the response (JSON Array) back.. 
											if(i==len){
												console.log('total # of assets-> '+docList.length);
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
			
		  }
	  }
		 
	});
	
});


app.get('/api/fetchassetsdtls', function(request, response) {
	
	var docList = [];
	var i = 0;
	var document;
	var myDoc;
	
	console.log("GET method invoked..fetching assets details : ..... ");
	
	//On the home page show only un-protected assets
	
	db.find({selector:{'protected':'no'}}, function(er, result) {
		  if (er) {
			  	console.log('selector failed..');
				response.status(500);
		        response.setHeader('Content-Type', 'application/json');
		        response.write('{\"Error\":\"' +er+'\"}');
		        response.end();
		        return;
		  }
		  else{
			  console.log('Found %d genertic assets', result.docs.length);
			  for (var i = 0; i < result.docs.length; i++) {
			    console.log('  Doc id: %s', result.docs[i]._id);
				var myDocument = {
						"_id": result.docs[i]._id,
						"_rev": result.docs[i]._rev,
						"title": result.docs[i].title,
						"link": result.docs[i].link,
						"industry": result.docs[i].industry,
						"service_category": result.docs[i].service_category,
						"description": result.docs[i].description,
						"created_date": result.docs[i].created_date,
						"modified_date": result.docs[i].modified_date,
						"protected": result.docs[i].protected
				}
				docList.push(myDocument);
			  }
			  response.status(200);
		      response.setHeader('Content-Type', 'application/json');
		      response.write(JSON.stringify(docList));
		      response.end();
		      return;
			  
		  }
		  
		});

	
});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});


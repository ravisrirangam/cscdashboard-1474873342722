/**
 * Module dependencies.
 */



/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), fs = require('fs');

var app = express();

var cloudant = require('cloudant')('https://512b6a00-e4a6-48ba-975f-c8e8acef062a-bluemix:c0f6f2d21676a8b0f6f369cf5076f649ef833da68e518b1b4c0fa79172723a1a@512b6a00-e4a6-48ba-975f-c8e8acef062a-bluemix.cloudant.com');


var db = cloudant.db.use('csc_dashboard');
var userdb = cloudant.db.use('csc_user');

var localcloudant = require('cloudant')('https://cebb3f76-3e04-43bb-9c4b-f9d8c5ee910c-bluemix:a01e1ae149d22ff94b1183fc854ae8576182d732b0abd3cb2a8430da92ad0dd0@cebb3f76-3e04-43bb-9c4b-f9d8c5ee910c-bluemix.cloudant.com');
var localdb = localcloudant.db.use('csc_dashboard');
var localuserdb = localcloudant.db.use('csc_user');



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
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



app.get('/', routes.index);

app.post('/api/searchuser', function(request, response){
	console.log("POST method invoked..Verifying if the user is having admin right...");
	var i = 0;
	var found = 0;
	var docList = [];
	var document;
	var myDoc;
	
	console.log('User id is ..' + request.body.userid);
	//console.log('Password id is ..' + request.body.password);
	
	userdb.find({selector:{"userid": request.body.userid}}, function(er, result) {
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
			  
			  console.log('Found user with name '+ request.body.userid)// request.body.userid);
			  if(!(result.docs[i].password == request.body.password)){
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
												console.log(myDocument);	
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

app.post('/api/adduser', function(req, response) {
    var userid = req.body.userid;
    var password = req.body.password;
    var role = req.body.role;
    
    console.log("POST method invoked..Adding user..... ");
    console.log("userid",userid);
   
    
//    localuserdb.find({selector:{"userid": userid}}, function(er, result) {
    userdb.find({selector:{"userid": userid}}, function(er, result) {
		  if (er) {
				console.log('selector failed..');
				response.status(500);
		        response.setHeader('Content-Type', 'application/json');
		        response.write('{\"Error\":\"' +er+'\"}');
		        response.end();
		        return;
			    //throw er;
			  }	
	          
			  if(result.docs.length == 0){
//				  localuserdb.insert({ "userid":userid, "password":password}, function(err, body) {
				  userdb.insert({ "userid":userid, "password":password}, function(err, body) {
			    	  if (err){
						  	console.log('Add User failed..');
							response.status(500);
					        response.setHeader('Content-Type', 'application/json');
					        response.write('{\"Error\":\"' +err+'\"}');
					        response.end();
					        return;
					  }    	  
			    	  else{
			    		  console.log('Add User Success..');
			    		  response.status(200);
					      response.setHeader('Content-Type', 'text');
					      response.write('User Added Successfully !!!');
					      response.end();
					      return;
			    	  }
			  });
		}else{
				  console.log('User already exist!!');
				  response.write('User already exist!!');
		          response.end();
		          return;
				  
				  }
  });    

    
});

app.post('/api/addasset', function(req, response) {
	console.log("POST method invoked..Adding asset..... ");
	console.log(req.body);
    var title = req.body.title;
    var link = req.body.link;
    var service = req.body.service_category;
    var desc = req.body.description;
    var createdDate = req.body.created_date;
    var modifiedDate = req.body.modified_date;
    var protectedAsset = req.body.protectedAsset;
    var industry = req.body.industry;
    
//    localdb.insert({ "_id":title,"titel":title,"link":link,"service_category":service,"description":desc,"created_date":createdDate,"modified_date":modifiedDate,"protected":protectedAsset,"industry":industry}, function(err, body) {
    db.insert({ "_id":title,"title":title,"link":link,"service_category":service,"description":desc,"created_date":createdDate,"modified_date":modifiedDate,"protected":protectedAsset,"industry":industry}, function(err, body) {
    	  if (err){
			  	console.log('Add Asset failed..');
				response.status(500);
		        response.setHeader('Content-Type', 'application/json');
		        response.write('{\"Error\":\"' +err+'\"}');
		        response.end();
		        return;
		  }    	  
    	  else{
    		  console.log('Add Aseet Success..');
    		  response.status(200);
		      response.setHeader('Content-Type', 'text');
		      response.write('Asset Added Successfully !!!');
		      response.end();
		      return;
    	  }    		  
 });    
});

app.post('/api/updateasset', function(req, response) {
	console.log("POST method invoked..Updating asset..... ");
	console.log(req.body);
      
//    localdb.get(req.body.title, { revs_info: true }, function(err, doc) {
	db.get(req.body.title, { revs_info: true }, function(err, doc) {
    	 if (!err) {
    	     //console.log(doc);
    	     
    	     
    	     doc.title = req.body.title;
    	     doc.link = req.body.link;
    	     doc.service_category = req.body.service_category;
    	     doc.description = req.body.description;
    	     doc.created_date = req.body.created_date;
    	     doc.modified_date = new Date();
    	     doc.protected = req.body.protected;
    	     doc.industry = req.body.industry;

//    	     localdb.insert(doc, doc.id, function(err, doc) {
    	     db.insert(doc, doc.id, function(err, doc) {
    	    	 if (err){
    				  	console.log('Update Asset failed..');
    					response.status(500);
    			        response.setHeader('Content-Type', 'application/json');
    			        response.write('{\"Error\":\"' +err+'\"}');
    			        response.end();
    			        return;
    			  }    	  
    	    	  else{
    	    		  console.log('Update Aseet Success..');
    	    		  response.status(200);
    			      response.setHeader('Content-Type', 'text');
    			      response.write('Asset Updated Successfully !!!');
    			      response.end();
    			      return;
    	    	  }    		  
    	     });
    	 }
    	 else{
    		 console.log("No such document exists!!");
    		 response.status(500);
		     response.setHeader('Content-Type', 'application/json');
		     response.write('{\"Error\":\"' +err+'\"}');
		     response.end();
		     return;
    		 
    	 }
    });
    

});

app.post('/api/deleteasset', function(req, response) {
	console.log("POST method invoked..Deleting asset..... ");
	console.log(req.body);
	
//	localdb.get(req.body.title, { revs_info: true }, function(err, doc) {
	db.get(req.body.title, { revs_info: true }, function(err, doc) {
   	 if (!err) {
//   		localdb.destroy(doc._id, doc._rev, function(err){
   		db.destroy(doc._id, doc._rev, function(err){
   			if(!err){
   				console.log('Delete Aseet Success..');
	    		  response.status(200);
			      response.setHeader('Content-Type', 'text');
			      response.write('Asset Deleted Successfully !!!');
			      response.end();
			      return;
   			} 
   			else{
   				console.log('Delete Asset failed..');
				response.status(500);
		        response.setHeader('Content-Type', 'application/json');
		        response.write('{\"Error\":\"' +err+'\"}');
		        response.end();
		        return;
   			}
   		 });
   		 
   	 }
   	 else{
   		 console.log('No such document found!');
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


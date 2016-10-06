'use strict';

var ViewAssetsController = function($scope, $http, $window, usSpinnerService,
		$rootScope ) {

	
	$scope.loggedIn = false;
	
	$scope.modeldialoglogin = function() {
		$("#userLogin").modal();
	};

	$scope.privilegeduser = function() {

		var uname = angular.element('[id="username"]').val();
		var pass = angular.element('[id="password"]').val();

		$scope.loggedinusername=uname;
		$scope.loggedinpassword=pass;
		
		$scope.startSpin();
		$scope.spinneractive = true;

		var userlogindata = JSON.stringify({
			userid : uname,
			password : pass
		});
		var config = {
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}

		var res = $http
				.post("/api/searchuser/", userlogindata)
				res.success(
						function(data, status) {
							$scope.assetrecords = data;
							$scope.fetchdescription(data);
							$scope.stopSpin();
							$scope.privilegeusersoption='true';
							$scope.loggedIn = true;
							$("#userLogin").modal("hide");
							if (JSON.stringify(data) == '{"UserExists":"False","PWCheck":"False"}') {
								alert('User is not registered');
								$scope.stopSpin();
								$scope.privilegeusersoption='false';
								$scope.loggedIn = false;
								$("#userLogin").modal("hide");
							} else if (JSON.stringify(data) == '{"UserExists":"True","PWCheck":"False"}') {
								alert('Invalid Password');
								$scope.stopSpin();
								$scope.privilegeusersoption='false';
								$scope.loggedIn = false;
								$("#userLogin").modal("hide");
							}
						});
		res.error(function(data, status, headers, config) {
			alert("failure message: " + JSON.stringify({
				data : data
			}));
			$scope.stopSpin();
			$scope.privilegeusersoption='false';
			$scope.loggedIn = false;
			$("#userLogin").modal("hide");
		});
	};

	$scope.fetchassetsdetails = function() {
		$scope.privilegeusersoption='false';
				$http
						.get('/api/fetchassetsdtls')
						.success(
								function(assetdetails) {
									$scope.assetrecords = assetdetails;
									$scope.fetchdescription(assetdetails);
									});
	};


	$scope.selectedusers = function() {
		if ($scope.find.protected == 'yes') {
			$scope.find.service_category = "";
			$scope.find.industry = "";
		}
		else if ($scope.find.protected == 'no') {
			$scope.find.service_category = "";
			$scope.find.industry = "";
		}
		else if ($scope.find.protected == 'All' || $scope.find.protected == null) {
			$scope.find.protected = '';
			$scope.find.service_category = "";
			$scope.find.industry = "";
		}
	}

	$scope.fetchdescription = function(assetdetails) {
		for (var i = 0; i < assetdetails.length; i++) {
			var description = assetdetails[i].description;
			if (description != undefined && description.length > 55) {
				$scope.assetrecords[i].truncatedDescription = description
						.substring(0, 55)
						+ "...";
				$scope.truncated = true;
				$scope.assetrecords[i].truncated = true;
			} else {
				$scope.assetrecords[i].notTruncated = true;
			}
		}
	};

	$scope.propertyName = 'title';
	$scope.reverse = true;
	$scope.menuselectedfilter = 'service_category';
	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse
				: false;
		$scope.propertyName = propertyName;
	};
	$scope.filterCategory = function(filtername) {
		$scope.filterType = filtername;
		$scope.find.service_category = "";
		$scope.find.industry = "";
	}
	$scope.selectedFilter = function(filtername, selectedfilter) {

		$scope.filterType = filtername;
//		if($scope.find.service_category != undefined)
//			{
//		$scope.find.service_category = "";
//			}
//		if($scope.find.industry != undefined){
//		$scope.find.industry = "";
//		}
		if (selectedfilter == 'industry') {
			$scope.menuselectedfilter = 'industry';
		} else if (selectedfilter == 'service_category') {
			$scope.menuselectedfilter = 'service_category';
		}
	}

	$scope.startcounter = 0;
	$scope.startSpin = function() {
		if (!$scope.spinneractive) {
			usSpinnerService.spin('spinner-1');
			$scope.startcounter++;
		}
	};

	$scope.stopSpin = function() {
		if ($scope.spinneractive) {
			usSpinnerService.stop('spinner-1');
		}
	};

	$scope.stopSpin2 = function() {
		if ($scope.spinneractive) {
			usSpinnerService.stop();
		}
	};
	
	
    $scope.startSpindel = function() {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('spinner-del');
            $scope.startcounter++;
        }
    };

    $scope.stopSpindel = function() {
        if ($scope.spinneractive) {
            usSpinnerService.stop('spinner-del');
        }
    };


	$scope.spinneractive = false;
	
	$rootScope.$on('us-spinner:spin', function(event, key) {
		$scope.spinneractive = true;
	});

	$rootScope.$on('us-spinner:stop', function(event, key) {
		$scope.spinneractive = false;
	});


	$(document)
			.on(
					"click",
					"label.industrytxt",
					function() {
						document.getElementById('searchindustrylabel').style.visibility = 'hidden';
						document.getElementById('searchindustrylabel').style.display = 'none';

						document.getElementById('searchindustry').style.visibility = 'visible';
						document.getElementById('searchindustry').style.display = 'block';
					});

	$scope.industryblur = function() {
		document.getElementById('searchindustry').style.visibility = 'hidden';
		document.getElementById('searchindustry').style.display = 'none';

		document.getElementById('searchindustrylabel').style.visibility = 'visible';
		document.getElementById('searchindustrylabel').style.display = 'block';

	}

	$(document)
			.on(
					"click",
					"label.categorytxt",
					function() {
						document.getElementById('searchcategorylabel').style.visibility = 'hidden';
						document.getElementById('searchcategorylabel').style.display = 'none';

						document.getElementById('searchcategory').style.visibility = 'visible';
						document.getElementById('searchcategory').style.display = 'block';
					});

	$scope.categoryblur = function() {
		document.getElementById('searchcategory').style.visibility = 'hidden';
		document.getElementById('searchcategory').style.display = 'none';

		document.getElementById('searchcategorylabel').style.visibility = 'visible';
		document.getElementById('searchcategorylabel').style.display = 'block';

	}

	$scope.names = [ "yes", "no", "All" ];
	
	
	$scope.addUser = function() {
		var uname = angular.element('[id="username1"]').val();
		var pass = angular.element('[id="password1"]').val();
		
        var adduserdata = JSON.stringify({
        	userid: uname,
        	password: pass
        });
        
        $http.post("/api/adduser", adduserdata).success(function(data, status) {
        	$("#addUser").modal("hide");
        	alert(data);
        	
        });
        
	};
	
	$scope.addAsset = function()
	{
		$scope.startSpin();
		$scope.spinneractive = true;

		var link = angular.element('[id="link"]').val();
		var title = angular.element('[id="title"]').val();
		var industry = angular.element('[id="industry"]').val();
		var category = angular.element('[id="category"]').val();
		var description = angular.element('[id="description"]').val();
		var isprotected = angular.element('[id="isProtected"]').val();
		
		
        var adduserdata = JSON.stringify({
        	link : link,
        	title: title,
        	industry : industry,
        	service_category : category,
        	description : description,
        	protectedAsset : isprotected
        });
        
       var res= $http.post("/api/addasset", adduserdata)
       res.success(function(data, status) {
        	var addstatus=data;
        	if(status=200)
        		{
    		
    		var userlogindata = JSON.stringify({
    			userid : $scope.loggedinusername,
    			password : $scope.loggedinpassword
    		});
    		var config = {
    			headers : {
    				'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8;'
    			}
    		}

    		$http
    				.post("/api/searchuser/", userlogindata)
    				.success(
    						function(data, status) {
    							$scope.assetrecords = data;
    							$scope.fetchdescription(data);
    							$scope.stopSpin();
    							$scope.privilegeusersoption='true';
    							$scope.loggedIn = true;
    							$("#addAsset").modal("hide");
    							$window.alert(addstatus);
    						});
        		}
//        	alert(data);
        });
		res.error(function(data, status, headers, config) {
			alert("failure message: " + JSON.stringify({
				data : data
			}));
			$scope.stopSpin();
		});
	};
	
	$scope.privilegeusersopt = {Public : "no",
			Private : "yes",
			All : "All"
		};

	$scope.modeldialoglogout = function() {
		var backlen = history.length;
	    history.go(-backlen);
	    
	    window.location.replace("/");
		};

	


$scope.deleteAssets = function(assetrecord)
{
	
	

	//alert('link will be deleted : ' + assetrecord.link)
	var	deleteAssetAns = $window.confirm('Are you sure you want to delete the Asset?');
    if(deleteAssetAns){

    	
    	$scope.startSpindel();
    	$scope.spinneractive = true;


     //Your action will goes here
    	var res = $http.post('api/deleteasset', JSON.stringify({title:assetrecord.title}));

        res.success(function(data, status, headers, config) {
            $scope.successmessage = data;
            var deletestatus=data;
        	if(status=200)
    		{
		
		var userlogindata = JSON.stringify({
			userid : $scope.loggedinusername,
			password : $scope.loggedinpassword
		});
		var config = {
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		}

		$http
				.post("/api/searchuser/", userlogindata)
				.success(
						function(data, status) {
							$scope.assetrecords = data;
							$scope.fetchdescription(data);
							$scope.stopSpindel();
							$scope.privilegeusersoption='true';
							$scope.loggedIn = true;
				            $window.alert(deletestatus);          
						});
    		}
            
        });
        res.error(function(data, status, headers, config) {
        	$scope.stopSpin();
            alert( "Failed to delete the asset\n Info:  " + JSON.stringify(data));
            
        });
    }
}


$scope.updateAssets = function(assetrecord)
{
	
	
	$scope.link=assetrecord.link;
	$scope.title=assetrecord.title;
	$scope.selectedIndustryvalue=assetrecord.industry;
	$scope.selectedCategoryvalue=assetrecord.service_category;
	$scope.description=assetrecord.description;
	$scope.selectedProtectedvalue=assetrecord.protected;
	$("#modifyAsset").modal();
}

$scope.modifyAsset = function(link,title,industry,category,description,selectedItemvalue){
	
	$scope.startSpin();
	$scope.spinneractive = true;

	
	var usermodifydata = JSON.stringify({
		title : title,
		link : link,
		service_category : category,
		description : description,
		protected : selectedItemvalue,
		industry : industry
	});
	

	
var res= 	$http
	.post("/api/updateasset", usermodifydata)
	res.success(
			function(data, status) {
				var updatestaus=data;
	        	if(status=200)
        		{
    		
    		var userlogindata = JSON.stringify({
    			userid : $scope.loggedinusername,
    			password : $scope.loggedinpassword
    		});
    		var config = {
    			headers : {
    				'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8;'
    			}
    		}

    		$http
    				.post("/api/searchuser/", userlogindata)
    				.success(
    						function(data, status) {
    							$scope.assetrecords = data;
    							$scope.fetchdescription(data);
    							$scope.stopSpin();
    							$scope.privilegeusersoption='true';
    							$scope.loggedIn = true;
    							alert(updatestaus);
    							$("#modifyAsset").modal("hide");
    						});
        		}

        });
	res.error(function(data, status, headers, config) {
		alert("failure message: " + JSON.stringify({
			data : data
		}));
		$scope.stopSpin();
		$scope.privilegeusersoption='true';

	});
			
}

		
};

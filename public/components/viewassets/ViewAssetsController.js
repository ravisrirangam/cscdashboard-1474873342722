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

		$http
				.post("/api/searchuser/", userlogindata)
				.success(
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
        	alert(data);
        });
        
	};
	
	$scope.addAsset = function()
	{
		
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
        
        $http.post("/api/addasset", adduserdata).success(function(data, status) {
        	alert(data);
        });
		
		/*
		if($scope.addAssetsForm.link==undefined){
			$scope.addAssetsForm.validlink="";
			$scope.addAssetsForm.validtitle="";
			$scope.addAssetsForm.validindustry="";
			$scope.addAssetsForm.validcategory="";
			$scope.addAssetsForm.validdescription="";

	        $scope.startSpin();
	        $scope.spinneractive = true;
	        alert('save');
            $scope.stopSpin();
            $scope.addAssetsForm.validlink="Link is missing";
                return;
            }
		else	if($scope.addAssetsForm.title==undefined){
			$scope.addAssetsForm.validlink="";
			$scope.addAssetsForm.validtitle="";
			$scope.addAssetsForm.validindustry="";
			$scope.addAssetsForm.validcategory="";
			$scope.addAssetsForm.validdescription="";

	        $scope.startSpin();
	        $scope.spinneractive = true;
	        alert('save');
            $scope.stopSpin();
            $scope.addAssetsForm.validtitle="Title is missing";
                return;
            }

		else	if($scope.addAssetsForm.industry==undefined){
			$scope.addAssetsForm.validlink="";
			$scope.addAssetsForm.validtitle="";
			$scope.addAssetsForm.validindustry="";
			$scope.addAssetsForm.validcategory="";
			$scope.addAssetsForm.validdescription="";

	        $scope.startSpin();
	        $scope.spinneractive = true;
	        alert('save');
            $scope.stopSpin();
            $scope.addAssetsForm.validindustry="Industry Group is missing";
                return;
            }
		else	if($scope.addAssetsForm.category==undefined){
			$scope.addAssetsForm.validlink="";
			$scope.addAssetsForm.validtitle="";
			$scope.addAssetsForm.validindustry="";
			$scope.addAssetsForm.validcategory="";
			$scope.addAssetsForm.validdescription="";

	        $scope.startSpin();
	        $scope.spinneractive = true;
	        alert('save');
            $scope.stopSpin();
            $scope.addAssetsForm.validcategory="Category is missing";
                return;
            }
		else	if($scope.addAssetsForm.description==undefined){
			$scope.addAssetsForm.validlink="";
			$scope.addAssetsForm.validtitle="";
			$scope.addAssetsForm.validindustry="";
			$scope.addAssetsForm.validcategory="";
			$scope.addAssetsForm.validdescription="";

	        $scope.startSpin();
	        $scope.spinneractive = true;
	        alert('save');
            $scope.stopSpin();
            $scope.addAssetsForm.validdescription="Description is missing";
                return;
            }

		else{
			$scope.addAssetsForm.validlink="";
			$scope.addAssetsForm.validtitle="";
			$scope.addAssetsForm.validindustry="";
			$scope.addAssetsForm.validcategory="";
			$scope.addAssetsForm.validdescription="";
			
			var assetdata =$scope.addAssetsForm; 

	        $scope.startSpin();
	        $scope.spinneractive = true;

			
	        var res = $http.post('api/addupdateasset', assetdata);

	        res.success(function(data, status, headers, config) {
	            $scope.message = data;
	            alert($scope.message.ok)
	           
	            $scope.stopSpin();
	        });
	        res.error(function(data, status, headers, config) {
	        	$scope.stopSpin();
	            alert( "failure message: " + JSON.stringify({data: data}));
	            
	        });

			
			
				
		}*/
		
		
		
		
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

	
$scope.updateAssets = function(assetrecord)
{
	alert('link value is : ' + assetrecord.link)
}


$scope.deleteAssets = function(assetrecord)
{
	//alert('link will be deleted : ' + assetrecord.link)
	var	deleteAssetAns = $window.confirm('Are you sure you want to delete the Asset?');
    if(deleteAssetAns){
     //Your action will goes here
    	var res = $http.post('api/deleteasset', JSON.stringify({title:assetrecord.title}));

        res.success(function(data, status, headers, config) {
            $scope.successmessage = data;
            $window.alert($scope.successmessage);          
            $scope.stopSpin();
        });
        res.error(function(data, status, headers, config) {
        	$scope.stopSpin();
            alert( "Failed to delete the asset\n Info:  " + JSON.stringify(data));
            
        });
    }
}
		
		
};

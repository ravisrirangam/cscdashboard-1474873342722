'use strict';


var AddAssetsController = function($scope, $http, $window, usSpinnerService, $rootScope) {
	
	$scope.searchLink = function()
	{
		
		if($scope.addAssetsForm.link==undefined){
	        $scope.startSpin();
	        $scope.spinneractive = true;
	        alert('search');
            $scope.stopSpin();
            $scope.addAssetsForm.validlink="Link is missing";
                return;
            }
		else{
			$scope.addAssetsForm.validlink="";
	        $scope.startSpin();
	        $scope.spinneractive = true;
            
			$http.get('api/fetchlinkdetails', {
                params: {
                    assetlink: $scope.addAssetsForm.link
                }
            }).success(function (linkdetals) {
            	alert("link details " + angular.toJson(linkdetals));
                $scope.addAssetsForm = linkdetals;
                $scope.stopSpin();
            });

				
		}
		
	}

	
	$scope.addupdateAssets = function()
	{
		
		
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

			
			
				
		}
		
	}


	
	$scope.deleteAssets = function()
	{
		
		
		if($scope.addAssetsForm.link==undefined){
			$scope.addAssetsForm.validlink="";
			$scope.addAssetsForm.validtitle="";
			$scope.addAssetsForm.validindustry="";
			$scope.addAssetsForm.validcategory="";
			$scope.addAssetsForm.validdescription="";

	        $scope.startSpin();
	        $scope.spinneractive = true;
	        alert('delete');
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
	        alert('delete');
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
	        alert('delete');
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
	        alert('delete');
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
	        alert('delete');
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
			
	        $scope.startSpin();
	        $scope.spinneractive = true;
						
			
	        var res = $http.delete('api/deleteasset', {
                params: {
                    assetlink: $scope.addAssetsForm.link
                }
            });

	        res.success(function(data, status, headers, config) {
	            $scope.message = data;
	            alert($scope.message.ok)
	           
	            $scope.stopSpin();
	        });
	        res.error(function(data, status, headers, config) {
	        	$scope.stopSpin();
	            alert( "failure message: " + JSON.stringify({data: data}));
	        });

			
			
			
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
    $scope.spinneractive = false;

    $rootScope.$on('us-spinner:spin', function(event, key) {
        $scope.spinneractive = true;
    });

    $rootScope.$on('us-spinner:stop', function(event, key) {
        $scope.spinneractive = false;
    });

    $scope.startSpin2 = function() {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('spinner-2');
            $scope.startcounter++;
        }
    };

    $scope.stopSpin2 = function() {
        if ($scope.spinneractive) {
            usSpinnerService.stop('spinner-2');
        }
    };





};

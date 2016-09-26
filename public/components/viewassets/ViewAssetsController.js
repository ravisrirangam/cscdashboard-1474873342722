'use strict';


var ViewAssetsController = function($scope, $http, $window, usSpinnerService, $rootScope) {
	
	
    $scope.fetchassetsdetails = function() {
        $scope.startSpin();
        $scope.spinneractive = true;
//        alert('fetching assets details');
        
        $http.get('/api/fetchassetsdtls').success(function (assetdetails) {

            $scope.assetrecords = assetdetails;
            $scope.stopSpin();
        });

        
        $scope.stopSpin();
        
    };
    
    
    $scope.propertyName = 'title';
    $scope.reverse = true;
    

    
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
      };

		$scope.filterCategory = function(filtername){
			$scope.filterType=filtername;
			
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




};

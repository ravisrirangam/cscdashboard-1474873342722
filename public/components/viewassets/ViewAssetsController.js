'use strict';


var ViewAssetsController = function($scope, $http, $window, usSpinnerService, $rootScope) {
	
	
    $scope.fetchassetsdetails = function() {
        $scope.startSpin();
        $scope.spinneractive = true;
//        alert('fetching assets details');
        
        $http.get('/api/fetchassetsdtls').success(function (assetdetails) {
        	

            $scope.assetrecords = assetdetails;   
            
            for(var i=0; i< assetdetails.length;i++){
                //	alert($scope);
                	 var description = assetdetails[i].description;
                
                	 if( description != undefined &&  description.length > 70 ){
                	     $scope.assetrecords[i].truncatedDescription = description.substring(0,70)+"...";
                	     $scope.truncated = true;
                	    
                	     $scope.assetrecords[i].truncated = true;
                	     
                	 }else{
                		 $scope.assetrecords[i].notTruncated = true; 
                	 }
                    
                  }
           
            $scope.stopSpin();
           
        });

        
        $scope.stopSpin();
        
    };
    
    
    $scope.propertyName = 'title';
    $scope.reverse = true;
    
    

    
    $scope.menuselectedfilter='service_category';
    
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
      };

		$scope.filterCategory = function(filtername){
			$scope.filterType=filtername;

			
		}
		
		$scope.selectedFilter = function(filtername,selectedfilter){
			
			$scope.filterType=filtername;
			
			if(selectedfilter=='industry')
				{
			
				$scope.menuselectedfilter='industry';
				}
			else if (selectedfilter=='service_category')
				{
			
				$scope.menuselectedfilter='service_category';
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




};

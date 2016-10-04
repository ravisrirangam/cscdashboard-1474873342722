var MainController =  ['$scope','$rootScope','$state','$sessionStorage', 'context','$http', function($scope, $rootScope, $state, $sessionStorage, context,$http) {

	$scope.$storage = $sessionStorage;

	$scope.getSession = function() {
//		return $scope.$storage.session;
		return true;
	};

	$scope.loggedIn = false;
	
	$scope.login = function() {
		$scope.$storage.session = { 'username' : 'test' };
		$state.go('dashboard');
	};

	$scope.logout = function() {
		$scope.$storage.session = null;
		$state.go('landing');
	};

	$scope.viewAsset= function()
	{
	     $state.go('viewassets');
	}

	$scope.modeldialogadduser = function() {		
		 $("#addUser").modal();
	};
	
	$scope.modeldialogaddasset = function() {		
		 $("#addAsset").modal();
	};
	

	    
	    


//	$scope.addUser = function() {
//		var uname = angular.element('[id="username1"]').val();
//		var pass = angular.element('[id="password1"]').val();
//		var userrole = angular.element('[id="role"]').val();
//		
//        var adduserdata = JSON.stringify({
//        	userid: uname,
//        	password: pass,
//        	role: userrole
//        });
//        
//        $http.post("/api/adduser", adduserdata).success(function(data, status) {
//        	alert("User added successfully !!!");
//        });
//        
//	};

	$scope.modeldialoglogin = function() {		
		 $("#userLogin").modal();
	};
	
	$scope.modelDialogAddAsset = function () {
        var addModal = $modal.open({
            templateUrl: 'addassetss/addassets.html',
            controller: AssetModalController,
            resolve: {
                asset: function () {
                    return {};
                },
                action: function() {
                    return 'add';
                }
            }
        });

        addModal.result.then(function (asset) {
            saveAsset(asset);
        });
    };

	
//	$scope.userlogin = function() {
//
//		var uname = angular.element('[id="username"]').val();
//		var pass = angular.element('[id="password"]').val();
//		
//		
//        var userlogindata = JSON.stringify({
//        	userid: uname,
//        	password: pass
//        });
//        
//  
//        var config = {
//                headers : {
//                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
//                }
//            }
//        
//        $http.post("/api/searchuser/", userlogindata).success(function(data, status) {
//            //console.log('Data posted successfully');
//        	$scope.assetrecords="";
//           	$scope.assetrecords = data;
////        	alert(JSON.stringify(data));
//        	if(JSON.stringify(data)=='{"UserExists":"False","PWCheck":"False"}')
//        		{
//        		alert('User is not registered!!');
//        		return;
//        		}
//        	else if(JSON.stringify(data)=='{"UserExists":"True","PWCheck":"False"}')
//        		{
//        		alert('Invalid Password!!');
//        		return;
//        		}
//        
//           	$rootScope.loggedIn = true;
//          })
//        
//        
//	};
	
	$scope.goHome = function() {
		if ($scope.getSession() == null) {
			$state.go('dashboard');
		} else {
			$state.go('dashboard');
		}
	}

	$scope.menuTabs = [ {
		'name' : 'Main Page',
		'url' : '#',
		'font' : 'fa fa-home'
	}, {
		'name' : 'Services',
		'url' : '#services',
		'font' : 'fa fa-eyedropper'
	}, {
		'name' : 'About',
		'url' : '#about',
		'font' : 'fa fa-question'
	} ];

	$scope.context = context;

	$scope.footerText = '© ' + new Date().getFullYear() + ' CSC Assets Dashboard';

	$rootScope.$state = $state;

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		var requireLogin = toState.data.requireLogin;

		if (requireLogin && $scope.getSession() == null) {
			event.preventDefault();
	//		$state.go('landing');
			$state.go('dashboard');
		}
	});  
}];

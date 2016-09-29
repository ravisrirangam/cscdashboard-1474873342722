var MainController =  ['$scope','$rootScope','$state','$sessionStorage', 'context','$http', function($scope, $rootScope, $state, $sessionStorage, context,$http) {

	$scope.$storage = $sessionStorage;

	$scope.getSession = function() {
//		return $scope.$storage.session;
		return true;
	};

	$scope.login = function() {
		$scope.$storage.session = { 'username' : 'test' };
		$state.go('dashboard');
	};

	$scope.logout = function() {
		$scope.$storage.session = null;
		$state.go('landing');
	};


	$scope.modeldialoglogin = function() {		
		 $("#userLogin").modal();
	};

	
	$scope.userlogin = function() {
		
		
		
		var uname = angular.element('[id="username"]').val();
		var pass = angular.element('[id="password"]').val();
		
		
        var userlogindata = JSON.stringify({
        	userid: uname,
        	password: pass
        });
  
        var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
        
        $http.post("/api/searchuser/", userlogindata).success(function(data, status) {
            //console.log('Data posted successfully');
            $scope.assetrecords="";
        	$scope.assetrecords = data;
//        	alert(JSON.stringify(data));
        	if(JSON.stringify(data)=='{"UserExists":"False","PWCheck":"False"}')
        		{
        		alert('User is not registered!!');
        		}
        	else if(JSON.stringify(data)=='{"UserExists":"True","PWCheck":"False"}')
        		{
        		alert('Invalid Password!!');
        		}
          })
        
        
	};

	
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

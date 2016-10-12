var MainController =  ['$scope','$rootScope','$state','$sessionStorage', 'context','$http','$window', 'usSpinnerService', function($scope, $rootScope, $state, $sessionStorage, context,$http,$window, usSpinnerService) {

	$scope.$storage = $sessionStorage;

	$scope.getSession = function() {
		return $scope.$storage.session;
	};

	$scope.loggedIn = false;
	
	$scope.login = function() {
		
		alert('jjj');
		
		
		$scope.$storage.session = { 'username' : 'test' };
	//	$state.go('viewassets');
		$state.go('/');
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
		angular.element('[id="username1"]').val('');
		angular.element('[id="password1"]').val('');
		angular.element('[id="role"]').val('');
		
		 $("#addUser").modal();
	};
	
	$scope.modeldialogaddasset = function() {		
		angular.element('[id="link"]').val('');
		angular.element('[id="title"]').val('');
		angular.element('[id="description"]').val('');
		
		 $("#addAsset").modal();
	};
	

	    $scope.userlogin = function()
	    {
			$scope.startSpin();
			$scope.spinneractive = true;

			var uname = angular.element('[id="loginusername"]').val();
			var pass = angular.element('[id="loginpassword"]').val();

			$scope.loggedinusername=uname;
			$scope.loggedinpassword=pass;
			
//			$scope.startSpin();
//			$scope.spinneractive = true;

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
								
								if(data.Userid == 'null')
									{
									alert('User is not registered');
									$("#userLogin").modal("hide");
									$state.go('landing');
									}
								else if (data.PWCheck=='False')
									{
									alert('Invalid Password');
									$("#userLogin").modal("hide");
									$state.go('landing');
									}
								else if(data.Userid !='null' && data.PWCheck !='False')
									{
									$scope.$storage.session = { 'username' : data.Userid,'profile':data.Role };
									$("#userLogin").modal("hide");
									$state.go('viewassets');
									}
//								$scope.assetrecords = data;
//								alert(angular.toJson(data.Userid));
////								$scope.fetchdescription(data);
////								$scope.stopSpin();
//								$scope.privilegeusersoption='true';
//								$scope.loggedIn = true;
//								if(pass=='divya'){
//								$scope.$storage.session = { 'username' : uname,'password' : pass,'profile':'view' };
//								}else if(pass=='nidhi'){
//								$scope.$storage.session = { 'username' : uname,'password' : pass,'profile':'view' };
//								}else if(pass=='sudhir' || pass=='ravi'){
//								$scope.$storage.session = { 'username' : uname,'password' : pass,'profile':'admin' };
//								}
//								$state.go('viewassets');
//								$("#userLogin").modal("hide");
//								if (JSON.stringify(data) == '{"UserExists":"False","PWCheck":"False"}') {
//									alert('User is not registered');
////									$scope.stopSpin();
//									$scope.privilegeusersoption='false';
//									$scope.loggedIn = false;
//									$state.go('landing');
//									$("#userLogin").modal("hide");
//								} else if (JSON.stringify(data) == '{"UserExists":"True","PWCheck":"False"}') {
//									alert('Invalid Password');
////									$scope.stopSpin();
//									$scope.privilegeusersoption='false';
//									$scope.loggedIn = false;
//									$state.go('landing');
//									$("#userLogin").modal("hide");
//								}
							});
			res.error(function(data, status, headers, config) {
				alert("failure message: " + JSON.stringify({
					data : data
				}));
				$scope.loggedIn = false;
				$("#userLogin").modal("hide");
			});
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

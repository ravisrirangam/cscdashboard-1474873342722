var MainController =  ['$scope','$rootScope','$state','$sessionStorage', 'context', function($scope, $rootScope, $state, $sessionStorage, context) {

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

	$scope.goHome = function() {
		if ($scope.getSession() == null) {
		//	$state.go('landing');
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

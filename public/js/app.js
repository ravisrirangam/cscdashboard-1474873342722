var app = angular.module('cscassets-demo', ['ui.router','ui.router.stateHelper','ngAnimate','ngCookies','ngResource','ngStorage','angularSpinner']);


/** Start of Configurable constants **/
app.constant('context', '/cscassets');
/** End of Configurable constants **/

app.config(['stateHelperProvider','$urlRouterProvider','$urlMatcherFactoryProvider',function(stateHelperProvider,$urlRouterProvider,$urlMatcherFactoryProvider) {

	$urlRouterProvider.otherwise("/");

	$urlMatcherFactoryProvider.strictMode(true)

	stateHelperProvider.state({
		name: "landing",
		url: "/",
		templateUrl: "components/landing/landing.html",
		controller: "MainController",
		data: { requireLogin : false }
	}).state({
/*		name: "dashboard",
		url: "/dashboard",
		templateUrl: "components/dashboard/dashboard.html",
		controller: "DashboardController",
		data: { requireLogin : false }
	}).state({
*/		name: "viewassets",
		url: "/viewassets",
		templateUrl: "components/viewassets/viewassets.html",
		controller: "ViewAssetsController",
		data: { requireLogin : true }
	}).state({
		name: "addassets",
		url: "/addassets",
		templateUrl: "components/addassets/addassets.html",
		controller: "AddAssetsController",
		data: { requireLogin : false }
	});
} ]);

/** Controllers **/

app.controller('MainController', MainController);
app.controller('ViewAssetsController', ViewAssetsController);
app.controller('AddAssetsController', AddAssetsController);


/** Services **/
app.factory('ViewAssets', ViewAssets);
app.factory('AddAssets', AddAssets);

/** Directives **/

app.directive('scrollToTarget', function() {
  return function(scope, element) {
    element.bind('click', function() {
    	angular.element('html, body').stop().animate({
			scrollTop: angular.element(angular.element(element).attr('href')).offset().top - 20
		}, 1500);
		return false;
    });
  };
});

app.directive('mcToggleActive', function() {
		    return {	
		        link: function(scope, element, attrs) {
		            element.find('li').on('click', function() {
		                $(this).addClass('active').siblings().removeClass('active');
		            });
		        }
		    }
		});

app.filter('unique', function() {
	   return function(collection, keyname) {
	      var output = [], 
	          keys = [];

	      angular.forEach(collection, function(item) {
	          var key = item[keyname];
	          if(keys.indexOf(key) === -1) {
	              keys.push(key);
	              output.push(item);
	          }
	      });

	      return output;
	   };
	});

app.directive('jsonText', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
			function into(input) {
				console.log(JSON.parse(input));
				return JSON.parse(input);
			}
			function out(data) {
				return JSON.stringify(data);
			}
			ngModel.$parsers.push(into);
			ngModel.$formatters.push(out);
		}
	};
});

app.filter('filterByProperty', function () {
    /* array is first argument, each addiitonal argument is prefixed by a ":" in filter markup*/
    return function (dataArray, searchTerm, propertyName) {
        if (!dataArray) return;
        /* when term is cleared, return full array*/
        if (!searchTerm) {
            return dataArray
        } else {
            /* otherwise filter the array */
            var term = searchTerm.toLowerCase();
            return dataArray.filter(function (item) {
                return item[propertyName].toLowerCase().indexOf(term) > -1;
            });
        }
    }
});


var ViewAssets = ['$resource','context', function($resource, context) {
	return $resource(context + '/viewassets');
}];

var AddAssets = ['$resource','context', function($resource, context) {
	return $resource(context + '/addassets');
}];

/*
var DashBoard = ['$resource','context', function($resource, context) {
	return $resource(context + '/dashboard');
}];
*/
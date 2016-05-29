angular.module('Login', ['ngMaterial']).controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    /*
    Django expects to receive a QueryDict such as
    <QueryDict: {'csrfmiddlewaretoken': ['mycsrftoken'], 'username': ['myusername'], 'next': ['/'], 'password': ['mypassword']}>
    */
    $scope.login = function() {
        var data = {'username': [$scope.username], 'password': [$scope.password]};
        $.ajaxSetup({ traditional: true });
        console.log($.param(data));
        $http.post('/login/', $.param(data))
        .then(function(response) {
            $window.location.href = response.data.redirect;
        }, function(response) {
            console.log(response);
            $scope.errors = response.data;
        });
    }

}])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('grey');
})
.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
})
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
}]);

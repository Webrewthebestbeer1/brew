angular.module('Index', ['ngMaterial']).controller('IndexController', ['$scope', '$http', function($scope, $http) {

    var feed = 'http://beerpulse.com/feed/';
    $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(feed))
    .then(function(response) {
        $scope.rss = response.data.responseData.feed;
        console.log($scope.rss);
        for (var entry in $scope.rss.entries) {
            var content = $scope.rss.entries[entry].content;
            var imgBegin = content.indexOf('img src="');
            var imgEnd = content.indexOf('" alt');
            var img = $scope.rss.entries[entry].content.substring(imgBegin + 9, imgEnd);
            $scope.rss.entries[entry].img = img;
        }
    })



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
}])
.directive('input', [function() {
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (
                   'undefined' !== typeof attrs.type
                && 'number' === attrs.type
                && ngModel
            ) {
                ngModel.$formatters.push(function(modelValue) {
                    return Number(modelValue);
                });

                ngModel.$parsers.push(function(viewValue) {
                    return Number(viewValue);
                });
            }
        }
    }
}]);

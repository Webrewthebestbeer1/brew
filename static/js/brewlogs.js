angular.module('BrewLogs', ['ngMaterial']).controller('BrewLogsController', ['$scope', '$http', function($scope, $http) {

    $scope.addEntry = function() {
        var entry = {
            name: $scope.entryName,
            date: new Date().toISOString(),
            malts: [],
            hops: [],
            logs: [],
            comments: [],
        };
        $http.post('api/entries', entry)
        .success(function(response) {
            console.log(response)
            window.location.replace('log?id=' + response.id);
        })
        .error(function(response) {
            console.log(response);
            return;
        });
    }

    $scope.removeEntry = function(item) {
        var maltId = item['id'];
        $http.delete('api/malts/delete/' + maltId)
        .success(function(response) {
            console.log(response);
            var index = $scope.entry.malts.indexOf(item);
            $scope.entry.malts.splice(index, 1);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $http.get("api/entries").success(function(response) {
        $scope.entries = response;
        console.log(response);
    });

    $scope.openEntry = function(entry) {
        console.log(entry);
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

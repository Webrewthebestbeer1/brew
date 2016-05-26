angular.module('BrewLogs', ['ngMaterial']).controller('BrewLogsController', ['$scope', '$http', function($scope, $http) {

    $scope.addRecipe = function() {
        var recipe = {
            name: $scope.recipeName,
            date: new Date().toISOString(),
            malts: [],
            hops: [],
            brews: [],
        };
        $http.post('api/recipes', recipe)
        .success(function(response) {
            console.log(response)
            window.location.replace('log?id=' + response.id);
        })
        .error(function(response) {
            console.log(response);
            return;
        });
    }

    $scope.removeRecipe = function(item) {
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

    $http.get("api/recipes").success(function(response) {
        $scope.recipes = response.results;
        console.log(response);
    });

    // TODO: find out why this gets called n^2 times when loading page
    $scope.averageRating = function(recipe) {
        if (recipe.brews.length == 0) return 0;
        var sum = 0;
        for (var i = 0; i < recipe.brews.length; i++) {
            sum += recipe.brews[i].rating;
        }
        return sum/recipe.brews.length;
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

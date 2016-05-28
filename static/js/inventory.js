angular.module('Inventory', ['ngMaterial'])
.controller('InventoryController', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

    var adjustDialog = function(ev, text, callback) {
        var adjust = $mdDialog.prompt()
        .title('Adjust amount')
        .textContent(text)
        .ariaLabel(text)
        .targetEvent(ev)
        .placeholder('Amount')
        .ok('Ok')
        .cancel('Cancel');
        $mdDialog.show(adjust).then(function(value) {
            if (typeof(value) == 'undefined') return;
            if (!Number(value)) return;
            callback(value);
        });
    }

    $scope.addMalt = function() {
        var malt = {
            name: $scope.maltName,
            amount: $scope.maltAmount,
        };
        $http.post('/api/inventory/malts/', malt)
        .success(function(response) {
            console.log(response)
            $scope.malts.push(response);
            $scope.maltName = "";
            $scope.maltAmount = "";
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.addHop = function() {
        var hop = {
            name: $scope.hopName,
            amount: $scope.hopAmount,
        };
        $http.post('/api/inventory/hops/', hop)
        .success(function(response) {
            console.log(response)
            $scope.hops.push(response);
            $scope.hopName = "";
            $scope.hopAmount = "";
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.updateMalt = function(ev, item) {
        adjustDialog(ev, item.name, function(value) {
            var field = {amount: item.amount + Number(value)};
            $http.put('/api/inventory/malts/update/' + item['id'], field)
            .success(function(response) {
                console.log(response);
                var index = $scope.malts.indexOf(item);
                $scope.malts[index].amount = response.amount;
            })
            .error(function(response) {
                console.log(response);
            });
        });
    }

    $scope.updateHop = function(ev, item) {
        adjustDialog(ev, item.name, function(value) {
            var field = {amount: item.amount + Number(value)};
            $http.put('/api/inventory/hops/update/' + item['id'], field)
            .success(function(response) {
                console.log(response);
                var index = $scope.hops.indexOf(item);
                $scope.hops[index].amount = response.amount;
            })
            .error(function(response) {
                console.log(response);
            });
        });
    }

    $http.get('/api/inventory/malts').success(function(response) {
        $scope.malts = response.results;
        console.log(response);
    });
    $http.get('/api/inventory/hops').success(function(response) {
        $scope.hops = response.results;
        console.log(response);
    });

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

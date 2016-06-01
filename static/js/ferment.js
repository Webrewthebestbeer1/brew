angular.module('Ferment', ['ngMaterial', 'chart.js']).controller('FermentController', ['$scope', '$http', function($scope, $http) {


    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    $scope.populateChart = function() {
        $http.get('/api/ferment/get_sensor_readings?limit=20')
        .then(function(response) {
            $scope.readings = response.data;
            console.log($scope.readings);
            for (var reading in $scope.readings) {
                var date = new Date($scope.readings[reading].date);
                var ddate = date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false});
                $scope.labels.push(ddate);
                var sensors = [
                    $scope.readings[reading].sensors['beer'],
                    $scope.readings[reading].sensors['bottom'],
                    $scope.readings[reading].sensors['top'],
                ]
                $scope.data[0].push(sensors[0]);
                $scope.data[1].push(sensors[1]);
                $scope.data[2].push(sensors[2]);
                var count = 0;
                var sum = 0;
                for (var i  = 0; i < sensors.length; i++) {
                    if (typeof(sensors[i]) != 'undefined') {
                        count++;
                        sum += sensors[i];
                    }
                }
                $scope.data[3].push(sum/count);
                $scope.data[4].push($scope.readings[reading].target_temp);
                var compressor = $scope.readings[reading].compressor_state ? 1 : 0;
                $scope.data[5].push(compressor);
            }
        }, function(response) {
            console.log(response);
        });
        //setTimeout($scope.updateGraph, 5000);
    }

    $scope.updateChart = function() {
        $http.get('/api/ferment/get_sensor_readings?limit=1')
        .then(function(response) {
            var reading = 0;
            var date = new Date($scope.readings[reading].date);
            var ddate = date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false});
            $scope.labels.push(ddate);
            var sensors = [
                $scope.readings[reading].sensors['beer'],
                $scope.readings[reading].sensors['bottom'],
                $scope.readings[reading].sensors['top'],
            ]
            $scope.data[0].push(sensors[0]);
            $scope.data[1].push(sensors[1]);
            $scope.data[2].push(sensors[2]);
            var count = 0;
            var sum = 0;
            for (var i  = 0; i < sensors.length; i++) {
                if (typeof(sensors[i]) != 'undefined') {
                    count++;
                    sum += sensors[i];
                }
            }
            $scope.data[3].push(sum/count);
            $scope.data[4].push($scope.readings[reading].target_temp);
            var compressor = $scope.readings[reading].compressor_state ? 1 : 0;
            $scope.data[5].push(compressor);
        });
        setTimeout($scope.updateGraph, 5000);
    }

    $scope.updateTarget = function() {
        $http.post('/api/ferment/set_target_temp?target_temp=' + $scope.adjust_target_temp)
        .then(function(response) {
            $scope.target_temp = response.data.target_temp;
        }, function(response) {
            console.log(response);
        })
    }

    $scope.refreshChart = function() {
        $scope.labels = [];
        $scope.series = ['Beer', 'Bottom', 'Top', 'Average', 'Target', 'Compressor'];
        $scope.data = [
            [],
            [],
            [],
            [],
            [],
            [],
        ];
        $scope.populateChart();
    }

$scope.refreshChart();

$http.get('/api/recipe/brews/ongoing')
.then(function(response) {
    console.log(response);
    $scope.brews = response.data.results;
}, function(response) {
    console.log(response);
});

$http.get('/api/ferment/get_target_temp')
.then(function(response) {
    $scope.target_temp = response.data.target_temp;
    $scope.adjust_target_temp = response.data.target_temp;
}, function(response) {
    console.log(response);
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

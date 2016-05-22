angular.module('BrewLog', ['ngMaterial']).controller('BrewLogController', ['$scope', '$http', function($scope, $http) {

    var entryId = '1';
    var baseUrl = 'api/entries/' + entryId

    $scope.addMalt = function() {
        var malt = {name: $scope.maltName, amount: $scope.maltAmount};
        $http.post(baseUrl + '/malts', malt)
        .success(function(response) {
            console.log(response)
            $scope.entry.malts.push(response);
            $scope.maltName = "";
            $scope.maltAmount = "";
        })
        .error(function(response) {
            console.log(response);
            return;
        });
    }

    $scope.removeMalt = function(item) {
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

    $scope.addHop = function() {
        var hop = {name: $scope.hopName, amount: $scope.hopAmount, add: $scope.hopAdd};
        $http.post(baseUrl + '/hops', hop)
        .success(function(response) {
            console.log(response)
            $scope.entry.hops.push(response);
            $scope.hopName = "";
            $scope.hopAmount = "";
            $scope.hopAdd =  "";
        })
        .error(function(response) {
            console.log(response);
            return;
        });
    }

    $scope.removeHop = function(item) {
        var hopId = item['id'];
        $http.delete('api/hops/delete/' + hopId)
        .success(function(response) {
            console.log(response);
            var index = $scope.entry.hops.indexOf(item);
            $scope.entry.hops.splice(index, 1);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.addComment = function() {
        var date = new Date().toISOString();
        var comment = {date: date, comment: $scope.newComment};
        $http.post(baseUrl + '/comments', comment)
        .success(function(response) {
            console.log(response)
            $scope.entry.comments.push(response);
            $scope.newComment = "";
        })
        .error(function(response) {
            console.log(response);
            return;
        });
    }

    $scope.deleteComment = function(item) {
        var commentId = item['id'];
        $http.delete('api/comments/delete/' + commentId)
        .success(function(response) {
            console.log(response);
            var index = $scope.entry.comments.indexOf(item);
            $scope.entry.comments.splice(index, 1);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.editedComments = {};
    $scope.editComment = function(comment) {
        $scope.editedComments[comment.date] = !$scope.editedComments[comment.date];
    }
    $scope.saveComment = function(comment) {
        var index = $scope.entry.comments.indexOf(comment);
        var text = $("#comment" + comment.id).val();
        var field = {comment: text}
        $http.put('api/comments/update/' + comment['id'], field)
        .success(function(response) {
            console.log(response);
            comment.comment = text;
            $scope.editComment(comment);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.addLog = function(entry) {
        var start = $scope.logEntryStart.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
        var end = $scope.logEntryEnd.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
        var entry = {start: start, end: end, description: $scope.logEntryDescription};
        $http.post(baseUrl + '/logs', entry)
        .success(function(response) {
            console.log(response)
            $scope.entry.logs.push(response);
            $scope.logEntryStart = "";
            $scope.logEntryEnd = "";
            $scope.logEntryDescription = "";
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.deleteLog = function(item) {
        var logId = item['id'];
        $http.delete('api/logs/delete/' + logId)
        .success(function(response) {
            console.log(response);
            var index = $scope.entry.logs.indexOf(item);
            $scope.entry.logs.splice(index, 1);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.updateEntry = function(field) {
        field['name'] = $scope.entry.name;
        $http.put('api/entries/update/' + entryId, field)
        .success(function(response) {
            console.log(response);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.updateYeast = function() {
        var yeast = {yeast: $scope.entry.yeast};
        $scope.updateEntry(yeast);
    }

    $scope.updateFermentation = function() {
        var fermentation = {fermentation_time: $scope.entry.fermentation_time, fermentation_temperature: $scope.entry.fermentation_temperature}
        $scope.updateEntry(fermentation);
    }

    $scope.updateMash = function() {
        var mash = {mash_time: $scope.entry.mash_time, sparge_time: $scope.entry.sparge_time};
        $scope.updateEntry(mash);
    }

    $scope.updateWater = function() {
        var water = {
            batch_size: $scope.entry.batch_size,
            grain_bill: $scope.entry.grain_bill,
            boil_time: $scope.entry.boil_time,
            mash_temperature: $scope.entry.mash_temperature,
            trub_loss: $scope.entry.trub_loss,
            equipment_loss: $scope.entry.equipment_loss,
            mash_thickness: $scope.entry.mash_thickness,
            grain_temperature: $scope.entry.grain_temperature,
            wort_shrinkage: $scope.entry.wort_shrinkage,
            grain_absorption: $scope.entry.grain_absorption,
            percent_boiloff: $scope.entry.percent_boiloff,
            evaporation_factor: $scope.entry.evaporation_factor,
        };
        $scope.updateEntry(water);
        var preBoilWort = (($scope.entry.batch_size + $scope.entry.trub_loss)/0.96)/$scope.entry.evaporation_factor;
        var totalWater = preBoilWort + (Number($scope.entry.equipment_loss) + 1.2522 * $scope.entry.grain_bill);
        var mashWater = 0.9475 * $scope.entry.mash_thickness * $scope.entry.grain_bill;
        var spargeWater = totalWater - mashWater;
        var strikeTemperature = ((((($scope.entry.grain_bill/0.454)*0.05)+(mashWater/3.79))*$scope.entry.mash_temperature)-((($scope.entry.grain_bill/0.454)*0.05)*$scope.entry.grain_temperature))/(mashWater/3.79);
        var approximateMashVolume = $scope.entry.grain_bill * (0.67 + $scope.entry.mash_thickness);
        $(" #preBoilWort ").val(preBoilWort.toFixed(2));
        $(" #totalWater ").val(totalWater.toFixed(2));
        $(" #mashWater ").val(mashWater.toFixed(2));
        $(" #spargeWater ").val(spargeWater.toFixed(2));
        $(" #strikeTemperature" ).val(strikeTemperature.toFixed(2));
        $(" #approximateMashVolume" ).val(approximateMashVolume.toFixed(2));
    }

    var densityToPlato = function(density) {
        return -616.868+(1111.14*density)-(630.272*Math.pow(density, 2))+(135.997*Math.pow(density, 3));
    }

    $scope.updateGravity = function() {
        var og = $scope.entry.og;
        var fg = $scope.entry.fg;
        var gravity = {og: og, fg: fg}
        $scope.updateEntry(gravity);
        var attenuation = 1 - (fg/og);
        var realExtract = (0.1808*densityToPlato(og)) + (0.8192*densityToPlato(fg));
        var abv = (((Math.abs(densityToPlato(og)-realExtract))/Math.abs(2.0666-(0.010665*densityToPlato(og)))/100)*fg)/0.79;
        abv *= 100;
        $(" #abv ").val(abv.toFixed(2));
    }



    $http.get("api/entries/1").success(function(response) {
        $scope.entry = response;
        $scope.$watch('entry.i', function() {
            $scope.entry.i = parseFloat($scope.entry.i);
        });
        console.log(response);
        $scope.updateGravity();
        $scope.updateWater();

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
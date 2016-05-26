angular.module('BrewLog', ['ngMaterial', 'ngAnimate', 'ngRoute'])
.controller(
    'BrewLogController',
    ['$scope', '$http', '$location', '$mdDialog', function($scope, $http, $location, $mdDialog) {

    var recipeId = $location.search().id;
    var baseUrl = 'api/recipes/' + recipeId
    $scope.brewCollapse = [];
    $scope.logStart = [];
    $scope.logEnd = [];
    $scope.logDescription = [];
    $scope.comments = [];
    $scope.equip = {};

    var showWarning = function(ev, text, callback) {
        var confirm = $mdDialog.confirm()
        .title('Confirm action')
        .textContent(text)
        .ariaLabel(text)
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');
        $mdDialog.show(confirm).then(function() {
            callback();
        });
    }

    $scope.addMalt = function() {
        var malt = {name: $scope.maltName, amount: $scope.maltAmount};
        $http.post(baseUrl + '/malts', malt)
        .success(function(response) {
            console.log(response)
            $scope.recipe.malts.push(response);
            $scope.maltName = "";
            $scope.maltAmount = "";
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.removeMalt = function(ev, item) {
        var callback = function() {
            var maltId = item['id'];
            $http.delete('api/malts/delete/' + maltId)
            .success(function(response) {
                console.log(response);
                var index = $scope.recipe.malts.indexOf(item);
                $scope.recipe.malts.splice(index, 1);
            })
            .error(function(response) {
                console.log(response);
            });
        }
        showWarning(ev, 'Remove malt?', callback);
    }

    $scope.addHop = function() {
        var hop = {name: $scope.hopName, amount: $scope.hopAmount, add: $scope.hopAdd};
        $http.post(baseUrl + '/hops', hop)
        .success(function(response) {
            console.log(response)
            $scope.recipe.hops.push(response);
            $scope.hopName = "";
            $scope.hopAmount = "";
            $scope.hopAdd =  "";
        })
        .error(function(response) {
            console.log(response);
            return;
        });
    }

    $scope.removeHop = function(ev, item) {
        var callback = function() {
            var hopId = item['id'];
            $http.delete('api/hops/delete/' + hopId)
            .success(function(response) {
                console.log(response);
                var index = $scope.recipe.hops.indexOf(item);
                $scope.recipe.hops.splice(index, 1);
            })
            .error(function(response) {
                console.log(response);
            });
        }
        showWarning(ev, 'Remove hop?', callback);
    }

    $scope.addBrew = function() {
        var brew = {
            logs: [],
            comments: [],
        };
        $http.post(baseUrl + '/brews', brew)
        .success(function(response) {
            console.log(response);
            console.log($scope.brewCollapse)
            $scope.recipe.brews.push(response);
            $scope.brewCollapse[$scope.recipe.brews.length - 1] = true;
        })
        .error(function(response) {
            console.log(response);
        })
    }

    $scope.removeBrew = function(ev, brew) {
        var callback = function() {
            $http.delete('api/brews/delete/' + brew.id)
            .success(function(response) {
                console.log(response);
                var index = $scope.recipe.brews.indexOf(brew);
                $scope.recipe.brews.splice(index, 1);
            })
            .error(function(response) {
                console.log(response);
            });
        }
        showWarning(ev, 'Remove brew?', callback);
    }

    $scope.addComment = function(brew) {
        var date = new Date().toISOString();
        var comment = {date: date, comment: $scope.comments[brew]};
        $http.post('api/brews/' + brew.id + '/comments', comment)
        .success(function(response) {
            console.log(response)
            brew.comments.push(response);
            $scope.comments[brew] = "";
        })
        .error(function(response) {
            console.log(response);
            return;
        });
    }

    $scope.deleteComment = function(ev, brew, item) {
        var callback = function() {
            var commentId = item['id'];
            $http.delete('api/comments/delete/' + commentId)
            .success(function(response) {
                console.log(response);
                console.log(item);
                var index = brew.comments.indexOf(item);
                brew.comments.splice(index, 1);
            })
            .error(function(response) {
                console.log(response);
            });
        }
        showWarning(ev, 'Remove comment?', callback);
    }

    $scope.titleEdit = false;
    $scope.editTitle = function() {
        $scope.titleEdit = !$scope.titleEdit;
        $scope.title = $scope.recipe.name;
        if (!$scope.titleEdit) {
            $scope.recipe.name = $(' #title ').val();
            $scope.updateRecipe({});
        }
    }

    $scope.editedComments = {};
    $scope.editComment = function(comment) {
        $scope.editedComments[comment.date] = !$scope.editedComments[comment.date];
    }
    $scope.updateComment = function(brew, comment) {
        var index = brew.comments.indexOf(comment);
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

    $scope.addLog = function(brew) {
        var start = $scope.logStart[brew].toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
        var end = $scope.logEnd[brew].toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
        var entry = {start: start, end: end, description: $scope.logDescription[brew]};
        $http.post('api/brews/' + brew.id + '/logs', entry)
        .success(function(response) {
            console.log(response)
            brew.logs.push(response);
            $scope.logStart[brew] = "";
            $scope.logEnd[brew] = "";
            $scope.logDescription[brew] = "";

        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.deleteLog = function(ev, brew, item) {
        var callback = function() {
            var logId = item['id'];
            $http.delete('api/logs/delete/' + logId)
            .success(function(response) {
                console.log(response);
                var index = brew.logs.indexOf(item);
                brew.logs.splice(index, 1);
            })
            .error(function(response) {
                console.log(response);
            });
        }
        showWarning(ev, 'Remove log entry?', callback);
    }

    $scope.addEquipment = function() {
        var equipment = {name: $scope.equipmentName};
        $scope.equipmentName = "";
        $http.post('api/equipment', equipment)
        .success(function(response) {
            console.log(response);
            $scope.equipment.push(response);
            $scope.equip = response;
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.updateRecipe = function(field) {
        field['name'] = $scope.recipe.name;
        $http.put('api/recipes/update/' + recipeId, field)
        .success(function(response) {
            console.log(response);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.updateBrew = function(brew, field) {
        $http.put('api/brews/update/' + brew.id, field)
        .success(function(response) {
            console.log(response);
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.updateYeast = function() {
        var yeast = {yeast: $scope.recipe.yeast};
        $scope.updateRecipe(yeast);
    }

    $scope.updateFermentation = function(brew) {
        var fermentation = {fermentation_time: brew.fermentation_time, fermentation_temperature: brew.fermentation_temperature}
        $scope.updateBrew(brew, fermentation);
    }

    $scope.updateMash = function() {
        var mash = {mash_time: $scope.entry.mash_time, sparge_time: $scope.entry.sparge_time};
        $scope.updateRecipe(mash);
    }

    $scope.updateWater = function() {
        var water = {
            batch_size: $scope.recipe.batch_size,
            boil_time: $scope.recipe.boil_time,
            mash_temperature: $scope.recipe.mash_temperature,
            trub_loss: $scope.recipe.trub_loss,
            equipment_loss: $scope.recipe.equipment_loss,
            mash_thickness: $scope.recipe.mash_thickness,
            grain_temperature: $scope.recipe.grain_temperature,
            wort_shrinkage: $scope.recipe.wort_shrinkage,
            grain_absorption: $scope.recipe.grain_absorption,
            percent_boiloff: $scope.recipe.percent_boiloff,
            evaporation_factor: $scope.recipe.evaporation_factor,
        };
        $scope.updateRecipe(water);
        var grain_bill = 0;
        for (var i = 0; i < $scope.recipe.malts.length; i++) {
            grain_bill += Number($scope.recipe.malts[i].amount);
        }
        var preBoilWort = (($scope.recipe.batch_size + Number($scope.equip.trub_loss))/0.96)/$scope.equip.evaporation_factor;
        var totalWater = preBoilWort + (Number($scope.equip.equipment_loss) + 1.2522 * grain_bill);
        var mashWater = 0.9475 * $scope.equip.mash_thickness * grain_bill;
        var spargeWater = totalWater - mashWater;
        var strikeTemperature = (((((grain_bill/0.454)*0.05)+(mashWater/3.79))*$scope.recipe.mash_temperature)-(((grain_bill/0.454)*0.05)*$scope.recipe.grain_temperature))/(mashWater/3.79);
        var approximateMashVolume = grain_bill * (0.67 + Number($scope.equip.mash_thickness));
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

    $scope.updateGravity = function(brew, initial) {
        var og = brew.og;
        var fg = brew.fg;
        if(!initial) {
            var gravity = {og: og, fg: fg}
            $scope.updateBrew(brew, gravity);
        }
        var attenuation = 1 - (densityToPlato(fg)/densityToPlato(og));
        var realExtract = (0.1808*densityToPlato(og)) + (0.8192*densityToPlato(fg));
        var abv = (((Math.abs(densityToPlato(og)-realExtract))/Math.abs(2.0666-(0.010665*densityToPlato(og)))/100)*fg)/0.79;
        abv *= 100;
        brew.abv = abv.toFixed(2);
        brew.attenuation = (attenuation * 100).toFixed(2);
    }

    $scope.updateRating = function(brew, param) {
        brew.rating = param;
        var rating = {rating: brew.rating};
        $scope.updateBrew(brew, rating);
    }

    $http.get(baseUrl).success(function(response) {
        /*
        Django's DecimalField are serialized to Strings.
        Convert them to Number.
        */
        $scope.recipe = response;

        console.log(response);
        for (var i = 0; i < $scope.recipe.brews.length; i++) {
            console.log($scope.recipe.brews[i]);
            $scope.updateGravity($scope.recipe.brews[i], true);
        }
        $scope.$watch('equip', $scope.updateWater);

    });

    $http.get('api/equipment').success(function(response) {
        $scope.equipment = response.results;
        if ($scope.equipment.length > 0) $scope.equip = $scope.equipment[0];
        console.log($scope.equipment);
    })

}])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('grey');
})
/*
Django and Angular share the same template tags.
Set the Angular tags to {[{ code }]}
*/
.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
})
/*
Inject CSRF-token into the HTTP requests
*/
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}])
/*
Need $location to get URL parameteres
*/
.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}])
.config(function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('responseObserver');
})
/*
Django's DecimalField are serialized to Strings.
Try to convert them to Number.
*/
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
}])
/*
Star rating. Based on these two examples:
https://codepen.io/TepigMC/pen/FIdHb
http://jsfiddle.net/manishpatil/2fahpk7s/
*/
.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '=?',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template:
            '<ul class="star-rating" ng-class="{readonly: readOnly}">' +
            '   <li ng-repeat="idx in maxRatings track by $index" class="star" ' +
            'ng-class="{filled: !((hoverValue + _rating) <= $index)}" ' +
            'ng-click="isolatedClick($index + 1)" ' +
            'ng-mouseenter="isolatedMouseHover($index + 1)" ' +
            'ng-mouseleave="isolatedMouseLeave($index + 1)"> ' +
            '<i class="fa fa-star"></i></li></ul>',
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            };
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            };

            $scope._rating = $scope.rating;

			$scope.isolatedClick = function (param) {
				if ($scope.readOnly) return;

				$scope.rating = $scope._rating = param;
				$scope.hoverValue = 0;
				$scope.click({
					param: param
				});
			};

			$scope.isolatedMouseHover = function (param) {
				if ($scope.readOnly) return;

				$scope._rating = 0;
				$scope.hoverValue = param;
				$scope.mouseHover({
					param: param
				});
			};

			$scope.isolatedMouseLeave = function (param) {
				if ($scope.readOnly) return;

				$scope._rating = $scope.rating;
				$scope.hoverValue = 0;
				$scope.mouseLeave({
					param: param
				});
			};
        }
    };
})
/*
Redirect to login when not authenticated
*/
.factory('responseObserver', function responseObserver($q, $window) {
    return {
        'responseError': function(errorResponse) {
            switch (errorResponse.status) {
            case 403:
                $window.location = './admin';
                break;
            }
            return $q.reject(errorResponse);
        }
    };
});

angular.module('Brew', ['ngMaterial', 'ngAnimate', 'ngRoute'])
.controller(
    'RecipeController',
    ['$scope', '$http', '$location', '$mdDialog', '$q', function($scope, $http, $location, $mdDialog, $q) {

    var recipeId = $location.search().id;
    var baseUrl = '/api/recipe/recipes/' + recipeId
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

    $scope.addMalt = function(ev) {
        if ($scope.selectedMaltItem == null) {
            showWarning(
                ev,
                $scope.searchMaltText + ' not found in inventory. Should I create it?',
                function() {
                    malt = {
                        name: $scope.searchMaltText,
                        amount: 0,
                    };
                    $http.post('/api/inventory/malts/', malt)
                    .success(function(response) {
                        inventory = response;
                        console.log("new inventory created");
                        insertMalt(inventory, $scope.maltAmount);
                    })
                    .error(function(response) {
                        console.log(response);
                    })
                }
            )
        } else {
            insertMalt($scope.selectedMaltItem, $scope.maltAmount);
        }
        $scope.calculateWater();
    }

    var insertMalt = function(inventory, amount) {
        var malt = {inventory: inventory, amount: amount};
        $http.post(baseUrl + '/malts', malt)
        .success(function(response) {
            console.log(response)
            $scope.recipe.malts.push(response);
            $scope.maltAmount = "";
            $scope.searchMaltText = "";
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.queryHopSearch = function(query) {
        var deferred = $q.defer();
        $http.get('/api/inventory/hops?name=' + query)
        .then(function(result) {
            deferred.resolve(result.data.results);
        });
        return deferred.promise;
    }

    $scope.queryMaltSearch = function(query) {
        var deferred = $q.defer();
        $http.get('/api/inventory/malts?name=' + query)
        .then(function(result) {
            deferred.resolve(result.data.results);
        });
        return deferred.promise;
    }

    $scope.addHop = function(ev) {
        if ($scope.selectedHopItem == null) {
            showWarning(
                ev,
                $scope.searchHopText + ' not found in inventory. Should I create it?',
                function() {
                    hop = {
                        name: $scope.searchHopText,
                        amount: 0,
                    };
                    $http.post('/api/inventory/hops/', hop)
                    .success(function(response) {
                        inventory = response;
                        console.log("new inventory created");
                        insertHop(inventory, $scope.hopAmount, $scope.hopAdd);
                    })
                    .error(function(response) {
                        console.log(response);
                    })
                }
            )
        } else {
            insertHop($scope.selectedHopItem, $scope.hopAmount, $scope.hopAdd);
        }
    }

    var insertHop = function(inventory, amount, add) {
        var hop = {inventory: inventory, amount: amount, add: add};
        $http.post(baseUrl + '/hops', hop)
        .success(function(response) {
            console.log(response)
            $scope.recipe.hops.push(response);
            $scope.hopAmount = "";
            $scope.hopAdd = "";
            $scope.searchHopText = "";
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.removeMalt = function(ev, item) {
        var callback = function() {
            var maltId = item['id'];
            $http.delete('/api/recipe/malts/delete/' + maltId)
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

    $scope.removeHop = function(ev, item) {
        var callback = function() {
            var hopId = item['id'];
            $http.delete('/api/recipe/hops/delete/' + hopId)
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

    $scope.addBrew = function(ev) {
        var sufficientInventory = true;
        var missingMalts = [];
        var missingHops = [];
        var malts = {};
        var hops = {};
        for (var i = 0; i < $scope.recipe.malts.length; i++) {
            if ($scope.recipe.malts[i].inventory.amount < $scope.recipe.malts[i].amount) {
                sufficientInventory = false;
                missingMalts.push($scope.recipe.malts[i].inventory.name);
            } else {
                malts[$scope.recipe.malts[i].inventory.id] = $scope.recipe.malts[i].amount;
            }

        }
        for (var i = 0; i < $scope.recipe.hops.length; i++) {
            if ($scope.recipe.hops[i].inventory.amount < $scope.recipe.hops[i].amount) {
                sufficientInventory = false;
                missingHops.push($scope.recipe.hops[i].inventory.name);
            } else {
                hops[$scope.recipe.hops[i].inventory.id] = $scope.recipe.hops[i].amount;
            }

        }
        var warning = '';
        if (!sufficientInventory) {
            warning = 'You have insufficient inventory.\n'
            if (missingMalts) {
                warning += ' Missing malts: '
                for (var i = 0; i < missingMalts.length; i++) {
                    warning += missingMalts[i];
                    if (i < missingMalts.length - 1) warning += ', ';
                    else warning += '.\n';
                }
            }
            if (missingHops) {
                warning += ' Missing hops: '
                for (var i = 0; i < missingHops.length; i++) {
                    warning += missingHops[i];
                    if (i < missingHops.length - 1) warning += ', ';
                    else warning += '.\n';
                }
            }
            warning += ' Start brew either way? Items missing from inventory will not be subtracted from inventory.';
        } else {
            warning = 'This will subtract all ingredients from the inventory. Continue?';
        }
        showWarning(ev, warning, function() {
            var brew = {
                logs: [],
                comments: [],
            };
            $http.post(baseUrl + '/brews', brew)
            .success(function(response) {
                console.log(response);
                $scope.recipe.brews.push(response);
                $scope.brewCollapse[$scope.recipe.brews.length - 1] = true;
                subtractInventory(malts, hops);
            })
            .error(function(response) {
                console.log(response);
            })
        })
    }

    var subtractInventory = function(malts, hops) {
        for (var id in malts) {
            console.log(malts[id]);
            $http.put('/api/inventory/malts/update/' + id + '?adjust=' + ((malts[id] | 0) * -1))
            .success(function(response) {
                console.log(response);
            })
            .error(function(response) {
                console.log(response);
            });
        }
        for (var id in hops) {
            console.log(hops[id]);
            $http.put('/api/inventory/hops/update/' + id + '?adjust=' + (hops[id]  *-1))
            .success(function(response) {
                console.log(response);
            })
            .error(function(response) {
                console.log(response);
            });
        }
    }

    $scope.removeBrew = function(ev, brew) {
        var callback = function() {
            $http.delete('/api/recipe/brews/delete/' + brew.id)
            .success(function(response) {
                console.log(response);
                var index = $scope.recipe.brews.indexOf(brew);
                $scope.recipe.brews.splice(index, 1);
                $scope.updateAverageRating();
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
        $http.post('/api/recipe/brews/' + brew.id + '/comments', comment)
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
            $http.delete('/api/recipe/comments/delete/' + commentId)
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

    $scope.editedComments = {};
    $scope.editComment = function(comment) {
        $scope.editedComments[comment.date] = !$scope.editedComments[comment.date];
    }
    $scope.updateComment = function(brew, comment) {
        var index = brew.comments.indexOf(comment);
        var text = $("#comment" + comment.id).val();
        var field = {comment: text}
        $http.put('/api/recipe/comments/update/' + comment['id'], field)
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
        $http.post('/api/recipe/brews/' + brew.id + '/logs', entry)
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
            $http.delete('/api/recipe/logs/delete/' + logId)
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
        $http.post('/api/recipe/equipment/', equipment)
        .success(function(response) {
            console.log(response);
            $scope.equipment.push(response);
            $scope.equip = response;
        })
        .error(function(response) {
            console.log(response);
        });
    }

    $scope.calculateWater = function() {
        var grain_bill = 0;
        for (var i = 0; i < $scope.recipe.malts.length; i++) {
            grain_bill += Number($scope.recipe.malts[i].amount);
        }
        var preBoilWort = (($scope.recipe.batch_size + Number($scope.equip.trub_loss))/0.96)/$scope.equip.evaporation_factor;
        var totalWater = preBoilWort + (Number($scope.equip.equipment_loss) + 1.2522 * grain_bill);
        var mashWater = 0.9475 * $scope.equip.mash_thickness * grain_bill;
        var spargeWater = totalWater - mashWater;
        var strikeTemperature = (((((grain_bill/0.454)*0.05)+(mashWater/3.79))*$scope.recipe.mash_temperature)-(((grain_bill/0.454)*0.05)*$scope.grain_temperature))/(mashWater/3.79);
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

    $scope.updateAverageRating = function() {
        var sum = 0;
        var validRatings = 0;
        for (var i = 0; i < $scope.recipe.brews.length; i++) {
            if ($scope.recipe.brews[i].rating > 0) {
                sum += $scope.recipe.brews[i].rating;
                validRatings++;
            }
        }
        if (validRatings == 0) {
            $scope.averageRating = 0;
            return;
        }
        $scope.averageRating = sum/validRatings;
    }

    $scope.updateGravity = function(brew, initial) {
        var og = brew.og;
        var fg = brew.fg;
        var attenuation = 1 - (densityToPlato(fg)/densityToPlato(og));
        var realExtract = (0.1808*densityToPlato(og)) + (0.8192*densityToPlato(fg));
        var abv = (((Math.abs(densityToPlato(og)-realExtract))/Math.abs(2.0666-(0.010665*densityToPlato(og)))/100)*fg)/0.79;
        abv *= 100;
        brew.abv = abv.toFixed(2);
        brew.attenuation = (attenuation * 100).toFixed(2);
    }

    $http.get(baseUrl).success(function(response) {
        $scope.recipe = response;
        $scope.grain_temperature = 20;
        $scope.updateAverageRating();
        if (typeof($scope.equip) != 'undefined') $scope.calculateWater();

        console.log(response);
        for (var i = 0; i < $scope.recipe.brews.length; i++) {
            console.log($scope.recipe.brews[i]);
            $scope.updateGravity($scope.recipe.brews[i], true);
        }
        $scope.$watch('equip', $scope.updateWater);
        $scope.$watch('equip', function(newValue, oldValue) {
            var diff = findDiff(newValue, oldValue);
            $scope.calculateWater();
            if (!$.isEmptyObject(diff)) {
                $http.put('/api/recipe/equipment/update/' + $scope.equip.id, diff)
                .success(function(response) {
                    console.log(response);
                })
                .error(function(response) {
                    console.log(response);
                });
            }
        }, true);

        $scope.$watchCollection('recipe', function(newValue, oldValue) {
            var diff = findDiff(newValue, oldValue);
            $scope.calculateWater();
            if (!$.isEmptyObject(diff)) {
                $http.put('/api/recipe/recipes/update/' + recipeId, diff)
                .success(function(response) {
                    console.log(response);
                })
                .error(function(response) {
                    console.log(response);
                });
            }
        });
    });

    var findDiff = function(edited, original){
        if (typeof(original) == 'undefined' || original.id != edited.id) return {};
        var diff = {}
        for(var key in original){
            if(original[key] !== edited[key])
                diff[key] = edited[key];
        }
        return diff;
    }

    $http.get('/api/recipe/equipment').success(function(response) {
        $scope.equipment = response.results;
        if ($scope.equipment.length > 0) $scope.equip = $scope.equipment[0];
        console.log($scope.equipment);
        if (typeof($scope.recipe) != 'undefined') $scope.calculateWater();
    })

}])
.controller('BrewController', function($scope, $http) {
    $scope.$watchCollection('brew', function(newValue, oldValue) {
        var diff = findDiff(newValue, oldValue);
        if (!$.isEmptyObject(diff)) {
            $scope.updateGravity($scope.brew, false);
            $http.put('/api/recipe/brews/update/' + oldValue.id, diff)
            .success(function(response) {
                console.log(response);
            })
            .error(function(response) {
                console.log(response);
            });
        }
    });

    var findDiff = function(edited, original){
        if (typeof(original) == 'undefined' || original.id != edited.id) return {};
        var diff = {}
        for(var key in original){
            if(original[key] !== edited[key])
                diff[key] = edited[key];
        }
        return diff;
    }
})
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
            rating: '=ngModel',
            maxRating: '@',
            readOnly: '=?',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&",
        },
        restrict: 'EA',
        template:
            '<ul class="star-rating" ng-class="{readonly: readOnly}">' +
            '   <li ng-repeat="idx in maxRatings track by $index" class="star" ' +
            'ng-class="{filled: !((hoverValue + rating) <= $index)}" ' +
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
				$scope.hoverValue = param - $scope.rating;
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

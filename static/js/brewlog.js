angular.module('BrewLog', ['ngMaterial']).controller('BrewLogController', ['$scope', '$http', function($scope, $http) {
//angular.module('BrewLog', ['ngMaterial']).controller('BrewLogController', ['$scope', function($scope) {

    /*
    $scope.batchSize = 19;
    $scope.grainBill = 6;
    $scope.boilTime = 60;
    $scope.trubLoss = 1.9;
    $scope.equipmentLoss = 0.4;
    $scope.mashThickness = 2.61;
    $scope.grainTemperature =  20;
    $scope.targetMashTemperature = 67;
    $scope.wortShrinkage = 4;
    $scope.grainAbsorption = 1.08;
    $scope.percentBoiloff = 7;
    $scope.evaporationFactor = 0.95;
    */

    /*
    $scope.malts = [
        {name: "Extra Pale", amount: 7},
    ]
    */


    $scope.hops  = [
        {name: "Ahtanum", amount: 17.5, add: 60},
        {name: "Chinook", amount: 15, add: 60},
        {name: "Crystal", amount: 17.5, add: 30},
        {name: "Chinook", amount: 17.5, add: 30},
        {name: "Ahtanum", amount: 17.5, add: 1},
        {name: "Chinook", amount: 27.5, add: 1},
        {name: "Crystal", amount: 17.5, add: 1},
        {name: "Motueka", amount: 17.5, add: 1},
    ]


    /*
    $scope.fermentationTime = 10;
    $scope.fermentationTemperature = 19;
    $scope.yeast = "WLP001 - California Ale";
    $scope.og = 1.070;
    $scope.fg = 1.012;
    $scope.mashTime = 60;
    $scope.spargeTime = 30;
    */

    /*
    $scope.logEntries = [
        {start: "14:52", end: "15:50", entry: "Varmet opp meskevann"},
        {start: "16:30", end: "17:10", entry: "Varmet opp skyllevann"},
        {start: "18:40", end: "19:15", entry: "Kokte opp vørter"},
    ]
    */

    /*
    $scope.comments = [
        {date: new Date(), comment: "Verandaen tok fyr når vi kværnet malt. Måtte ta en prat med brannvesenet."},
        {date: new Date(), comment: "Beef biltong turducken shankle turkey tongue landjaeger jerky ground round filet mignon. Corned beef doner strip steak shankle capicola. Fatback sirloin frankfurter, pork t-bone ribeye shankle swine meatball strip steak short loin. Sirloin tri-tip sausage swine andouille landjaeger corned beef."},
    ]
    */

    $scope.addLogEntry = function(entry) {
        var start = $scope.logEntryStart.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
        var end = $scope.logEntryEnd.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
        var entry = {start: start, end: end, entry: $scope.logEntryEntry};
        $scope.logEntries.push(entry);
        $scope.logEntryStart = "";
        $scope.logEntryEnd = "";
        $scope.logEntryEntry = "";
    }

    $scope.editedComments = {};
    $scope.editComment = function(comment) {
        $scope.editedComments[comment.date] = !$scope.editedComments[comment.date];
    }
    $scope.saveComment = function(comment) {
        var index = $scope.comments.indexOf(comment);
        var text = $("#" + comment.date).val();
        comment.comment = text;
        $scope.editComment(comment);
    }

    $scope.addMalt = function() {
        console.log("adding malt");
        $scope.malts.push({name: $scope.maltName, amount: $scope.maltAmount});
        $scope.maltName = "";
        $scope.maltAmount = "";
    }

    $scope.removeMalt = function(item) {
        console.log("removing malt");
        var index = $scope.malts.indexOf(item);
        $scope.malts.splice(index, 1);
    }

    $scope.addHop = function() {
        console.log("adding hop");
        $scope.hops.push({name: $scope.hopName, amount: $scope.hopAmount, add: $scope.hopAdd});
        $scope.hopName = "";
        $scope.hopAmount = "";
        $scope.hopAdd =  "";
    }

    $scope.removeHop = function(item) {
        console.log("removing hop");
        var index = $scope.hops.indexOf(item);
        $scope.hops.splice(index, 1);
    }

    $scope.updateYeast = function() {
        console.log("updating yeast");
    }

    $scope.updateFermentation = function() {
        console.log("updating fermentation");
    }

    $scope.updateMash = function() {
        console.log("updating mash");
    }

    $scope.deleteComment = function(comment) {
        console.log("deleting comment");
        var index = $scope.comments.indexOf(comment);
        $scope.comments.splice(index, 1);
    }

    $scope.addComment = function() {
        console.log("adding comment");
        $scope.comments.push({date: 2323, comment: $scope.newComment});
        $scope.newComment = "";
    }

    $scope.updateWater = function() {
        console.log("updating water");
        var preBoilWort = (($scope.entry.batch_size + $scope.entry.trub_loss)/0.96)/$scope.entry.evaporation_factor;
        var totalWater = preBoilWort + (Number($scope.entry.equipment_loss) + 1.2522 * $scope.entry.grain_bill);
        console.log(totalWater);
        var mashWater = 0.9475 * $scope.entry.mash_thickness * $scope.entry.grain_bill;
        console.log(mashWater);
        var spargeWater = totalWater - mashWater;
        console.log(spargeWater);
        var strikeTemperature = ((((($scope.entry.grain_bill/0.454)*0.05)+(mashWater/3.79))*$scope.entry.mash_temperature)-((($scope.entry.grain_bill/0.454)*0.05)*$scope.entry.grain_temperature))/(mashWater/3.79);
        console.log(strikeTemperature);
        var approximateMashVolume = $scope.entry.grain_bill * (0.67 + $scope.entry.mash_thickness);
        console.log(approximateMashVolume);
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

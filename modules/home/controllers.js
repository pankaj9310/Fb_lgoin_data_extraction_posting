'use strict';
 
angular.module('Home')
 
.controller('HomeController',
    ['$scope','$rootScope','facebookService',
    function ($scope,$rootScope,facebookService) {
        $scope.getName = function() {
            facebookService.getName()
                .then(function(response) {
                    $rootScope.name = response.name;
                });
        };
        $scope.getName();
        $scope.token = function() {
            facebookService.getAccessToken()
                .then(function(response) {
                    $rootScope.completeData = response;
                   console.log($rootScope)
                });

        };
        $scope.token();
    }]);
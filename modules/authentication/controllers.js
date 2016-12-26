'use strict';

angular.module('Authentication')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location','$window','facebookService','$q','$http','$timeout',
    function ($scope, $rootScope, $location,$window,facebookService,$q,$http,$timeout) {
        $scope.user = {};
        $scope.completeData = [];
        $scope.login = function () {
            $scope.dataLoading = true;
            $scope.getName();
            $scope.token();
        };
        $scope.getName = function() {
            facebookService.getName().then(function(response) {
                    $rootScope.name = response.name;
                });
        };

        $scope.token = function() {
            var url = 'me/accounts';
            var deferred = $q.defer();
            var result = [];
            var page_id='';
            $scope.flag = false;
            FB.api(url, function (response) {
                if (response && !response.error) {
                    var len = response.data.length;
                    for(var i=0;i<response.data.length;i++) {
                        page_id = response.data[i].id;
                        var page_url = '/' + page_id + '/?fields=id,name,access_token,emails,phone,single_line_address,overall_star_rating';
                        FB.api(page_url, function (response) {
                            if (response && !response.error) {
                                $scope.completeData.push(response);
                                $scope.$apply();
                            }
                        });
                    }
                }
            });

        };
        $scope.openModel = function () {
            $('#myModal').modal();
        }
        $scope.postMessage = null;
        $scope.pageToken = function (token) {
            $scope.currToken = token;
        }
        $scope.postCheck = {};
        $scope.postData  = function (data) {
            var data ={};
            data['access_token'] = $scope.currToken;
            data['message'] = $scope.postMessage;
            var postUrl = 'https://graph.facebook.com/feed';
            $http.post(postUrl, data).then(onSuccess, onError);
        }
        var onSuccess = function (response) {
            $scope.postCheck.success = true;
            $scope.postCheck.token = $scope.currToken;
            $timeout(function () {
                $scope.postCheck = {};
                $scope.postMessage = null;
                $scope.currToken = null;
            }, 3000)
        }
        var onError = function (response) {
            $scope.postCheck.error = true;
            $scope.postCheck.token = $scope.currToken;
            $timeout(function () {
                $scope.postCheck = {};
                $scope.postMessage = null;
                $scope.currToken = null;
            }, 3000)
        }
        //update page information
        $scope.openModel = function () {
            $('#update-info').modal();
        }
        $scope.postBio = null;
        $scope.postPhone =null;
        $scope.postEmail = null;
        $scope.postWebsite = null;
        $scope.postAddress = null;
        //noinspection JSAnnotator
        $scope.pageTokenId = function (token,id) {
            $scope.currId = id;
            $scope.currToken = token;
        }
        $scope.updateInfo  = function (data) {
            var data ={};
            data['access_token'] = $scope.currToken;
            data['bio'] = $scope.postBio;
            data['phone'] = $scope.postPhone;
            //data['emails'][0] = $scope.postEmail;
            data['website'] = $scope.postWebsite;
            //data['contact_address']={ 'country': 'IN','street1' :$scope.postAddress }
            console.log(data);
            var postUrl = 'https://graph.facebook.com/'+$scope.currId;
            console.log(postUrl);
            $http.post(postUrl, data).then(onSuccess, onError);
        }
    }]);
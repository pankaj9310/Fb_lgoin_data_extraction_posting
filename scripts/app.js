'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
 
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http','$window',
    function ($rootScope, $location, $cookieStore, $http,$window) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
        $rootScope.user = {};
        $window.fbAsyncInit = function() {
            FB.init({
                appId: 'Your app ID',
                status: true,
                cookie: true,
                xfbml: true,
                version: 'v2.8'
            });
        };
        (function(d){
            // load the Facebook javascript SDK

            var js,
                id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];

            if (d.getElementById(id)) {
                return;
            }

            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/sdk.js";

            ref.parentNode.insertBefore(js, ref);

        }(document));
        $rootScope.watchLoginChange = function() {

            var _self = this;

            FB.Event.subscribe('auth.authResponseChange', function(res) {

                if (res.status === 'connected') {

                    /*
                     The user is already logged,
                     is possible retrieve his personal info
                     */
                    _self.getUserInfo();

                    /*
                     This is also the point where you should create a
                     session for the current user.
                     For this purpose you can use the data inside the
                     res.authResponse object.
                     */

                }
                else {

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                     */

                }

            });

        }
    }])
.factory('facebookService', function($q) {
    function onError(error) {
        if( parseInt(error.status) >= 500) {
        }
        return error.data;
    }

    function onSuccess(response) {
        if(response==undefined || response.data==undefined || parseInt(response.status) >=500) {
        }
        else {
            return response.data;
        }
    }
    return {
        getName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'name',
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    console.log("get name");
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },
        getAccessToken: function() {
            var url = 'me/accounts'
            var deferred = $q.defer();
            var result = [];
            var page_id='';
            FB.api(url, function (response) {
                if (response && !response.error) {
                    for(var i=0;i<response.data.length;i++) {
                        page_id = response.data[i].id;
                        var page_url = '/' + page_id + '/?fields=name,access_token,emails,phone,single_line_address,overall_star_rating'
                        FB.api(page_url, function (response) {
                            if (response && !response.error) {
                                deferred.resolve(response);
                                result.push(response);
                                console.log(result);
                            }
                        });
                    }
                }
                return result;
            });

        },
        getLength: function() {
            var url = 'me/accounts'
            var deferred = $q.defer();
            var result = [];
            var page_id='';
            FB.api(url, function (response) {
                if (response && !response.error) {
                 console.log(response.data.length)
                 return response.data.length;
                }
                //}
            });
        }
    }
});

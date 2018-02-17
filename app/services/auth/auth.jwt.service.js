(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', '$localStorage', '$sessionStorage', '$q', 'API_URL'];

    function AuthServerProvider ($http, $localStorage, $sessionStorage, $q, API_URL) {

        var _token;

        var service = {
            getToken: getToken,
            login: login,
            loginAuto: loginAuto,
            loginWithToken: loginWithToken,
            storeAuthenticationToken: storeAuthenticationToken,
            logout: logout,
            setToken: setToken,
            getTokenHandle: getTokenHandle
        };

        return service;

        function getToken () {
            return $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        }

        function getTokenHandle () {
            console.log(_token)
            return _token;
        }

        function setToken (token) {
            _token = token;
        }

        function login (credentials) {

            console.log(credentials)

            var data = {
                msisdn: credentials.username,
                password: credentials.password,
                rememberMe: credentials.rememberMe
            };
            return $http.post(API_URL + 'api/auth/web-login', data).success(authenticateSuccess);

            function authenticateSuccess (data, status, headers) {
                //console.log(data);
                var jwt = data.id_token;
                service.storeAuthenticationToken(jwt, credentials.rememberMe);
                setToken(jwt);
                //console.log(jwt);
                return jwt;

                /*var bearerToken = headers('Authorization');
                if (angular.isDefined(bearerToken) && bearerToken.slice(0, 7) === 'Bearer ') {
                    var jwt = bearerToken.slice(7, bearerToken.length);
                    service.storeAuthenticationToken(jwt, credentials.rememberMe);
                    return jwt;
                }*/
            }
        }

        function loginAuto (credentials) {

            var data = {
                msisdn: credentials.username,
                password: credentials.password,
                rememberMe: credentials.rememberMe
            };
            return $http.post(API_URL + 'api/auth/wap-login', data).success(authenticateSuccess);

            function authenticateSuccess (data, status, headers) {
                //console.log(data);
                var jwt = data.id_token;
                service.storeAuthenticationToken(jwt, credentials.rememberMe);
                setToken(jwt);
                return jwt;

                /*var bearerToken = headers('Authorization');
                if (angular.isDefined(bearerToken) && bearerToken.slice(0, 7) === 'Bearer ') {
                    var jwt = bearerToken.slice(7, bearerToken.length);
                    service.storeAuthenticationToken(jwt, credentials.rememberMe);
                    return jwt;
                }*/
            }
        }

        function loginWithToken(jwt, rememberMe) {
            var deferred = $q.defer();

            if (angular.isDefined(jwt)) {
                this.storeAuthenticationToken(jwt, rememberMe);
                deferred.resolve(jwt);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        function storeAuthenticationToken(jwt, rememberMe) {
            if(rememberMe){
                $localStorage.authenticationToken = jwt;
            } else {
                $sessionStorage.authenticationToken = jwt;
            }
        }

        function logout () {
            delete $localStorage.authenticationToken;
            delete $sessionStorage.authenticationToken;
            _token = null;
            $state.go('home');
        }
    }
})();

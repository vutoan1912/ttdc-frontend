(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .factory('Account', Account);

    Account.$inject = ['$resource','API_URL','$localStorage','$sessionStorage','AuthServerProvider', '$http'];

    function Account ($resource, API_URL, $localStorage, $sessionStorage, AuthServerProvider, $http) {

        /*
        //console.log('Account service')

        //get token from $localStorage
        var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;

        //fake token
        //var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUyMDY1Mjc5Mywic2NvcGUiOlsiUk9MRV9BRE1JTiJdfQ.NDbQVNKQ3Wkm5BYfHNDMEiQ1HjN2UTlJYosJ5boRzz3G1uWXO6xTN2GtUYlApo623zs-bLRv5AG4n76Hi0whjA";

        //get token from
        //var token = AuthServerProvider.getTokenHandle();

        //console.log(token);

        var service = $resource(API_URL + 'api/users/get-current-user-login', {}, {
            'get': { method: 'GET', params: {},
                headers: { 'Authorization': 'Bearer ' + token },
                isArray: false,
                interceptor: {
                    response: function(res) {
                        console.log(res)
                        return res;
                    }
                }
            }
        });
        return service;
        */

        var service = {
            getAccount: getAccount
        };

        return service;

        function getAccount () {

            //get token from $localStorage
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            //console.log(token);

            var req = {
                method: 'GET',
                url: API_URL + 'api/users/get-current-user-login',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(data){
                //console.log(data);
                return data;
            }, function(error){
                //console.log(error)
                return error;
            });
        }
    }
})();

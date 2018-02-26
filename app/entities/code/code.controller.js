(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('CodeController', CodeController);


    CodeController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function CodeController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        var vm = this;

        /*$scope.isAuthenticated = Principal.isAuthenticated();
        getAccount();

        function getAccount() {
            Principal.getAccountInfo().then(function(account) {
                console.log(account);
                $scope.account = account;
            });
        }*/

        function getCodes(msisdn, page, size) {

            var url = "";
            /*if(){
                url = API_URL + 'api/code-prizes/search?query=msisdn=="841663799822"'
            }*/

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + ''
                },
                data: {}
            }

            return $http(req).then(function(response){

                return response.data;
            }, function(error){
                console.log(error)

                return error;
            });
        }

    }
})();

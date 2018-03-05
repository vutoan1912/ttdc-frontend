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

        vm.codes = [];

        vm.getCodes = getCodes;
        $scope.searchMsisdn = null;
        $scope.totalCount = 0;

        //get token from $localStorage
        var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;

        vm.getCodes("",0,500);

        function getCodes(msisdn, page, size) {

            var url = "";
            if(msisdn.length > 0)
                url = API_URL + 'api/code-prizes/search?query=msisdn=="'+msisdn+'"&page='+page+'&size='+size;
            else
                url = API_URL + 'api/code-prizes/search?query=&page='+page+'&size='+size;
            //http://localhost:9092/api/code-prizes/search?query=msisdn=="841663799822"&page=1&size=5
            //http://localhost:9092/api/code-prizes/search?query=&page=1&size=5

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                console.log(response)
                vm.codes = response.data;

                //$scope.totalCount = parseInt( response.headers()["X-Total-Count"], 10 ) ;
                //$scope.totalCount = response.headers("X-Total-Count");
                //console.log($scope.totalCount);

                return response;
            }, function(error){
                console.log(error)

                return error;
            });
        }

    }
})();

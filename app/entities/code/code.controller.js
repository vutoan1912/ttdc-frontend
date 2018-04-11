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
        $scope.total = 0;
        $scope.size = 10;
        $scope.page = 1;

        //get token from $localStorage
        var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;

        vm.getCodes($scope.page,$scope.size);

        $scope.pageChanged = function () {
            vm.getCodes($scope.page,$scope.size);
        };

        function getCodes(page, size) {
            if(page==0) $scope.page = 1;
            if(page>0) page--;
            if($localStorage.msisdn != null && $localStorage.msisdn.length > 0){
                var url = API_URL + 'api/code-prizes/searchCMS?query=msisdn=="'+$localStorage.msisdn+'"&page='+page+'&size='+size+'&sort=id,desc';
                //else
                //    url = API_URL + 'api/code-prizes/searchCMS?query=&page='+page+'&size='+size+'&sort=id,desc';

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
                    vm.codes = response.data.data;
                    $scope.total = response.data.total;

                    return response;
                }, function(error){
                    console.log(error)

                    return error;
                });
            }
        }
    }
})();

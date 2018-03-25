(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('PrizeController', PrizeController);


    PrizeController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function PrizeController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
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
            var url = "";
            if($scope.searchMsisdn != null && $scope.searchMsisdn.length > 0)
                url = API_URL + 'api/user-prize/searchCMS?query=msisdn=="'+$scope.searchMsisdn+'";prizeId=in=(3,4,5,6)&page='+page+'&size='+size+'&sort=id,desc';
            else
                url = API_URL + 'api/user-prize/searchCMS?query=prizeId=in=(3,4,5,6)&page='+page+'&size='+size+'&sort=id,desc';
            //http://localhost:9092/api/code-prizes/searchCMS?query=msisdn=="841663799822"&page=1&size=5
            //http://localhost:9092/api/code-prizes/searchCMS?query=&page=1&size=5

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                //console.log(response)
                angular.forEach(response.data.data, function (code) {
                    code.msisdn = hideMsisdn(code.msisdn);
                });
                vm.codes = response.data.data;
                $scope.total = response.data.total;

                return response;
            }, function(error){
                console.log(error)

                return error;
            });
        }

        function hideMsisdn(msisdn) {
            if(angular.isDefined(msisdn) && msisdn.length > 3)
            {
                msisdn = msisdn.substring(0, msisdn.length - 3) + 'xxx';
                return msisdn;
            }
            return null;
        }

    }
})();

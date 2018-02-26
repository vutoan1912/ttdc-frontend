(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('AccountController', AccountController);


    AccountController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function AccountController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        var vm = this;
        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                //console.log(account);
                $scope.account = account;
                vm.isAuthenticated = Principal.isAuthenticated();
            });
        }

        //get token from $localStorage
        var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        console.log(token);
    }
})();

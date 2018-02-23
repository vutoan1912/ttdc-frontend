(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('PrepareController', PrepareController);


    PrepareController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function PrepareController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        var vm = this;
        vm.goPlay = goPlay;

        function getAccount() {
            Principal.identity().then(function(account) {
                console.log(account);
                $scope.account = account;
                vm.isAuthenticated = Principal.isAuthenticated();
            });
        }

        getAccount();

        function goPlay() {
            $state.go('play');
        }
    }

})();

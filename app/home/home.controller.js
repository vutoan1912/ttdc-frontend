(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', '$state'];

    function HomeController ($scope, Principal, $state) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.popupShow = false;

        vm.popupShowHide = popupShowHide;

        function popupShowHide() {
            vm.popupShow = !vm.popupShow;
        }

        // $scope.$on('authenticationSuccess', function() {
        //     getAccount();
        // });
        //
        // console.log('welcome home')
        // getAccount();
        //
        // function getAccount() {
        //
        //     Principal.identity().then(function(account) {
        //         vm.account = account;
        //         vm.isAuthenticated = Principal.isAuthenticated;
        //
        //         console.log(account);
        //     });
        // }
    }
})();

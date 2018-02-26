(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('PrepareController', PrepareController);


    PrepareController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function PrepareController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        var vm = this;

        vm.popupShow = false;
        vm.popupContent = null;
        vm.popupBtn = false;
        vm.btnCancel = "Hủy";
        vm.btnConfirm = "Đồng ý";
        vm.errorKey = null;

        vm.goPlay = goPlay;
        vm.popupShowHide = popupShowHide;
        vm.clickCancel = clickCancel;

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

        function popupShowHide() {
            vm.popupShow = !vm.popupShow;
        }

        function clickCancel() {
            vm.popupShow = false;
            $('.card'+vm.index).toggleClass('flipped');
        }
    }

})();

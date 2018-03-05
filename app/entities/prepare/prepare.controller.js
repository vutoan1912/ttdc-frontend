(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('PrepareController', PrepareController);


    PrepareController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http', '$state'];

    function PrepareController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http, $state) {
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

        vm.goHome = goHome;

        function goHome() {
            $state.go("default");
        }

        function getAccount() {
            Principal.getAccountInfo().then(function(account) {
                console.log(account);
                $scope.account = account;
                vm.isAuthenticated = Principal.isAuthenticated();
            });
        }

        getAccount();

        function goPlay() {
            if($scope.account != null)
                $state.go('play');
            else
                popupShowHide();
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

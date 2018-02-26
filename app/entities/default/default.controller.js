(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('DefaultController', DefaultController);

    DefaultController.$inject = ['$scope', 'Principal', '$state'];

    function DefaultController ($scope, Principal, $state) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.popupShow = false;

        vm.popupShowHide = popupShowHide;

        function popupShowHide() {
            vm.popupShow = !vm.popupShow;
        }
    }
})();

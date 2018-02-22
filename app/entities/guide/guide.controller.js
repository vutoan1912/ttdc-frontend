(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('GuideController', GuideController);


    GuideController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function GuideController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        //var vm = this;
    }
})();

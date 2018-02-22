(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('RuleController', RuleController);


    RuleController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function RuleController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        //var vm = this;
    }
})();

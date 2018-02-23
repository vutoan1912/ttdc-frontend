(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('TypeDemoController', TypeDemoController);


    TypeDemoController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function TypeDemoController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        //var vm = this;
    }
})();

(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('PresentController', PresentController);


    PresentController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function PresentController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        //var vm = this;
    }
})();

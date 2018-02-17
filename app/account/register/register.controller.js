(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('RegisterController', RegisterController);


    RegisterController.$inject = ['$translate', '$timeout', 'Auth', 'LoginService', 'errorConstants'];

    function RegisterController ($translate, $timeout, Auth, LoginService, errorConstants) {
        var vm = this;

    }
})();

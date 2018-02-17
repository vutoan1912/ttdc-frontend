(function () {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .factory('Register', Register);

    Register.$inject = ['$resource'];

    function Register ($resource) {
        return $resource('api/register', {}, {});
    }
})();

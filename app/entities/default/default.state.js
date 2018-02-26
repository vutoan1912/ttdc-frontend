(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('default', {
            parent: 'app',
            url: '/default',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/default/default.html',
                    controller: 'DefaultController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();

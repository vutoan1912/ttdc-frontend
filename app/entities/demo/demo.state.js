(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('demo', {
                parent: 'app',
                url: '/demo?type',
                data: {
                    authorities: [],
                    pageTitle: 'Săn kim cương'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/demo/demo.html',
                        controller: 'DemoController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('type-demo', {
                parent: 'app',
                url: '/type-demo',
                data: {
                    authorities: [],
                    pageTitle: 'Săn kim cương'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/demo/type-demo.html',
                        controller: 'TypeDemoController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();

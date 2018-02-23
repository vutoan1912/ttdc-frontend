(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('prepare', {
            parent: 'app',
            url: '/prepare',
            data: {
                authorities: [],
                pageTitle: 'Săn kim cương'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/prepare/prepare.html',
                    controller: 'PrepareController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('prepare');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

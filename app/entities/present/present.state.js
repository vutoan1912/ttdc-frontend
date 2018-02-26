(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('present', {
            parent: 'app',
            url: '/present',
            data: {
                authorities: [],
                pageTitle: 'Giới thiệu'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/present/present.html',
                    controller: 'PresentController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('present');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

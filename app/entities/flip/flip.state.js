(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('flip', {
            parent: 'app',
            url: '/flip',
            data: {
                authorities: [],
                pageTitle: 'Lật bài may mắn'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/flip/flip.html',
                    controller: 'FlipController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('flip');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

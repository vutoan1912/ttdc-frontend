(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('play', {
            parent: 'app',
            url: '/play',
            data: {
                authorities: [],
                pageTitle: 'Săn kim cương'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/play/play.html',
                    controller: 'PlayController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('play');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

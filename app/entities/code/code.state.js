(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('code', {
            parent: 'app',
            url: '/code',
            data: {
                authorities: [],
                pageTitle: 'Lật bài may mắn'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/code/code.html',
                    controller: 'CodeController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('code');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

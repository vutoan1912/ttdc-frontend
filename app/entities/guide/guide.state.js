(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('guide', {
            parent: 'app',
            url: '/guide',
            data: {
                authorities: [],
                pageTitle: 'Lật bài may mắn'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/guide/guide.html',
                    controller: 'GuideController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('guide');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

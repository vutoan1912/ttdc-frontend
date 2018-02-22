(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('rule', {
            parent: 'app',
            url: '/rule',
            data: {
                authorities: [],
                pageTitle: 'Lật bài may mắn'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/rule/rule.html',
                    controller: 'RuleController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('rule');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

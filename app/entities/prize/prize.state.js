(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('prize', {
            parent: 'app',
            url: '/prize',
            data: {
                authorities: [],
                pageTitle: 'Khách hàng trúng thưởng'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/prize/prize.html',
                    controller: 'PrizeController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('prize');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

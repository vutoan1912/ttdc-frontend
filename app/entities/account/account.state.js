(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('account', {
            parent: 'app',
            url: '/account',
            data: {
                authorities: [],
                pageTitle: 'Thông tin cá nhân'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/account/account.html',
                    controller: 'AccountController',
                    controllerAs: 'vm'
                }
            }/*,
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('account');
                    return $translate.refresh();
                }]
            }*/
        });
    }
})();

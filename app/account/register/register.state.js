(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('register', {
                parent: 'app',
                url: '/register',
                data: {
                    authorities: [],
                    pageTitle: 'register.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/register/register.html',
                        controller: 'RegisterController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('register');
                        return $translate.refresh();
                    }]
                }
            })
            .state('register_backlink', {
                parent: 'app',
                url: '/register_backlink',
                data: {
                    authorities: [],
                    pageTitle: 'register'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/register/register_backlink.html',
                        controller: 'RegisterBackLinkController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('register-xn', {
                parent: 'app',
                url: '/register-xn',
                data: {
                    authorities: [],
                    pageTitle: 'Register XN'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/register/register_xn.img.html'
                        //controller: 'RegisterXNController',
                        //controllerAs: 'vm'
                    }
                }
            });

    }
})();

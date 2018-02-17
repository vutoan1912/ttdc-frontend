(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('LoginController', LoginController);

    // LoginController.$inject = ['$rootScope', '$state', '$timeout', 'Auth', '$uibModalInstance'];
    LoginController.$inject = ['$rootScope', '$state', '$timeout', 'Auth'];

    // function LoginController ($rootScope, $state, $timeout, Auth, $uibModalInstance) {
    function LoginController ($rootScope, $state, $timeout, Auth) {
        var vm = this;

        vm.authenticationError = false;
        //vm.cancel = cancel;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.register = register;
        vm.rememberMe = true;
        vm.requestResetPassword = requestResetPassword;
        vm.username = null;

        $timeout(function (){angular.element('#username').focus();});

        /*function cancel () {
            vm.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            vm.authenticationError = false;
            $uibModalInstance.dismiss('cancel');
        }*/

        function login (event) {
            //console.log('login')
            event.preventDefault();
            Auth.login({
                username: vm.username,
                password: vm.password,
                rememberMe: vm.rememberMe
            }).then(function () {
                vm.authenticationError = false;
                //$uibModalInstance.close();
                if ($state.current.name === 'register' || $state.current.name === 'login' ||
                    $state.current.name === 'finishReset' || $state.current.name === 'requestReset') {
                    $state.go('home');
                }

                $rootScope.$broadcast('authenticationSuccess');

                // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // since login is successful, go to stored previousState and clear previousState
                if (Auth.getPreviousState()) {
                    var previousState = Auth.getPreviousState();
                    Auth.resetPreviousState();
                    $state.go(previousState.name, previousState.params);
                }
            }).catch(function () {
                vm.authenticationError = true;
            });
        }

        /*function register () {
            $uibModalInstance.dismiss('cancel');
            $state.go('register');
        }*/

        function register() {
            if(angular.isDefined($rootScope.msisdn) && $rootScope.msisdn != null){
                //Đăng ký wap
                //console.log('register wap')

            }else{
                //Đăng ký web
                //console.log('register web')
                $state.go('register');
            }
        }

        function requestResetPassword () {
            //$uibModalInstance.dismiss('cancel');
            //$state.go('requestReset');
        }
    }
})();

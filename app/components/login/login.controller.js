(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('LoginController', LoginController);

    // LoginController.$inject = ['$rootScope', '$state', '$timeout', 'Auth', '$uibModalInstance'];
    LoginController.$inject = ['$rootScope', '$state', '$timeout', 'Auth', '$sessionStorage'];

    // function LoginController ($rootScope, $state, $timeout, Auth, $uibModalInstance) {
    function LoginController ($rootScope, $state, $timeout, Auth, $sessionStorage) {
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
            if(vm.username.substring(0,1) == "0"){
                vm.username = "84" + vm.username.substring(1,vm.username.length);
            }
            //console.log(vm.username)

            event.preventDefault();
            Auth.login({
                username: vm.username,
                password: vm.password,
                rememberMe: vm.rememberMe
            }).then(function (response) {
                console.log(response)
                vm.authenticationError = false;
                //$uibModalInstance.close();

                $sessionStorage.msisdn = vm.username;

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
            }).catch(function (error) {
                console.log(error)
                vm.authenticationError = true;
            });
        }

        /*function register () {
            $uibModalInstance.dismiss('cancel');
            $state.go('register');
        }*/

        function register() {
            if(angular.isDefined($sessionStorage.msisdn) && $sessionStorage.msisdn != null){
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

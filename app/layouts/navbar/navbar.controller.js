(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'Auth', 'Principal', '$window', '$rootScope', 'AuthServerProvider', '$scope', 'WEB_SERVER', 'API_URL', '$http', '$sessionStorage'];

    function NavbarController ($state, Auth, Principal, $window, $rootScope, AuthServerProvider, $scope, WEB_SERVER, API_URL, $http, $sessionStorage) {
        var vm = this;

        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = false;
        vm.isHome = false;

        function getAccount() {
            Principal.getAccountInfo().then(function(account) {
                //console.log(account);
                $scope.account = account;
                vm.isAuthenticated = Principal.isAuthenticated();
                console.log(vm.isAuthenticated)
            });
        }

        $rootScope.$watch('root_authenticate', function () {
            getAccount();
            getMsisdn();
        })

        /*$rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            console.log('$rootScope $stateChangeSuccess')
        });*/

        $scope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            //console.log('$scope $stateChangeSuccess')
            //reject
            if(!$rootScope.root_authenticate){
                if ($state.current.name === 'play'
                    || $state.current.name === 'flip'
                    || $state.current.name === 'prepare') {
                    $state.go('home');
                }
            }

            //show bannner
            if ($state.current.name === 'home') vm.isHome = true; else vm.isHome = false;
        });

        vm.login = login;
        vm.logout = logout;
        vm.register = register;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.goHome = goHome;
        vm.$state = $state;

        function login() {
            collapseNavbar();
            //LoginService.open();
            $state.go('login');
        }

        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('home');
        }

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }

        function goHome() {
            $state.go('home');
        }

        //MSISDN
        console.log($sessionStorage.msisdn);
        function getMsisdn() {

            //$rootScope
            if(angular.isUndefined($sessionStorage.msisdn)){
                var response = JSON.parse(httpGet('api.php').toLowerCase());
                //console.log(response)
                var data = response.data;
                //console.log(data)

                //fake msisdn
                //data.msisdn = 'admin';
                //data.msisdn = 'guest';

                if(data.msisdn !== undefined && data.msisdn != null)
                    $sessionStorage.msisdn = data.msisdn;
                else
                    $sessionStorage.msisdn = null;

                $scope.msisdn = $sessionStorage.msisdn;
                console.log($sessionStorage.msisdn)

                if(angular.isDefined($sessionStorage.msisdn) && $sessionStorage.msisdn != null){
                    //check sub
                    var credentials = {
                        username: $sessionStorage.msisdn,
                        password: null,
                        rememberMe: true
                    }
                    AuthServerProvider.loginAuto(credentials).then(function (response) {
                        //console.log(response.data.id_token);
                        //console.log($localStorage.authenticationToken);
                        getAccount();
                        $state.go('home');
                    })
                }
            }else{
                console.log('gán msisdn')
                $scope.msisdn = $sessionStorage.msisdn;
            }
        }

        function httpGet(theUrl)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
            xmlHttp.send( null );
            return xmlHttp.responseText;
        }

        getMsisdn();

        function register() {
            if(angular.isDefined($sessionStorage.msisdn) && $sessionStorage.msisdn != null){
                //Đăng ký wap
                //console.log('register wap')

                var req = {
                    method: 'POST',
                    url: API_URL + 'api/payment/generateTransaction',
                    /*headers: {
                        'Authorization': 'Bearer ' + token
                    },*/
                    data: {
                        "msisdn" : $sessionStorage.msisdn
                    }
                }

                return $http(req).then(function(response){
                    console.log(response)

                    //Fake MO đăng ký
                    var req = {
                        method: 'POST',
                        url: API_URL + 'api/payment/registerSub',
                        /*headers: {
                            'Authorization': 'Bearer ' + token
                        },*/
                        data: {
                            "msisdn" : $sessionStorage.msisdn
                        }
                    }

                    return $http(req).then(function(response){
                        console.log(response)

                        //Chuỗi mã hóa  = trans_id&pkg&free_circle&price&&circle& customer_care& price_customer_care&back_url
                        //http://dangky.mobifone.com.vn/wap/html/sp/confirm.jsp?sp_id={sp_id}&link={chuỗi mã hóa}
                        var stringEncode = "1&DC&0&6000&1&19001009&1000&" + WEB_SERVER + "register_backlink";
                        stringEncode = stringEncode.replace("&#","##");
                        var key = "gV84mUOVwdN2XIgc";
                        var cipherText = CryptoJS.AES.encrypt(stringEncode, key).toString();
                        console.log(cipherText)
                        $window.location.href = 'http://dangky.mobifone.com.vn/wap/html/sp/confirm.jsp?sp_id=207&link='+cipherText;

                    }, function(error){
                        console.log(error)

                    });

                }, function(error){
                    console.log(error)

                });

            }else{
                //Đăng ký web
                //console.log('register web')
                $state.go('register');
            }
        }
    }
})();

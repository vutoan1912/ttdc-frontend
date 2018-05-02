(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'Auth', 'Principal', '$window', '$rootScope', 'AuthServerProvider', '$scope', 'WEB_SERVER', 'API_URL', '$http', '$sessionStorage', '$localStorage'];

    function NavbarController ($state, Auth, Principal, $window, $rootScope, AuthServerProvider, $scope, WEB_SERVER, API_URL, $http, $sessionStorage, $localStorage) {
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
            //Auth.logout();
            getMsisdn();
            getAccount();
        })

        /*$rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            console.log('$rootScope $stateChangeSuccess')
        });*/

        $scope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {

            //if ($state.current.name === 'play' || $state.current.name === 'flip') {
                getMsisdn();
                //getAccount();
            //}

            //console.log('$scope $stateChangeSuccess')
            //reject
            if(!$rootScope.root_authenticate){
                if ($state.current.name === 'play' || $state.current.name === 'account') {
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
            $state.go('default');
        }

        //MSISDN
        console.log($localStorage.msisdn);
        function getMsisdn() {

            var response = JSON.parse(httpGet('api.php').toLowerCase());//console.log(response)
            var data = response.data;

            //fake msisdn
            //data.msisdn = 'admin';
            //data.msisdn = 'guest';

            if($localStorage.msisdn != data.msisdn && $localStorage.sourceLogin == true){
                delete $localStorage.authenticationToken;
                delete $sessionStorage.authenticationToken;
            }

            if(data.msisdn !== undefined && data.msisdn != null){
                $localStorage.sourceLogin = true;
                $localStorage.msisdn = data.msisdn;
            }else{
                if($localStorage.sourceLogin == true){
                    $localStorage.msisdn = null;
                }
            }

            $scope.msisdn = $localStorage.msisdn;
            //console.log($scope.msisdn)

            if(angular.isUndefined($localStorage.sourceLogin) || $localStorage.sourceLogin == null || $localStorage.sourceLogin == true){
                $localStorage.sourceLogin = true;
                if(angular.isDefined($localStorage.msisdn) && $localStorage.msisdn != null) {
                    //check sub
                    var credentials = {
                        username: $localStorage.msisdn,
                        password: null,
                        rememberMe: true
                    }
                    AuthServerProvider.loginAuto(credentials).then(function (response) {
                        //console.log(response.data.id_token);
                        //console.log($localStorage.authenticationToken);
                        getAccount();
                        //$state.go('home');
                    })
                }
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
            if(angular.isDefined($localStorage.msisdn) && $localStorage.msisdn != null){
                //Đăng ký wap
                //console.log('register wap')

                //Chuỗi mã hóa  = trans_id&pkg&free_circle&price&&circle& customer_care& price_customer_care&back_url
                //http://dangky.mobifone.com.vn/wap/html/sp/confirm.jsp?sp_id={sp_id}&link={chuỗi mã hóa}
                //var key = "gV84mUOVwdN2XIgc";

                var plaintext = "&DC&0&6000&1&19001009&1000&" + WEB_SERVER + "register_backlink";

                var req = {
                    method: 'POST',
                    url: API_URL + 'api/payment/generateTransaction',
                    data: {
                        "msisdn": $localStorage.msisdn,
                        "url": plaintext
                    }
                }

                return $http(req).then(function(response){
                    console.log(response.data.url)
                    //redirect
                    $window.location.href = 'http://dangky.mobifone.vn/wap/html/sp/confirm.jsp?sp_id=207&link='+response.data.url;

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
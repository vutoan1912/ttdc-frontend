(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService', '$rootScope', 'AuthServerProvider', '$scope'];

    function NavbarController ($state, Auth, Principal, ProfileService, LoginService, $rootScope, AuthServerProvider, $scope) {
        var vm = this;

        vm.isNavbarCollapsed = true;

        function getAccount() {
            Principal.identity().then(function(account) {
                console.log(account);
                $scope.account = account;
                vm.isAuthenticated = Principal.isAuthenticated();
            });
        }

        getAccount();

        //reject
        if(!$scope.isAuthenticated){
            if ($state.current.name === 'play'
                || $state.current.name === 'flip'
                || $state.current.name === 'prepare') {
                $state.go('home');
            }
        }

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

        //console.log($rootScope.msisdn);

        function getMsisdn() {
            //$rootScope
            if(angular.isUndefined($rootScope.msisdn) && !$scope.isAuthenticated){
                var header = getHeaders();
                //console.log(header);

                //get msisdn -> $rootScope.msisdn
                //if not exists MSISDN -> null
                //if(angular.isDefined(header.msisdn)) $rootScope.msisdn = header.msisdn;
                //else $rootScope.msisdn = null;

                //fake msisdn
                //$rootScope.msisdn = 'admin';

                console.log($rootScope.msisdn)

                if(angular.isDefined($rootScope.msisdn) && $rootScope.msisdn != null){
                    //check sub
                    var credentials = {
                        username: $rootScope.msisdn,
                        password: null,
                        rememberMe: true
                    }
                    AuthServerProvider.loginAuto(credentials).then(function (response) {
                        console.log(response.data.id_token);
                        $state.go('home');
                    })
                }
            }
        }

        function getHeaders() {
            var req = new XMLHttpRequest();
            req.open('GET', document.location, false);
            req.send(null);

            // associate array to store all values
            var data = new Object();

            // get all headers in one call and parse each item
            var headers = req.getAllResponseHeaders().toLowerCase();
            var aHeaders = headers.split('\n')
            var i =0;
            for (i= 0; i < aHeaders.length; i++) {
                var thisItem = aHeaders[i];
                var key = thisItem.substring(0, thisItem.indexOf(':'));
                var value = thisItem.substring(thisItem.indexOf(':')+1);
                data[key] = value;
            }

            // get referer
            var referer = document.referrer;
            data["Referer"] = referer;

            // get useragent
            var useragent = navigator.userAgent;
            data["UserAgent"] = useragent;


            //extra code to display the values in html
            /*var display = "";
            for(var key in data) {
                if (key != "") display += "<b>" + key + "</b> : " + data[key] + "<br>";
            }
            document.getElementById("dump").innerHTML =  display;*/

            return data;
        }

        getMsisdn();

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

        function goHome() {
            $state.go('home');
        }
    }
})();

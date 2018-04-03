(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('RegisterXNController', RegisterXNController);


    RegisterXNController.$inject = ['$timeout','errorConstants','$state','$sessionStorage','$localStorage', 'API_URL', '$http','$window'];

    function RegisterXNController ($timeout, errorConstants, $state, $sessionStorage,$localStorage, API_URL, $http, $window) {
        var vm = this;
        //console.log('register back link')

        vm.getParameterByName = getParameterByName;

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        //get link url
        // var link = getParameterByName('link');
        //
        // var r = /\\u([\d\w]{4})/gi;
        // link = link.replace(r, function (match, grp) {return String.fromCharCode(parseInt(grp, 16)); } );
        // link = unescape(link);
        // console.log(link);




        //Check msisdn
        var response = JSON.parse(httpGet('api.php').toLowerCase());
        var data = response.data;
        //console.log(data["user-agent"]);

        if(angular.isDefined(iOSversion())){
            var ios = iOSversion();
            if(ios[0]>=8){
                vm.sms = "sms:9637&body=XN";
            }else{
                vm.sms = "sms:9637;body=XN";
            }
        }else if(getAndroidVersion(data["user-agent"])){
            vm.sms = "sms:9637?body=XN";
        }else if(data["user-agent"].match(/Windows Phone/i)){

        }else{
            vm.sms = "sms:9637&body=XN";
        }

        var href = vm.sms;
        document.getElementById("sms_link").setAttribute('href', href);

        //$window.open('sms:9637&body=XN','_self');


        if(data.msisdn !== undefined && data.msisdn != null){
            // register();
        }else{
            // $state.go("type-demo");
        }

        function register() {
            //Fake MO đăng ký
            var req = {
                method: 'POST',
                url: API_URL + 'api/payment/fakeMoWap'
            };

            return $http(req).then(function(res){
                console.log(res);

                //open app SMS


                $state.go('home');
            }, function(error){
                console.log(error);
                $state.go('home');
            });
        }

        function httpGet(theUrl) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
            xmlHttp.send( null );
            return xmlHttp.responseText;
        }

        function iOSversion() {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            }
        }

        function getAndroidVersion(ua) {
            ua = (ua || navigator.userAgent).toLowerCase();
            var match = ua.match(/android\s([0-9\.]*)/);
            return match ? match[1] : false;
        };

        //getAndroidVersion(); //"4.2.1"
        //parseInt(getAndroidVersion(), 10); //4
        //parseFloat(getAndroidVersion()); //4.2
    }
})();

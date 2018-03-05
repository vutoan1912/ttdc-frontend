(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('RegisterBackLinkController', RegisterBackLinkController);


    RegisterBackLinkController.$inject = ['$timeout','errorConstants','$state','$sessionStorage', 'API_URL', '$http'];

    function RegisterBackLinkController ($timeout, errorConstants, $state, $sessionStorage, API_URL, $http) {
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

        // var link = getParameterByName('link');
        //
        // var r = /\\u([\d\w]{4})/gi;
        // link = link.replace(r, function (match, grp) {return String.fromCharCode(parseInt(grp, 16)); } );
        // link = unescape(link);
        // console.log(link);
        //
        // if(link != null){
        //     var req = {
        //         method: 'POST',
        //         url: API_URL + 'api/payment/decryptTransaction',
        //         /*headers: {
        //             'Authorization': 'Bearer ' + token
        //         },*/
        //         data: {
        //             "msisdn": $localStorage.msisdn,
        //             "url": link
        //         }
        //     }
        //
        //     return $http(req).then(function(response){
        //         //console.log(response)
        //         var plaintext = response.data.url.replace('\u0026','&');
        //         console.log(plaintext)
        //         var result = plaintext.split("&")[2];
        //         if(result == 1){
        //             var msisdn = plaintext.split("&")[1];
        //             console.log(msisdn)
        //             register(msisdn);
        //         }else{
        //             //console.log(result);
        //             $state.go('home');
        //         }
        //     }, function(error){
        //         console.log(error);
        //         $state.go('home');
        //     });
        //
        // }else{
        //     console.log("Không có thông tin trả về")
        //     $state.go('home');
        // }

        $state.go('home');

        function register(msisdn) {
            //Fake MO đăng ký
            var req = {
                method: 'POST',
                url: API_URL + 'api/payment/registerSub',
                /*headers: {
                    'Authorization': 'Bearer ' + token
                },*/
                data: msisdn
            }

            return $http(req).then(function(res){
                console.log(res)
                $state.go('home');
            }, function(error){
                console.log(error)
                $state.go('home');
            });
        }
    }
})();

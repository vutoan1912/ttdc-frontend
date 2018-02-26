(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('RegisterBackLinkController', RegisterBackLinkController);


    RegisterBackLinkController.$inject = ['$timeout','errorConstants','$state'];

    function RegisterBackLinkController ($timeout, errorConstants, $state) {
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

        var link = getParameterByName('link');
        console.log(link)

        if(link != null){
            link = link.replace(" ","+");

            var key = "gV84mUOVwdN2XIgc";
            var plaintext  = CryptoJS.AES.decrypt(link, key);
            console.log(plaintext.toString())
            console.log(hex2a(plaintext.toString()))

            //document.getElementById("dump_decrypt").innerHTML = 'decrypt: ' + hex2a(plaintext.toString());

            register(msisdn);

        }else{
            console.log("Không có thông tin trả về")
            //$state.go('home')
        }

        function register(msisdn) {
            var req = {
                method: 'POST',
                url: API_URL + 'api/payment/registerSub',
                headers: {
                    'Authorization': 'Bearer '
                },
                data: {
                    "msisdn": msisdn
                }
            }

            return $http(req).then(function(response){
                console.log(response)


                //$state.go('home')

            }, function(error){
                console.log(error)
                //$state.go('home')
            });
        }

        function hex2a(hexx) {
            var hex = hexx.toString();//force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        }
    }
})();

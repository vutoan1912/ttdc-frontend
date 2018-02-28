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

            //solution 1
            //var plaintext  = CryptoJS.AES.decrypt(link, key);
            //console.log(plaintext.toString())
            //console.log(hex2a(plaintext.toString()))

            //solution 2
            var plaintext = Aes.Ctr.decrypt(link, key, 128);
            console.log(plaintext)

            //document.getElementById("dump_decrypt").innerHTML = 'decrypt: ' + hex2a(plaintext.toString());

            var result = plaintext.split("&")[2];
            if(result == 1){
                var msisdn = plaintext.split("&")[1];
                console.log(msisdn)
                //register(msisdn);
            }else{
                console.log(result)
            }

        }else{
            console.log("Không có thông tin trả về")
            //$state.go('home')
        }

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

            }, function(error){
                console.log(error)

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

(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('FlipController', FlipController);


    FlipController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http'];

    function FlipController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http) {
        var vm = this;

        $scope.isAuthenticated = Principal.isAuthenticated();
        getAccount();

        function getAccount() {
            Principal.getAccountInfo().then(function(account) {
                console.log(account);
                $scope.account = account;
            });
        }

        //fake sub
        //$scope.isAuthenticated = true;

        //get token from $localStorage
        var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        console.log(token);
        //fake token
        //var token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUyMDkzNTkyOSwic2NvcGUiOltdfQ.Fw7gOlXeUjArK0dAuxTUP2SZYeK7UIY3dhPmCV0h3gkRwHqC35cYAOuvA68sPk8mJYGG7gneLX7_9xMentMVJw';

        vm.popupShow = false;
        vm.popupContent = null;
        vm.popupBtn = false;
        vm.btnCancel = "Hủy";
        vm.btnConfirm = "Đồng ý";
        vm.errorKey = null;

        vm.clickCancel = clickCancel;
        vm.clickConfirm = clickConfirm;
        vm.popupShowHide = popupShowHide;

        vm.array_card = []
        for(var i = 0; i < 10; i++){
            var card = {};
            if(i % 3 == 1){
                card = {
                    front_img : "content/images/the-xanh.png",
                    back_img : "content/images/100.png"
                }
            }else if(i % 3 == 2){
                card = {
                    front_img : "content/images/the-vang.png",
                    back_img : "content/images/50.png"
                }
            }else{
                card = {
                    front_img : "content/images/the-vang.png",
                    back_img : "content/images/20.png"
                }
            }
            vm.array_card.push(card);
        }
        //console.log(vm.array_card)

        loadCards();

        function loadCards() {
            var req = {
                method: 'POST',
                url: API_URL + 'api/prizes/pickCard',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    "active": true,
                    "created": "string",
                    "id": 0,
                    "name": "string",
                    "total": 0,
                    "unit": 0,
                    "updated": "string"
                }
            }

            return $http(req).then(function(response){
                console.log(response)

                vm.popupContent = null;
                vm.errorKey = null;
                vm.popupBtn = false;
                vm.popupShow = false;
                //return response.data;
                getAccount();
            }, function(error){
                console.log(error)
                vm.errorKey = error.data.errorKey;
                if(vm.errorKey == "userprize"){
                    vm.popupBtn = false;
                }
                vm.popupContent = error.data.title;
                vm.popupBtn = false;
                vm.popupShow = true;
                //return error;
            });
        }

        function popupShowHide() {
            vm.popupShow = !vm.popupShow;
        }

        function clickCancel() {
            vm.popupShow = false;
        }

        function clickConfirm() {
            if(vm.errorKey == "userprize"){

            }
        }
    }
})();

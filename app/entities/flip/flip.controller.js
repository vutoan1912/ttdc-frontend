(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('FlipController', FlipController);


    FlipController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http', '$rootScope'];

    function FlipController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http, $rootScope) {
        var vm = this;
        vm.index = null;

        $scope.isAuthenticated = Principal.isAuthenticated();
        getAccount();

        function getAccount() {
            Principal.getAccountInfo().then(function(account) {
                //console.log(account);
                $scope.account = account;
            });
        }

        //fake sub
        //$scope.isAuthenticated = true;

        //get token from $localStorage
        var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        //console.log(token);
        //fake token
        //var token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUyMDkzNTkyOSwic2NvcGUiOltdfQ.Fw7gOlXeUjArK0dAuxTUP2SZYeK7UIY3dhPmCV0h3gkRwHqC35cYAOuvA68sPk8mJYGG7gneLX7_9xMentMVJw';

        vm.popupShow = false;
        vm.popupContent = null;
        vm.popupBtn = false;
        vm.btnCancel = "Hủy";
        vm.btnConfirm = "Đồng ý";
        vm.errorKey = null;

        vm.pickCard = pickCard;
        vm.clickCancel = clickCancel;
        vm.clickConfirm = clickConfirm;
        vm.popupShowHide = popupShowHide;
        vm.convertCard = convertCard;
        vm.clickGoPlay = clickGoPlay;

        vm.array_card = []
        for(var i = 0; i < 10; i++){
            var card = {};
            if(i % 2 == 1){
                card = {
                    front_img : "content/images/the-xanh.png",
                    back_img : "",
                    status : 1
                }
            }else{
                card = {
                    front_img : "content/images/the-vang.png",
                    back_img : "",
                    status : 1
                }
            }
            vm.array_card.push(card);
        }
        //console.log(vm.array_card)

        function convertCard() {
            var req = {
                method: 'POST',
                url: API_URL + 'api/prizes/convertCard',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    "active": true,
                    "avatar": "string",
                    "cards": 0,
                    "created": "string",
                    "diamonds": 0,
                    "id": 0,
                    "langKey": "string",
                    "msisdn": $localStorage.msisdn,
                    "password": "string",
                    "questions": 0,
                    "sub": true,
                    "totalBuy": 0,
                    "updated": "string",
                    "userType": 0
                }
            }

            return $http(req).then(function(response){
                //console.log(response)

                getAccount();
                $scope.finish = false;

            }, function(error){
                console.log(error)

            });
        }

        function popupShowHide() {
            vm.popupShow = !vm.popupShow;
        }

        $scope.isDisabled = false;
        function pickCard(index) {
            if($scope.account == null){
                vm.popupContent = "Bạn cần đăng ký chơi và tích lũy kim cương để có thể lật bài.";
                vm.popupBtn = false;
                vm.popupShow = true;
                return;
            }
            if($scope.account.cards > 0 && vm.array_card[index].status == 1){

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
                    //console.log(response)

                    $scope.isDisabled = false;

                    if(response.data.id == 1){
                        vm.array_card[index].back_img = "content/images/mdt.png";
                    }else if(response.data.id == 2){
                        vm.array_card[index].back_img = "content/images/kc.png";
                    }else if(response.data.id == 3){
                        vm.array_card[index].back_img = "content/images/20.png";
                    }else if(response.data.id == 4){
                        vm.array_card[index].back_img = "content/images/50.png";
                    }else if(response.data.id == 5){
                        vm.array_card[index].back_img = "content/images/100.png";
                    }

                    vm.popupContent = "Chúc mừng bạn đã nhận được " + response.data.name;
                    vm.errorKey = null;
                    vm.popupBtn = false;
                    vm.popupShow = true;
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
            }else{
                vm.popupContent = "Bạn đã hết lượt lật thẻ bài. Quy đổi 10 kim cương/ 1 lần lật thẻ bài";
                vm.popupBtn = false;
                vm.popupShow = true;
            }
        }

        $scope.finish = false;
        function clickCancel() {
            vm.popupShow = false;
            if(!$scope.finish) $('.card'+vm.index).toggleClass('flipped');
            if($scope.account.cards == 0) $scope.finish = true;
        }

        function clickConfirm() {
            if(vm.errorKey == "userprize"){

            }
        }

        function clickGoPlay() {
            if($scope.account == null){
                vm.popupContent = "Bạn cần phải <a href='http://mbox.mobifone.vn/doanchu/#/login'>đăng nhập</a> để sử dụng chức năng này !";
                vm.popupBtn = false;
                vm.popupShow = true;
                return;
            }
            $state.go("play");
        }

        $(document).ready(function(){
            $('.classclick1').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[0].status == 1){
                    $scope.isDisabled = true;
                    $('.card1').toggleClass('flipped');
                    //vm.array_card[0].status = 0;
                    vm.index = 1;
                }
            });
            $('.classclick2').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[1].status == 1){
                    $scope.isDisabled = true;
                    $('.card2').toggleClass('flipped');
                    //vm.array_card[1].status = 0;
                    vm.index = 2;
                }
            });
            $('.classclick3').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[2].status == 1){
                    $scope.isDisabled = true;
                    $('.card3').toggleClass('flipped');
                    //vm.array_card[2].status = 0;
                    vm.index = 3;
                }
            });
            $('.classclick4').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[3].status == 1){
                    $scope.isDisabled = true;
                    $('.card4').toggleClass('flipped');
                    //vm.array_card[3].status = 0;
                    vm.index = 4;
                }
            });
            $('.classclick5').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[4].status == 1){
                    $scope.isDisabled = true;
                    $('.card5').toggleClass('flipped');
                    //vm.array_card[4].status = 0;
                    vm.index = 5;
                }
            });
            $('.classclick6').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[5].status == 1){
                    $scope.isDisabled = true;
                    $('.card6').toggleClass('flipped');
                    //vm.array_card[5].status = 0;
                    vm.index = 6;
                }
            });
            $('.classclick7').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[6].status == 1){
                    $scope.isDisabled = true;
                    $('.card7').toggleClass('flipped');
                    //vm.array_card[6].status = 0;
                    vm.index = 7;
                }
            });
            $('.classclick8').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[7].status == 1){
                    $scope.isDisabled = true;
                    $('.card8').toggleClass('flipped');
                    //vm.array_card[7].status = 0;
                    vm.index = 8;
                }
            });
            $('.classclick9').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[8].status == 1){
                    $scope.isDisabled = true;
                    $('.card9').toggleClass('flipped');
                    //vm.array_card[8].status = 0;
                    vm.index = 9;
                }
            });
            $('.classclick10').on('click', function () {
                if($scope.account.cards > 0 && !$scope.isDisabled && vm.array_card[9].status == 1){
                    $scope.isDisabled = true;
                    $('.card10').toggleClass('flipped');
                    //vm.array_card[8].status = 0;
                    vm.index = 10;
                }
            });
        });
    }
})();

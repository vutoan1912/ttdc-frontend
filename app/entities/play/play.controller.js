(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('PlayController', PlayController);


    PlayController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http', 'QUESTION_CONTENT'];

    function PlayController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http, QUESTION_CONTENT) {
        var vm = this;

        var array_alphabet = ["a","b","c","d","e","g","h","i","k","l","m","n","o","p","q","r","s","t","u","v","x","y"];

        //vm.question_content = QUESTION_CONTENT;
        //console.log(vm.question_content);
        vm.question = {};
        vm.finish_play = false;

        $scope.isAuthenticated = Principal.isAuthenticated();
        $scope.account = Principal.getAccountInfo();
        //console.log($scope.account)

        //fake sub
        $scope.isAuthenticated = true;

        //get token from $localStorage
        //var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        //console.log(token);
        //fake token
        var token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUyMDkzNTkyOSwic2NvcGUiOltdfQ.Fw7gOlXeUjArK0dAuxTUP2SZYeK7UIY3dhPmCV0h3gkRwHqC35cYAOuvA68sPk8mJYGG7gneLX7_9xMentMVJw';

        vm.popupShow = false;
        vm.popupContent = null;
        vm.popupShowHide = popupShowHide;
        function popupShowHide() {
            vm.popupShow = !vm.popupShow;
        }

        vm.array_answer = [];
        vm.array_suggest = [];

        vm.chooseCharacter = chooseCharacter;

        if($scope.isAuthenticated) countDown();

        function getQuestion () {

            var req = {
                method: 'GET',
                url: API_URL + 'api/questions/getQuestion',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                console.log(response);
                vm.question = response.data;

                if(angular.isDefined(vm.question.link)) buildLink(vm.question.type, vm.question.link);
                vm.popupContent = null;

                //bind data
                //console.log(vm.question.answer)
                var array_space = vm.question.answer.split(" ");
                //console.log(array_space)

                var concat_element = "";
                for(var i = 0;i<array_space.length;i++){
                    //console.log(array_space[i])
                    if(concat_element.length + array_space[i].length > 7){
                        vm.array_answer.push(concat_element.split(''));
                        concat_element = array_space[i];
                    }else if(concat_element.length + array_space[i].length <= 7){
                        if(concat_element.length > 0) concat_element = concat_element + ' ' + array_space[i];
                        else concat_element = array_space[i];
                    }
                    if(i >= (array_space.length-1)) vm.array_answer.push(concat_element.split(''));
                }
                //console.log(vm.array_answer)

                array_space = vm.question.answer.replace(/\s/g,"").split("");
                //console.log(array_space)

                //Lấy ngẫu nhiên ký tự thiếu cho đầy mảng suggest
                var num_need = (vm.array_answer.length * 8) - array_space.length;
                for(var j=0;j<num_need;j++){
                    var rand = array_alphabet[Math.floor(Math.random() * array_alphabet.length)];
                    array_space.push(rand);
                }
                //console.log(array_space)
                //trộn lẫn ký tự
                array_space = shuffle(array_space);
                //console.log(array_space)

                //đưa vào mảng suggest
                var array_suggest_element = [];
                for(var m=0;m<array_space.length;m++){
                    array_suggest_element.push(array_space[m])
                    if(m>0 && ((m+1)%8==0)) {
                        vm.array_suggest.push(array_suggest_element);
                        array_suggest_element = [];
                    }
                }
                //console.log(vm.array_suggest)

                //console.log(vm.array_answer)
                for(var x=0;x<vm.array_answer.length;x++){
                    for(var y=0;y<vm.array_answer[x].length;y++){
                        if(vm.array_answer[x][y] != " ") vm.array_answer[x][y] = "";
                    }
                }
                console.log(vm.array_answer)

                localStorage.setItem("storage_answer",JSON.stringify(vm.array_answer));
                localStorage.setItem("storage_suggest",JSON.stringify(vm.array_suggest));
                localStorage.setItem("storage_question",JSON.stringify(vm.question));

                return response.data;
            }, function(error){
                console.log(error)
                popupShowHide();
                vm.popupContent = error.data.title;
                return error;
            });
        }

        function clearStorage() {
            localStorage.removeItem("dateNow");
            localStorage.removeItem("storage_answer");
            localStorage.removeItem("storage_suggest");
            localStorage.removeItem("storage_answer");
        }

        function chooseCharacter(char) {
            if(!vm.finish_play){
                //console.log(char)
                var count_char = 0;
                for(var u=0;u<vm.array_answer.length;u++){
                    for(var v=0;v<vm.array_answer[u].length;v++){
                        if(vm.array_answer[u][v] == "" ) {
                            count_char++;
                        }
                    }
                }
                var count_char_play = 0;
                for(var x=0;x<vm.array_answer.length;x++){
                    for(var y=0;y<vm.array_answer[x].length;y++){
                        if(vm.array_answer[x][y] == "" ) {
                            vm.array_answer[x][y] = char;
                            count_char_play++;
                            if(count_char_play < count_char) return;
                        }
                    }
                }

                //submit answer
                //console.log('submit answer')
                clearStorage();

                vm.finish_play = true;
                submitAnswer();
            }
        }

        function submitAnswer() {
            var answer_result = "";
            for(var t=0;t<vm.array_answer.length;t++){
                if(answer_result.length == 0)
                    answer_result += vm.array_answer[t].join("").replace(",","");
                else
                    answer_result += " " + vm.array_answer[t].join("").replace(",","");
            }
            console.log(answer_result)
            var req = {
                method: 'POST',
                url: API_URL + 'api/questions/answerQuestion',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    "active": true,
                    "answer": answer_result,
                    "created": "string",
                    "id": 0,
                    "msisdn": "string",
                    "questionId": vm.question.id,
                    "updated": "string"
                }
            }

            return $http(req).then(function(response){
                console.log(response);
                if(response.data == 1)
                    vm.popupContent = "Chúc mừng bạn đã trả lời đúng !";
                else
                    vm.popupContent = "Đáp án của bạn chưa chính xác !";
                popupShowHide();
                return response.data;
            }, function(error){
                console.log(error)
                popupShowHide();
                vm.popupContent = error.data.title;
                return error;
            });
        }

        function buildLink(type, link) {
            if(type == 2){
                vm.question.link = MEDIA_SERVER + QUESTION_CONTENT + 'images/' + link;
                return vm.question.link;
            } else if(type == 3) {
                var myAudio = document.getElementsByTagName('audio')[0];
                vm.question.link = MEDIA_SERVER + QUESTION_CONTENT + 'audio/' + link;
                myAudio.src = vm.question.link;
                myAudio.load();
                myAudio.play();
                return vm.question.link;
            } else if(type == 4) {
                var myVideo = document.getElementsByTagName('video')[0];
                vm.question.link = MEDIA_SERVER + QUESTION_CONTENT + 'videos/' + link;
                myVideo.src = vm.question.link;
                myVideo.load();
                myVideo.play();
                return vm.question.link;
            }
            else return link;
        }

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        function countDown() {
            var distance = 120;
            var TimeSubmit = '';
            if(localStorage.getItem("dateNow")!= '' && localStorage.getItem("dateNow")!= null )
            {
                var dateNow =  new Date();
                var dateTimeNow= dateNow.getTime();

                TimeSubmit = localStorage.getItem("dateNow");
                var timeDiff = parseFloat(TimeSubmit) - parseFloat(dateTimeNow);
                distance = Math.ceil(timeDiff/1000);
                console.log(distance);

                //get data storage
                vm.array_answer = JSON.parse(localStorage.getItem("storage_answer"));
                vm.array_suggest = JSON.parse(localStorage.getItem("storage_suggest"));
                vm.question = JSON.parse(localStorage.getItem("storage_question"));

                console.log(vm.array_answer)
                console.log(vm.array_suggest)
                console.log(vm.question)

                vm.finish_play = false;
            }
            else
            {
                var twentyMinutesLater = new Date();
                twentyMinutesLater.setSeconds(twentyMinutesLater.getSeconds() + distance);

                TimeSubmit= twentyMinutesLater.getTime();
                localStorage.setItem("dateNow",TimeSubmit);

                //set data storage
                if($scope.isAuthenticated) getQuestion();

                vm.finish_play = false;
            }

            if(distance>0)
            {
                var x = setInterval(function() {
                    distance = distance - 1;
                    document.getElementById("counterdown").innerHTML =  distance;

                    if (distance < 1) {
                        clearInterval(x);
                        console.log('Đã hết giờ');
                        clearStorage();

                        vm.finish_play = true;
                        submitAnswer();
                    }
                }, 1000);
            }
            else
            {
                console.log('Hết giờ lâu rồi nhé! Ahihi');
                clearStorage();
                vm.finish_play = true;
            }
        }


    }
})();

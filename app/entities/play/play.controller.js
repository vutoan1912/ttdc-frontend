(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('PlayController', PlayController);


    PlayController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http', 'QUESTION_CONTENT','$state'];

    function PlayController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http, QUESTION_CONTENT,$state) {
        var vm = this;

        var array_alphabet = ["a","b","c","d","e","g","h","i","k","l","m","n","o","p","q","r","s","t","u","v","x","y"];

        var intervals = JSON.parse(localStorage.getItem("storage_intervals"));
        if(intervals == null) intervals = [];
        //console.log(intervals)

        $scope.img_english = MEDIA_SERVER + "content/images/questionEnglish.jpg";

        vm.status = null;

        //vm.question_content = QUESTION_CONTENT;
        //console.log(vm.question_content);
        vm.question = {};
        vm.finish_play = false;

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
        //console.log(token);
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
        vm.goHome = goHome;

        function goHome() {
            $state.go("default");
        }

        function popupShowHide() {
            vm.popupShow = !vm.popupShow;
        }

        vm.array_answer = [];
        vm.array_answer_guest = [];
        vm.array_suggest = [];

        vm.chooseCharacter = chooseCharacter;
        vm.clearChar = clearChar;
        vm.suggestAnwer = suggestAnwer;
        vm.changeQuestion = changeQuestion;

        if($scope.isAuthenticated) countDown();

        function getQuestion () {
            //vm.errorKey = null;
            //vm.status = null;

            var req = {
                method: 'GET',
                url: API_URL + 'api/questions/getQuestion',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                vm.array_answer = [];
                vm.array_answer_guest = [];
                vm.array_suggest = [];
                vm.finish_play = false;

                console.log(response);
                vm.question = response.data;
                vm.status = response.status;

                if(angular.isDefined(vm.question.link)) buildLink(vm.question.type, vm.question.link);
                vm.popupContent = null;
                vm.popupShow = false;

                //bind data
                //console.log(vm.question.answer)
                var array_space = vm.question.answer.split(" ");
                //console.log(array_space)

                var concat_element = "";
                for(var i = 0;i<array_space.length;i++){
                    if(concat_element.length + array_space[i].length > 7){
                        vm.array_answer.push(concat_element.split(''));
                        vm.array_answer_guest.push(concat_element.split(''));
                        concat_element = array_space[i];
                    }else if(concat_element.length + array_space[i].length <= 7){
                        if(concat_element.length > 0) concat_element = concat_element + ' ' + array_space[i];
                        else concat_element = array_space[i];
                    }
                    if(i >= (array_space.length-1)) {
                        vm.array_answer.push(concat_element.split(''));
                        vm.array_answer_guest.push(concat_element.split(''));
                    }
                }
                //console.log(vm.array_answer)
                //console.log(vm.array_answer_guest)

                array_space = vm.question.answer.replace(/\s/g,"").split("");
                //console.log(array_space)

                //Lấy ngẫu nhiên ký tự thiếu cho đầy mảng suggest
                var num_need = (vm.array_answer_guest.length * 8) - array_space.length;
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

                for(var x=0;x<vm.array_answer_guest.length;x++){
                    for(var y=0;y<vm.array_answer_guest[x].length;y++){
                        if(vm.array_answer_guest[x][y] != " ") vm.array_answer_guest[x][y] = "";
                    }
                }
                //console.log(vm.array_answer)
                //console.log(vm.array_answer_guest)

                setStorage();

                return response.data;
            }, function(error){
                console.log(error)
                vm.status = error.status;
                vm.errorKey = error.data.errorKey;
                if(vm.errorKey == "emptybuy"){
                    vm.popupBtn = false;
                }else if(vm.errorKey == "invalidquestions"){
                    vm.popupBtn = false;
                }else if(vm.errorKey == "emptyquestions"){
                    vm.popupBtn = true;
                    vm.btnCancel = "Hủy";
                    vm.btnConfirm = "Đồng ý";
                }
                vm.popupContent = error.data.title;
                //popupShowHide();
                vm.popupShow = true;

                //clear storage
                clearStorage();
                return error;
            });
        }

        function clearStorage() {
            //clear interval
            intervals.forEach(clearInterval);
            intervals = [];

            localStorage.removeItem("dateNow");
            localStorage.removeItem("storage_answer");
            localStorage.removeItem("storage_answer_guest");
            localStorage.removeItem("storage_suggest");
            localStorage.removeItem("storage_question");
            //localStorage.removeItem("storage_question_status");
            //console.log('clear storage done')
        }

        function getStorage() {
            vm.array_answer = JSON.parse(localStorage.getItem("storage_answer"));
            vm.array_answer_guest = JSON.parse(localStorage.getItem("storage_answer_guest"));
            vm.array_suggest = JSON.parse(localStorage.getItem("storage_suggest"));
            vm.question = JSON.parse(localStorage.getItem("storage_question"));
            vm.status = localStorage.getItem("storage_question_status")
        }

        function setStorage() {
            localStorage.setItem("storage_answer",JSON.stringify(vm.array_answer));
            localStorage.setItem("storage_answer_guest",JSON.stringify(vm.array_answer_guest));
            localStorage.setItem("storage_suggest",JSON.stringify(vm.array_suggest));
            localStorage.setItem("storage_question",JSON.stringify(vm.question));
            localStorage.setItem("storage_question_status",vm.status);
        }

        function chooseCharacter(char, index, row) {
            //console.log(char)
            if(!vm.finish_play && char.length > 0){
                row[index] = "";

                var count_char = 0;
                for(var u=0;u<vm.array_answer_guest.length;u++){
                    for(var v=0;v<vm.array_answer_guest[u].length;v++){
                        if(vm.array_answer_guest[u][v] == "" ) {
                            count_char++;
                        }
                    }
                }
                var count_char_play = 0;
                for(var x=0;x<vm.array_answer_guest.length;x++){
                    for(var y=0;y<vm.array_answer_guest[x].length;y++){
                        if(vm.array_answer_guest[x][y] == "" ) {
                            vm.array_answer_guest[x][y] = char;
                            count_char_play++;
                            if(count_char_play < count_char) return;
                        }
                    }
                }

                //submit answer
                vm.finish_play = true;
                submitAnswer();

                //clear storage
                clearStorage();
            }
        }

        function submitAnswer() {
            console.log(vm.status)
            clearStorage();
            if(vm.status == 200){
                console.log('submit answer')
                var answer_result = "";
                for(var t=0;t<vm.array_answer_guest.length;t++){
                    if(answer_result.length == 0)
                        answer_result += vm.array_answer_guest[t].join("").replace(",","");
                    else
                        answer_result += " " + vm.array_answer_guest[t].join("").replace(",","");
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
                        vm.popupContent = "Chúc mừng bạn đã trả lời đúng ! Bạn có muốn tham gia chơi tiếp không?";
                    else
                        vm.popupContent = "Đáp án của bạn chưa chính xác ! Bạn có muốn tham gia chơi tiếp không?";
                    vm.errorKey = "getQuestion";
                    vm.popupBtn = true;
                    vm.btnCancel = "Xem lại";
                    vm.btnConfirm = "Chơi tiếp";
                    vm.popupShow = true;
                    //popupShowHide();
                    //return response.data;
                    getAccount();

                }, function(error){
                    console.log(error)
                    popupShowHide();
                    vm.popupContent = error.data.title;
                    //return error;
                });
            }
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
            } else if(type == 5) {
                var myAudio = document.getElementsByTagName('audio')[0];
                vm.question.link = MEDIA_SERVER + QUESTION_CONTENT + 'audio/' + link;
                myAudio.src = vm.question.link;
                myAudio.load();
                myAudio.play();
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

        //var distance;
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
                //console.log(distance);

                //get data storage
                getStorage();

                /*console.log(vm.array_answer)
                console.log(vm.array_answer_guest)
                console.log(vm.array_suggest)
                console.log(vm.question)*/
            } else {
                var twentyMinutesLater = new Date();
                twentyMinutesLater.setSeconds(twentyMinutesLater.getSeconds() + distance);
                TimeSubmit = twentyMinutesLater.getTime();
                localStorage.setItem("dateNow",TimeSubmit);

                //get question and set data storage
                if($scope.isAuthenticated) getQuestion();
            }

            if(distance>0)
            {
                var x = setInterval(function() {
                    //console.log(distance)
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
                intervals.push(x);
                localStorage.removeItem("storage_intervals");
                localStorage.setItem("storage_intervals",JSON.stringify(intervals));
            }
            else
            {
                console.log('Hết giờ lâu rồi nhé! Ahihi');
                submitAnswer();
                vm.finish_play = true;
            }
        }

        function clickCancel() {
            //popupShowHide();
            vm.popupShow = false;
        }

        function clickConfirm() {
            if(vm.errorKey == "emptyquestions"){
                buyQuestion();
            }else if(vm.errorKey == "getQuestion"){
                countDown();
            }else if(vm.errorKey == "emptyquestions"){
                buyQuestion();
            }
        }

        function buyQuestion() {
            var req = {
                method: 'POST',
                url: API_URL + 'api/questions/buyQuestion',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(req).then(function(response){
                console.log(response)
                console.log('Mua câu hỏi thành công !')
                vm.popupContent = null;
                vm.errorKey = null;
                vm.popupBtn = false;
                vm.popupShow = false;
                //return response.data;
                getAccount();
            }, function(error){
                console.log(error)
                vm.errorKey = error.data.errorKey;
                /*if(vm.errorKey == "buyquestionmax"){
                    vm.popupBtn = false;
                }else if(vm.errorKey == "buyquestionnotmoney"){
                    vm.popupBtn = false;
                }else if(vm.errorKey == "buyquestionnotreg"){
                    vm.popupBtn = false;
                }else if(vm.errorKey == "buyquestionunknown"){
                    vm.popupBtn = false;
                }*/
                vm.popupContent = error.data.title;
                vm.popupBtn = false;
                vm.popupShow = true;
                //return error;
            });
        }

        function clearChar(char, index, row) {
            if(!vm.finish_play && char.length > 0){
                //console.log(index)
                //console.log(row)
                row[index] = "";
                for(var x=0;x<vm.array_suggest.length;x++){
                    for(var y=0;y<vm.array_suggest[x].length;y++){
                        if(vm.array_suggest[x][y] == "" ) {
                            vm.array_suggest[x][y] = char;
                            return;
                        }
                    }
                }
            }
        }

        function suggestAnwer() {
            if(!vm.finish_play){
                var req = {
                    method: 'GET',
                    url: API_URL + 'api/questions/getGuide?questionId='+vm.question.id,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }

                return $http(req).then(function(response){
                    console.log(response)
                    console.log('Lấy gợi ý thành công !')
                    vm.popupContent = null;
                    vm.errorKey = null;
                    vm.popupBtn = false;
                    vm.popupShow = false;
                    //return response.data;

                    //đếm số từ gợi ý cần ghép
                    var finish_play_now = false;
                    var count_suggest = 0;
                    for(var m=0;m<vm.array_answer_guest.length;m++){
                        for(var n=0;n<vm.array_answer_guest[m].length;n++){
                            if(vm.array_answer_guest[m][n] == "") {
                                count_suggest++;
                            }
                        }
                    }
                    if(count_suggest > 3) count_suggest = 3; else finish_play_now = true;

                    //ghép từ gợi ý
                    var rand = 0;
                    var i = 0, j = 0;
                    while (i < count_suggest) {
                        j = Math.floor(Math.random() * vm.array_answer_guest.length);
                        rand = Math.floor(Math.random() * vm.array_answer_guest[j].length);
                        if(vm.array_answer[j][rand] != " " && vm.array_answer_guest[j][rand] == ""){
                            vm.array_answer_guest[j][rand] = vm.array_answer[j][rand];
                            i++;

                            //clear array suggest
                            for(var x=0;x<vm.array_suggest.length;x++){
                                for(var y=0;y<vm.array_suggest[x].length;y++){
                                    if(vm.array_suggest[x][y] == vm.array_answer[j][rand]) {
                                        vm.array_suggest[x][y] = "";
                                        y = 1000; break;
                                    }
                                }
                                if(y == 1000) { x = 1000; console.log('finish clear suggest'); break; }
                            }
                        }
                    }
                    //console.log(vm.array_answer)
                    //console.log(vm.array_answer_guest)
                    getAccount();

                    if(finish_play_now) {submitAnswer(); vm.finish_play=true;}

                }, function(error){
                    console.log(error)
                    vm.errorKey = error.data.errorKey;
                    vm.popupContent = error.data.title;
                    vm.popupBtn = false;
                    vm.popupShow = true;
                    //return error;
                });
            }
        }

        function changeQuestion() {
            console.log(vm.finish_play)
            if(!vm.finish_play){
                var req = {
                    method: 'POST',
                    url: API_URL + 'api/questions/changeQuestion',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    data: {
                        "active": true,
                        "answer": "string",
                        "content": "string",
                        "created": "string",
                        "id": 0,
                        "link": "string",
                        "type": 0,
                        "updated": "string"
                    }
                }

                return $http(req).then(function(response){
                    console.log(response)
                    console.log('Đổi câu hỏi thành công !')
                    vm.popupContent = null;
                    vm.errorKey = null;
                    vm.popupBtn = false;
                    vm.popupShow = false;
                    //return response.data;

                    clearStorage();
                    getAccount();
                    countDown();

                }, function(error){
                    clearStorage();
                    console.log(error)
                    vm.errorKey = error.data.errorKey;
                    if(vm.errorKey == "changequestionsfull"){
                        vm.popupBtn = false;
                    }else if(vm.errorKey == "emptybuy"){
                        vm.popupBtn = false;
                    }else if(vm.errorKey == "invalidquestions"){
                        vm.popupBtn = false;
                    }else if(vm.errorKey == "emptyquestions"){
                        vm.popupBtn = true;
                        vm.btnCancel = "Hủy";
                        vm.btnConfirm = "Đồng ý";
                    }
                    vm.popupContent = error.data.title;
                    vm.popupShow = true;
                    //return error;
                });
            }else{
                clearStorage();
                countDown();
            }
        }

    }
})();

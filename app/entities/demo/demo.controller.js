(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .controller('DemoController', DemoController);


    DemoController.$inject = ['$scope', 'Principal', 'MEDIA_SERVER', '$translate', '$timeout', '$localStorage', '$sessionStorage', 'API_URL', '$http', 'QUESTION_CONTENT','$stateParams'];

    function DemoController ($scope, Principal, MEDIA_SERVER, $translate, $timeout, $localStorage, $sessionStorage, API_URL, $http, QUESTION_CONTENT, $stateParams) {
        var vm = this;

        var token = "";
        var intervals = JSON.parse(localStorage.getItem("storage_intervals_demo"));
        if(intervals == null) intervals = [];
        //console.log(intervals)

        var array_alphabet = ["a","b","c","d","e","g","h","i","k","l","m","n","o","p","q","r","s","t","u","v","x","y"];
        vm.status = null;
        vm.typeQuestion = $stateParams.type;
        console.log('type question: ' + vm.typeQuestion);

        //vm.question_content = QUESTION_CONTENT;
        //console.log(vm.question_content);
        vm.question = {};
        vm.finish_play = false;

        $scope.diamonds = 100;
        function getAccount(number) {
            $scope.diamonds = $scope.diamonds + number;
        }

        clearStorage();

        vm.popupShow = false;
        vm.popupContent = null;
        vm.popupBtn = false;
        vm.btnCancel = "Hủy";
        vm.btnConfirm = "Đồng ý";
        vm.errorKey = null;

        vm.clickCancel = clickCancel;
        vm.clickConfirm = clickConfirm;
        vm.popupShowHide = popupShowHide;

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

        countDown();

        function getQuestion () {
            //vm.errorKey = null;
            //vm.status = null;

            var req = {
                method: 'GET',
                url: API_URL + 'api/questions/getQuestionTest?type=' + vm.typeQuestion,
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

            localStorage.removeItem("dateNowTest");
            localStorage.removeItem("storage_answer_test");
            localStorage.removeItem("storage_answer_guest_test");
            localStorage.removeItem("storage_suggest_test");
            localStorage.removeItem("storage_question_test");
            //localStorage.removeItem("storage_question_status_test");
        }

        function getStorage() {
            vm.array_answer = JSON.parse(localStorage.getItem("storage_answer_test"));
            vm.array_answer_guest = JSON.parse(localStorage.getItem("storage_answer_guest_test"));
            vm.array_suggest = JSON.parse(localStorage.getItem("storage_suggest_test"));
            vm.question = JSON.parse(localStorage.getItem("storage_question_test"));
            vm.status = localStorage.getItem("storage_question_status_test")
        }

        function setStorage() {
            localStorage.setItem("storage_answer_test",JSON.stringify(vm.array_answer));
            localStorage.setItem("storage_answer_guest_test",JSON.stringify(vm.array_answer_guest));
            localStorage.setItem("storage_suggest_test",JSON.stringify(vm.array_suggest));
            localStorage.setItem("storage_question_test",JSON.stringify(vm.question));
            localStorage.setItem("storage_question_status_test",vm.status);
        }

        function chooseCharacter(char, index, row) {
            if(!vm.finish_play){
                //console.log(char)
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
                    url: API_URL + 'api/questions/answerQuestionTest',
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
                    if(response.data == 1){
                        getAccount(3);
                        vm.popupContent = "Chúc mừng bạn đã trả lời đúng ! Bạn có muốn tham gia chơi tiếp không?";
                    } else{
                        getAccount(-2);
                        vm.popupContent = "Đáp án của bạn chưa chính xác ! Bạn có muốn tham gia chơi tiếp không?";
                    }
                    vm.errorKey = "getQuestion";
                    vm.popupBtn = true;
                    vm.popupShow = true;
                    //popupShowHide();
                    //return response.data;

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
            if(localStorage.getItem("dateNowTest")!= '' && localStorage.getItem("dateNowTest")!= null )
            {
                var dateNow =  new Date();
                var dateTimeNow= dateNow.getTime();

                TimeSubmit = localStorage.getItem("dateNowTest");
                var timeDiff = parseFloat(TimeSubmit) - parseFloat(dateTimeNow);
                distance = Math.ceil(timeDiff/1000);
                //console.log(distance);

                //get data storage
                getStorage();

                console.log(vm.array_answer)
                console.log(vm.array_answer_guest)
                console.log(vm.array_suggest)
                console.log(vm.question)
            } else {
                var twentyMinutesLater = new Date();
                twentyMinutesLater.setSeconds(twentyMinutesLater.getSeconds() + distance);
                TimeSubmit = twentyMinutesLater.getTime();
                localStorage.setItem("dateNowTest",TimeSubmit);

                //get question and set data storage
                getQuestion();
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
                intervals.push(x);
                localStorage.removeItem("storage_intervals_demo");
                localStorage.setItem("storage_intervals_demo",JSON.stringify(intervals));
            }
            else
            {
                console.log('Hết giờ lâu rồi nhé! Ahihi');
                clearStorage();
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
                getAccount(-1);
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
        
        function suggestAnwer() {

            vm.popupContent = null;
            vm.errorKey = null;
            vm.popupBtn = false;
            vm.popupShow = false;
            //return response.data;

            //ghép từ gợi ý
            var rand = 0;
            var i = 0, j = 0;
            while (i < 3) {
                j = Math.floor(Math.random() * vm.array_answer_guest.length);
                rand = Math.floor(Math.random() * vm.array_answer_guest[j].length);
                if(vm.array_answer[j][rand] != " " && vm.array_answer_guest[j][rand] == ""){
                    vm.array_answer_guest[j][rand] = vm.array_answer[j][rand];
                    i++;
                }
            }
            //console.log(vm.array_answer)
            //console.log(vm.array_answer_guest)
            getAccount(-1);
        }

        function changeQuestion() {
            if(!vm.finish_play){
                var req = {
                    method: 'POST',
                    url: API_URL + 'api/questions/changeQuestionTest?type=' + vm.typeQuestion,
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
                    getAccount(-1);
                    countDown();

                }, function(error){
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

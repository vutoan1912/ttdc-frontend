(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .directive('bodyWinnerList', bodyWinnerList);

    bodyWinnerList.$inject = ['API_URL','$http'];

    function bodyWinnerList(API_URL, $http) {
        var directive = {
            restrict: 'EAC',
            replace: true,
            template: '<div>\n' +
            '                        <div class="hidden-xs"></div>\n' +
            '                        <h4 class="tip">Khách hàng trúng thưởng gần đây</h4>\n' +
            '                        <div class="box">\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> {{codes[0].created}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[0].content}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[0].msisdn}}</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> {{codes[1].created}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[1].content}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[1].msisdn}}</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> {{codes[2].created}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[2].content}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[2].msisdn}}</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> {{codes[3].created}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[3].content}}</a></dt>\n' +
            '                                <dt><a href="#"> {{codes[3].msisdn}}</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <a style=\'color: ##007bff; font-size: 12px; font-weight: bold\' class=\'loadMore\' ui-sref="prize">Xem thêm</a>\n' +
            '                            </dl>\n' +
            '                        </div>\n' +
            '                    </div>',
            scope: {
                para: '='
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs, parentCtrl) {
            var url = API_URL + 'api/user-prize/searchCMS?query=prizeId=in=(3,4,5,6)&page=0&size=4';
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + ''
                },
                data: {}
            }

            return $http(req).then(function(response){
                //console.log(response)
                scope.codes = response.data.data;

                return response;
            }, function(error){
                //console.log(error)

                return error;
            });
        }
    }

})();

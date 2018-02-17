(function() {
    'use strict';

    angular
        .module('thientaidoanchuApp')
        .directive('bodyWinnerList', bodyWinnerList);

    function bodyWinnerList() {
        var directive = {
            restrict: 'EAC',
            replace: true,
            template: '<div>\n' +
            '                        <div class="hidden-xs"></div>\n' +
            '                        <h4 class="tip">Khách hàng trúng thưởng gần đây</h4>\n' +
            '                        <div class="box">\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> 16/12/1992 00:20:20</a></dt>\n' +
            '                                <dt><a href="#"> Giải nhất</a></dt>\n' +
            '                                <dt><a href="#"> SĐT: 0868538xxx</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> 16/12/1992 00:20:20</a></dt>\n' +
            '                                <dt><a href="#"> Giải nhất</a></dt>\n' +
            '                                <dt><a href="#"> SĐT: 0868538xxx</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> 16/12/1992 00:20:20</a></dt>\n' +
            '                                <dt><a href="#"> Giải nhất</a></dt>\n' +
            '                                <dt><a href="#"> SĐT: 0868538xxx</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <dt><a href="#"> 16/12/1992 00:20:20</a></dt>\n' +
            '                                <dt><a href="#"> Giải nhất</a></dt>\n' +
            '                                <dt><a href="#"> SĐT: 0868538xxx</a></dt>\n' +
            '                            </dl>\n' +
            '                            <dl>\n' +
            '                                <a style=\'color: ##007bff; font-size: 12px; font-weight: bold\' class=\'loadMore\' href="#">Xem thêm</a>\n' +
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

        }
    }

})();

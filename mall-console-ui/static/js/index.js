(function ($) {
    // [2.1] 定义基础常量
    const constant = {
        index_body_tab: 'body',
        index_top_menu: '.into-input input',
        index_left_menu: '#login',
        index_userInfo: '#userInfo',
        index_updatePassword: '#updatePassword',
        index_exit_login: '#logout',
        index_save_submit: '#saveSubmit',
        index_nickname: '#nickname',
        index_menuList: '#showMenuView',
        index_hui_aside: '.Hui-aside',
    };

    // [2.2] 定义接口API
    const api = {
        userInfo: '/api/console/home/userInfo',
        isLogin: '/api/console/home/isLogin',
        updatePassword: '/api/console/center/updatePassword',
        menuTreeList: '/api/console/home/menuTreeList',
    };

    // [2.2] 定义全局事件
    let viewModel = {
        showBodyView: function () {
            $(constant.index_body_tab).Huitab({
                tabBar: ".navbar-wrapper .navbar-levelone",
                tabCon: ".Hui-aside .menu_dropdown",
                className: "current",
                index: 0,
            });
        },
        //展示个人主页信息
        showUserView: function () {
            $(constant.index_userInfo).on("click", function () {
                let html = "";
                layer.open({
                    type: 1,
                    area: ['40%', '30%'], //宽高
                    fix: false, //不固定
                    maxmin: true,
                    shade: 0.4,
                    title: '主页|个人信息',
                    content: html
                });
            });
        },
        showPasswordView: function () {
            $(constant.index_updatePassword).on("click", function () {
                let html = "<form class=\"form form-horizontal\" id=\"form-customer-add\">" +
                    "<input type=\"hidden\" class=\"input-text\" value=\"0\" placeholder=\"\" id=\"id\" name=\"id\">" +
                    "<div class=\"cl\" style='margin-top: 15px;'>" +
                    "<label class=\"form-label col-xs-4 col-sm-2\">账户昵称：</label>" +
                    "<div class=\"formControls col-xs-8 col-sm-9\">" +
                    "<input type=\"text\" class=\"input-text\" value=\"\" readonly='readonly' id='nickname'>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"cl\" style='margin-top: 15px;'>" +
                    "<label class=\"form-label col-xs-4 col-sm-2\">登录密码：</label>" +
                    "<div class=\"formControls col-xs-8 col-sm-9\">" +
                    "<input type=\"password\" class=\"input-text\" value=\"\" maxlength=\"20\" autocomplete=\"off\" placeholder=\"\" id=\"password\" name=\"password\">" +
                    "<span class=\"showpwd\" style=\"position: absolute;right:25px;top:6px;cursor: pointer\"><i class=\"icon Hui-iconfont\"></i></span>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"cl\" style='margin-top: 15px;'>" +
                    "<label class=\"form-label col-xs-4 col-sm-2\">确认密码：</label>" +
                    "<div class=\"formControls col-xs-8 col-sm-9\">" +
                    "<input type=\"password\" class=\"input-text\" value=\"\" maxlength=\"20\" autocomplete=\"off\" placeholder=\"\" id=\"password1\" name=\"password\">" +
                    "<span class=\"showpwd\" style=\"position: absolute;right:25px;top:6px;cursor: pointer\"><i class=\"icon Hui-iconfont\"></i></span>" +
                    "</div>" +
                    "</div>" +
                    "<div class=\"cl\" style='margin-top: 15px;'>" +
                    "<div class=\"col-xs-8 col-sm-9 col-xs-offset-4 col-sm-offset-2\">" +
                    "<button onClick=\"saveSubmit();\" class=\"btn btn-primary radius\" type=\"button\"><i class=\"Hui-iconfont\">&#xe632;</i> 保存</button>" +
                    "<button onClick=\"layer.closeAll();\" class=\"btn btn-default radius\" style='margin-left: 20px' type=\"button\">&nbsp;&nbsp;取消&nbsp;&nbsp;</button>" +
                    "</div>" +
                    "</div>" +
                    "</form>";
                bindEvent.getUserInfo();
                layer.open({
                    title: "主页|修改密码",
                    type: 1,
                    fix: false, //不固定
                    maxmin: true,
                    shade: 0.4,
                    area: ['40%', '30%'], //宽高
                    content: html
                });
            });
        },
        showMenuView: function () {
            $(constant.index_hui_aside).Huifold({
                titCell: '.menu_dropdown dl dt',
                mainCell: '.menu_dropdown dl dd',
            });
        }
    };

    // [2.3] 定义绑定事件函数
    let bindEvent = {
        getUserInfo: function () {
            $.ajax({
                type: 'post',
                url: utils.consoleBaseUrl + api.userInfo,
                dataType: 'json',
                success: function (data) {
                    if ("200" == data.code) {
                        $(constant.index_nickname).val(data.result.adminUser.nickname);
                        window.location.href = "../view/index.html?v=" + data.timestamp;
                    }
                }
            });
        },
        saveSubmit: function () {
            let password = $("#password").val();
            let confirmPassword = $("#password1").val();
            if (password == "") {
                layer.alert("密码不能为空");
                return false;
            } else if (password != confirmPassword) {
                layer.alert("两次密码不一致");
                return false;
            } else {
                $.post(utils.passportBaseUrl + api.updatePassword, {
                    password: password,
                    confirmPassword: confirmPassword
                }, function (data) {
                    if (data.code == "200") {
                        layer.alert("修改成功,请重新登陆", function () {
                            layer.closeAll();
                        });
                    } else {
                        layer.alert(data.message);
                    }
                });
            }
        },
        showMenuTreeList: function () {
         $.post(utils.consoleBaseUrl+api.menuTreeList)

        }
    };

    // [2.3] 定义全局初始化函数
    let index = {
        init: function () {
            bindEvent.getUserInfo();
            bindEvent.saveSubmit();
            bindEvent.showMenuTreeList()
        },
        mounted: function () {
            viewModel.showBodyView();
            viewModel.showUserView();
            viewModel.showPasswordView();
            viewModel.showMenuView();
        }
    };
    // [2.4] 函数调用
    $(function () {
        index.init();
        index.mounted();
    });
})(jQuery);
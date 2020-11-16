// [2.1] 定义基础常量
const constant = {
    index_body_tab: 'body',
    index_top_menu: '.into-input input',
    index_left_menu: '#login',
    show_userInfo: '#userInfo',
    index_exit_login: '#logout',
    index_save_submit: '#saveSubmit',
    show_nickname: '#nickname',
    show_menuList: '#menuTreeList',
    show_hui_aside: '.Hui-aside',
    show_homepageTab: '#showHomepageTab',
    show_homepage: '.show_iframe',
    show_updatePassword: '#showUpdatePassword',
    show_user_id: '#id',
    show_logout: '#logout'
};

// [2.2] 定义接口API
const api = {
    userInfo: '/api/console/home/userInfo',
    isLogin: '/api/console/home/isLogin',
    updatePassword: '/api/console/center/updatePassword',
    showMenuList: '/api/console/home/showMenuList',
    logout: '/api/console/center/logout'
};


(function ($) {
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
        // 展示登录账户信息
        showUserView: function () {
            $(constant.show_userInfo).on("click", function () {
                let html = '<div class="page-container">' +
                    ' <form class="form form-horizontal" id="showUserInfo">' +
                    '<div class="row cl">' +
                    '<label class="form-label col-xs-5 col-sm-3">用户头像：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" id="profilePicture"></div></div>' +
                    '<div class="row cl">' +
                    '<label class="form-label col-xs-5 col-sm-3">登录账户：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" id="account"></div></div>' +
                    '<div class="row cl">' +
                    '<label class="form-label col-xs-5 col-sm-3">账户姓名：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" id="name"></div></div>' +
                    '<div class="row cl">' +
                    '<label class="form-label col-xs-5 col-sm-3">账户性别：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" id="gender"></div></div>' +
                    '<div class="row cl">' +
                    '<label class="form-label col-xs-5 col-sm-3">账户类型：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" id="type"></div></div>' +
                    '<div class="row cl">' +
                    '<label class="form-label col-xs-5 col-sm-3">用户状态：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" id="status"></div></div>' +
                    '<div class="row cl">' +
                    '<label class="form-label col-xs-5 col-sm-3">上次登录：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" id="loginTime"></div></div>' +
                    '</form></div>';
                layer.open({
                    type: 1,
                    area: ['450px', '500px'],
                    fix: false, //不固定
                    maxmin: true,
                    shade: 0.4,
                    title: '主页 | 个人信息',
                    content: html
                });
                //
                let user = JSON.parse(window.localStorage.getItem('adminUser'));
                let pictureHtml = '<ul class="cl portfolio-area">' +
                    '<li class="item" style="margin-right: 0px; margin-top: 0px;"><div class="picbox">' +
                    '<div class="picbox">' +
                    '<a href="' + user.profilePicture + '" data-lightbox="gallery">' +
                    '<img rel="prefetch" src="' + user.profilePicture + '"></a></div></li></ul>';
                $("#profilePicture").html(pictureHtml);
                $("#account").html(user.account);
                $("#name").html(user.name);
                if (user.gender == 0) {
                    $("#gender").html("保密");
                } else if (user.gender == 1) {
                    $("#gender").html("男");
                } else {
                    $("#gender").html("女");
                }
                $("#loginTime").html(user.loginTime);
                //账户类型[0-系统管理账户 1-公司管理账户 2-公司员工账户]
                if (user.type == 0) {
                    $("#type").html("系统管理账户");
                } else if (user.type == 1) {
                    $("#type").html("公司管理账户");
                } else {
                    $("#type").html("公司员工账户");
                }
                if (user.status == 1) {
                    $("#status").html("启用");
                } else if (user.status == 0) {
                    $("#status").html("禁用");
                }
            });
        },
        // 展示修改密码信息
        showPasswordView: function () {
            $(constant.show_updatePassword).on("click", function () {
                // 定义修改页面ViewCode
                let html = '<div class="page-container">' +
                    ' <form class="form form-horizontal" id="showPasswordView">' +
                    '<div class=" row cl" style="margin-top: 15px;">' +
                    '<label class="form-label col-xs-5 col-sm-3"><span\n' +
                    '                    class="c-red">*</span>历史密码：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" >' +
                    '<input type="password" class="input-text" value="" maxlength="20" autocomplete="off" placeholder="" id="password" name="password">' +
                    '<span class="showpwd" style="position: absolute;right:25px;top:6px;cursor: pointer"><i class="icon Hui-iconfont"></i></span>' +
                    '</div></div>' +
                    '<div class=" row cl" style="margin-top: 15px;">' +
                    '<label class="form-label col-xs-5 col-sm-3"><span\n' +
                    '                    class="c-red">*</span>用户密码：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" >' +
                    '<input type="password" class="input-text" value="" maxlength="20" autocomplete="off" placeholder="" id="newPassword" name="newPassword">' +
                    '<span class="showpwd" style="position: absolute;right:25px;top:6px;cursor: pointer"><i class="icon Hui-iconfont"></i></span>' +
                    '</div></div>' +
                    '<div class=" row cl" style="margin-top: 15px;">' +
                    '<label class="form-label col-xs-5 col-sm-3"><span\n' +
                    '                    class="c-red">*</span>确认密码：</label>' +
                    '<div class="formControls col-xs-8 col-sm-9" >' +
                    '<input type="password" class="input-text" value="" maxlength="20" autocomplete="off" placeholder="" id="confirmPassword" name="confirmPassword">' +
                    '<span class="showpwd" style="position: absolute;right:25px;top:6px;cursor: pointer"><i class="icon Hui-iconfont"></i></span>' +
                    '</div></div>' +
                    '<div class="row cl" style="margin-top: 15px;">' +
                    '<div class="col-xs-8 col-sm-9 col-xs-offset-4 col-sm-offset-2">' +
                    '<button onClick="updatePassword();" class="btn btn-primary radius" type="button"><i class="Hui-iconfont">&#xe632;</i> 保存</button>' +
                    '<button onClick="layer.closeAll();" class="btn btn-default radius" style="margin-left:20px" type="button"><i class="Hui-iconfont">&#xe66b;</i>&nbsp;&nbsp;取消&nbsp;&nbsp;</button>' +
                    '</div></div>' +
                    '</form></div>';
                layer.open({
                    type: 1,
                    area: ['480px', '300px'],
                    fix: false, //不固定
                    maxmin: true,
                    shade: 0.4,
                    title: '主页 | 修改密码 ',
                    content: html
                });
                $('.showpwd').hover(function () {
                    $(this).siblings('.input-text').attr('type', 'text');
                }, function () {
                    $(this).siblings('.input-text').attr('type', 'password');
                });

                //let userId = $(constant.show_user_id).val();
                //layer_show('修改账户密码', '../view/system/user/password.html?id=' + userId, 450, 550);
            });
        }
    };

    // [2.3] 定义绑定事件函数
    let bindEvent = {
        userInfo: function () {
            $.post(utils.consoleBaseUrl + api.userInfo, function (data) {
                if ("800" == data.code) {
                    window.location.href = "../view/login.html?v=" + data.timestamp;
                } else if ("200" == data.code) {
                    // 设置账户昵称
                    let nickname = data.result.user.nickname;
                    $(constant.show_nickname).text(nickname);
                    let userId = data.result.user.id;
                    $(constant.show_user_id).val(userId);
                    let userType = data.result.user.type;
                    if (userType == 2) {
                        $(constant.show_homepageTab).attr("data-href", "../view/dashboard.html?v=" + data.timestamp);
                        $(constant.show_homepage).append('<iframe scrolling="yes" frameborder="0" src="../view/dashboard.html?v="' + data.timestamp + '"></iframe>');
                    } else {
                        $(constant.show_homepageTab).attr("data-href", "../view/welcome.html?v=" + data.timestamp);
                        $(constant.show_homepage).append('<iframe scrolling="yes" frameborder="0" src="../view/welcome.html?v="' + data.timestamp + '"></iframe>');
                    }
                } else {
                    top.location.href = "../view/index.html?v=" + data.timestamp;
                }
            });
        },
        showMenuTreeList: function () {
            $.post(utils.consoleBaseUrl + api.showMenuList, function (data) {
                if ("200" == data.code) {
                    // 设置账户昵称
                    console.info(JSON.stringify(data.result.menuList));
                    let menuList = data.result.menuList;
                    let content = '';
                    $(constant.show_menuList).empty();
                    if (menuList.length > 0) {
                        // 循环遍历父级菜单设置
                        $.each(menuList, function (index, parentItem) {
                            content += '<dl id="menu-article">';
                            content += '<dt><i class="Hui-iconfont">' + parentItem.style + '</i> ' + parentItem.name + '<i class="Hui-iconfont menu_dropdown-arrow">&#xe6d5;</i></dt>';
                            content += '<dd><ul>';
                            // 循环遍历二级菜单设置
                            if (parentItem.childMenuList != null) {
                               let childMenuList = parentItem.childMenuList;
                                $.each(childMenuList, function (index, childItem) {
                                    content += '<li><a data-href="' + childItem.event + '?menuId=' + childItem.id + '&v=' + data.timestamp + '" data-title="' + childItem.name + '" href="javascript:void(0)">' ;
                                    content += '<i class="Hui-iconfont">' + childItem.style + '</i>&nbsp;' + childItem.name + '</a></li>';
                                });
                            }
                            content += '</ul></dd></dl>';
                        });
                        $(constant.show_menuList).append(content);
                        $(constant.show_hui_aside).Huifold({
                            titCell: '.menu_dropdown dl dt',
                            mainCell: '.menu_dropdown dl dd',
                        });
                    }
                } else {
                    layer.alert(data.message);
                }
            });
        }
    };

    // [2.3] 定义全局初始化函数
    let index = {
        init: function () {
            bindEvent.userInfo();
            bindEvent.showMenuTreeList();
        },
        mounted: function () {
            viewModel.showBodyView();
            viewModel.showUserView();
            viewModel.showPasswordView();
        }
    };
    // [2.4] 函数调用
    $(function () {
        index.init();
        index.mounted();
    });
})(jQuery);


// 退出登录操作
$(constant.show_logout).on("click", function () {
    $.post(utils.passportBaseUrl + api.logout, {
        token: window.localStorage.getItem('web_login_token')
    }, function (data) {
        if ("200" == data.code) {
            window.location.href = '../view/login.html?v=' + data.timestamp;
            window.localStorage.clear();
        } else {
            layer.alert(data.message);
        }
    });
});

function updatePassword() {

}




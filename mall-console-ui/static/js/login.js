// [1].登录主页swiper轮播
let swiper = new Swiper('.swiper-container', {
    autoplay: 3000,
    loop: true,
    speed: 1000,
    effect: 'fade'
});
// [2].定义全局加载函数
(function ($) {
    // [2.1] 定义基础常量
    const constant = {
        login_form: '.into-input input',
        login_button: '#login',
        login_auto: '#checkbox-id',
    };
    // [2.2] 定义接口API
    const api = {
        consoleLogin: '/api/console/center/login',
        checkLogin: '/api/console/home/isLogin',
    };
    // [2.2] 定义全局事件
    let viewModel = {
        //获取焦点时
        focusOnSet: function () {
            $(constant.login_form).focus(function () {
                $(this).parent().css('border', '1px solid #4fb0c0')
                $(this).parent().find('i').css('color', '#4fb0c0')
            })
        },
        //失去焦点时
        focusOffset: function () {
            $(constant.login_form).blur(function () {
                $(this).parent().css('border', '1px solid #b2b2b2')
                $('.into-input-bot').css('border-top', '0')
                $(this).parent().find('i').css('color', '#b2b2b2')
            })
        },
        keyboard: function () {
            $(document).bind('keyup', function () {
                if (13 == event.keyCode) {//keyCode=13是回车键
                    $(constant.login_button).click();
                }
            });
        }
    };
    // [2.3] 定义绑定事件函数
    let bindEvent = {
        bindLogin: function () {
            $(constant.login_button).on("click", function () {
                let account = $("input[name='account']").val();
                let password = $.md5($("input[name='password']").val());
                let auto = 0;
                if (account == "" || account == null) {
                    layer.alert("登录账户不能为空!");
                    return false;
                }
                if (password == "" || password == null) {
                    layer.alert("登录密码不能为空!");
                    return false;
                }
                if ($(constant.login_auto).is(':checked')) {
                    auto = 1;
                }
                $.ajax({
                    type: 'post',
                    url: utils.passportBaseUrl + api.consoleLogin,
                    data: {account: account, password: password, auto: auto},
                    dataType: 'json',
                    error: function (data) {
                        console.log(data);
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.code == "500") {
                            layer.alert(data.message);
                        } else if (data.code == "200") {
                            window.localStorage.setItem("web_login_token",data.result.web_login_token)
                            window.location.href = "../view/index.html?v=" + data.timestamp;
                        }
                    }
                });
            });
        },
        checkLogin: function () {
            $.ajax({
                type: 'post',
                url: utils.consoleBaseUrl + api.checkLogin,
                dataType: 'json',
                success: function (data) {
                    if ("200" == data.code) {
                        top.window.location.href = "../view/index.html?v=" + response.timestamp;
                    } else if (data.code == "500") {
                        layer.alert(data.message);
                    }
                }, error: function (data) {
                    console.log(data);
                },
            });
        }
    };

    // [2.3] 定义全局初始化函数
    let index = {
        init: function () {
            viewModel.focusOnSet();
            viewModel.focusOffset();
            viewModel.keyboard();
            bindEvent.checkLogin();
            bindEvent.bindLogin();
        },
        mounted: function () {
            viewModel.keyboard();
        }
    };
    // [2.4] 函数调用
    $(function () {
        index.init();
        index.mounted();
    });
})(jQuery);
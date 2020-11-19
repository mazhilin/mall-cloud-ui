// 定义数据缓冲
const cache = {
    web_view_user: 'adminUser',
    web_view_menu: 'menuList',
    web_view_token: 'web_login_token',
};
const utils = {
    //baseUrl: 'http://47.104.133.96/shaker_test',
    passportBaseUrl: 'http://127.0.0.1:9001/passport',
    consoleBaseUrl: 'http://127.0.0.1:9002/console',

    nickname: function () {
        return window.localStorage.getItem('nickname');
    },
    updateBy: function () {
        return window.localStorage.getItem('updateBy');
    },
    isChecked: function () {
        let token = window.localStorage.getItem(cache.web_view_token);
        if (token) {
            return token;
        } else {
            return "";
        }
    },
    //baseUrl: '',
    //获取url链接参数
    getDeliverPage: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return '';
    },
    //[4]避免显示undefined
    excludeUndefined(value) {
        if (value === 0) {
            return 0;
        }
        if ((value == undefined || value == "") && value != 0) {
            return "";
        } else {
            return value;
        }
        if ((typeof (value) == "undefined" || typeof (value) == null || typeof (value) == "number")) {
            return '';
        } else {
            return value;
        }
    },
    // 转换成2018年9月27号 11:00:00
    formatTime: function (t) {
        var date = new Date(t);
        var y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = ('0' + date.getHours()).slice(-2),
            mi = ('0' + date.getMinutes()).slice(-2),
            s = ('0' + date.getSeconds()).slice(-2);
        return (y + '年' + m + '月' + d + '日' + h + ':' + mi + ':' + s)
    },
    formatTime2: function (t) {
        var date = new Date(t);
        var y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = ('0' + date.getHours()).slice(-2),
            mi = ('0' + date.getMinutes()).slice(-2),
            s = ('0' + date.getSeconds()).slice(-2);
        return (y + '-' + m + '-'+ d + ' ' + h + ':' + mi + ':' + s)
    },
    // 转换成2017-09-19
    format: function(date, format) {
        var A = Array();
        var currtime = new Date(date);
        A.push(currtime.getFullYear());
        A.push(('0' + (currtime.getMonth() + 1)).slice(-2));
        A.push(('0' + currtime.getDate()).slice(-2));
        return A.join(format || '-');
    },
    //2019-02-02 10:19:56
    //参数fmt "yyyy-MM-dd hh:mm:ss" 参数date 时间戳
    //参数fmt "yyyy-MM-dd EEE hh:mm:ss" 2019-02-19 星期二 14:04:30
    dateFtt: function (fmt, date) {
        if(date==undefined){
            return '';
        }else{
            var date = new Date(date);
        }
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //24小时
            "H+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //12小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
        }
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    //添加Cookie
    addCookie: function (name, value, expireHours) {
        var cookieString = name + "=" + escape(value) + "; path=/";
        //判断是否设置过期时间
        if(expireHours > 0) {
            var date = new Date();
            date.setTime(date.getTime() + expireHours * 3600 * 1000);
            cookieString = cookieString + ";expires=" + date.toGMTString();
        }
        document.cookie = cookieString;
    },
    //获取Cookie
    getCookie: function (name) {
        var strcookie = document.cookie;
        var arrcookie = strcookie.split("; ");
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) return unescape(arr[1]);
        }
        return null;
    },
    //删除Cookie
    delCookie: function (name) {
        this.addCookie(name, 1, -1)
    },
    //判断对象是否为空
    isEmpty: function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    },
    isNotEmpty: function (val) {
        if (null != val && undefined != val && '' != val) {
            return val;
        }
        return null;
    },
    ajax: function (url, data, successCb, errorCb) {
        layui.use('jquery', function () {
            var $ = layui.$;
            $.getJSON(url, data || {}, successCb);
        })

    },
    // 删除对象中的某些属性
    delKeys: function (obj, keys) {
        keys.map(function (key) {
            delete obj[key];
        })
        return obj;
    },
    optionNotEmpty: function (obj) {
        var flag = true;
        for (var key in obj) {
            if (obj[key]) {
                flag = false;
                return flag;
            }
        }
    },
    closeCurropen: function() {
        // 在当前iframe => 关闭当前iframe
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    }
}
// 关闭当前打开iframe
$('body').on('click', '#closeOpen', function() {
    utils.closeCurropen();
})
$.ajaxSettings.beforeSend = function(request, xhr) {
    if(xhr.url.indexOf('login') <= -1){
        var token = utils.isChecked();
        request.setRequestHeader('web_login_token', token)
    }else{
        console.log(request);
    }
}
function ListPage(options) {
    this.page = options.page || 10;
    this.rows = options.rows || 1;
    this.listSize = options.listSize || 20;
    this.url = options.url;
    this.listName = options.listName || 'dataList';
    this.vm = options.vm;
    this.callback = options.callback || '';
    this.ajax();
}
ListPage.prototype = {
    ajax: function () {
        var _this = this;
        layui.use(['jquery', 'layer'], function() {
            var $ = layui.$;
            $.ajax({
                url: _this.url,
                data: {
                    page: _this.page,
                    rows: _this.rows
                },
                async: false
            }).done(function(res) {
                if(res.code == 200){
                    _this.listSize = res.result.listSize;
                    _this.vm.table = res.result.obj[_this.listName];
                    if(typeof _this.callback == 'function') _this.callback(_this);
                    // if(_this.page == 1){
                    _this.init(_this.vm.table);
                    // }

                }else if(res.code == '500404'){
                    top.location.href = utils.baseUrl + '/manager/view/login.html-b'
                }else{
                    layer.msg(res.message);

                }
            }).fail(function(xhr) {
                console.log(xhr);
            })
        })
    },
    init: function(datalist) {
        var _this = this;
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            laypage.render({
                elem: 'list-page',
                count: _this.listSize,
                limit: _this.rows,
                curr: _this.page,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (obj, first) {
                    console.log(obj)
                    _this.page = obj.curr;
                    if(!first){
                        _this.ajax();
                    }
                }
            })
        })
    }
}





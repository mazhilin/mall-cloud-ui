//[1]时间处理公共函数
function dateFormat(fmt, date) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//[2]日期+时间格式化显示
function formatDateTime(value) {
    if (value != null && '' != value && value != undefined) {
        var requestDateTime = new Date(value);
        return dateFormat("yyyy-MM-dd hh:mm:ss", requestDateTime);//直接调用公共JS里面的时间类处理的办法
    } else {
        return '';
    }
}

//[3]日期格式化显示
function formatDate(value) {
    if (value != null && '' != value && value != undefined) {
        var requestDate = new Date(value);
        return dateFormat("yyyyMMdd", requestDate);//直接调用公共JS里面的时间类处理的办法
    } else {
        return '';
    }
}

//[4]避免显示undefined
function excludeUndefined(value) {
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
}

//[5]关闭
function removeIframe() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

//[6]文件上传插件
function upload() {
    var fp = document.getElementById("file").value;
    //为了避免转义反斜杠出问题，这里将对其进行转换
    var re = /(\\+)/g;
    var fn = fp.replace(re, "#");
    //对路径字符串进行剪切截取
    var one = fn.split("#");
    //获取数组中最后一个，即文件名
    var two = one[one.length - 1];
    //再对文件名进行截取，以取得后缀名
    var three = two.split(".");
    //获取截取的最后一个字符串，即为后缀名
    var last = three[three.length - 1];
    last = last.toLowerCase();

    if (last != 'png' && last != 'jpg'
        && last != 'PNG' && last != 'JPG') {
        layer.alert("请上传png、jpg文件！");
        return;
    }
    $.ajaxFileUpload({
        url: `http://${window.location.host}/file/upload`, //需要链接到服务器地址
        secureuri: false,
        fileElementId: "file", //文件选择框的id属性
        dataType: 'text', //服务器返回的格式，可以是json
        data: {"folder": "/courseImg"},
        success: function (rs) {
            var json = $.parseJSON(rs.replace(/<.*?>/ig, ""));
            ;
            console.log(json);
            if (json.code == "200") {
                var url = "http://lanjingapp.qtvnews.com/qdrat/file/downFile/" + json.result.id + "/image";
                $('#head_pic').val(json.result.id);
                $('#head_pic1').html("");
                $('#head_pic1').append("<img src='" + url + "' width='100' height='100'>");
                $('#head_pic1').val(url);
            } else {
                alert('失败');
            }
        },
        error: function (data, status, e) //相当于java中catch语句块的用法
        {
            alert('失败');

        }
    });
}

// [7]初始化富文本
function getQueryString(name) {//取URL参数  你要得到userid 就传userid
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        var QueryString = unescape(r[2]);
        return QueryString;
    }
    return null;
}

// [8] 校验手机号
function checkMobile(sMobile) {
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
        alert("不是完整的11位手机号或者正确的手机号前七位");
        return false;
    }
}

//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function identityCodeValid(idcode) {
    // 加权因子
    var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var code = idcode + "";
    var last = idcode[17];//最后一个
    var seventeen = code.substring(0, 17);
    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for (var i = 0; i < len; i++) {
        num = num + arr[i] * weight_factor[i];
    }
    // 获取余数
    var resisue = num % 11;
    var last_no = check_code[resisue];
    // 格式的正则
    // 正则思路
    /*
      第一位不可能是0
      第二位到第六位可以是0-9
      第七位到第十位是年份，所以七八位为19或者20
      十一位和十二位是月份，这两位是01-12之间的数值
      十三位和十四位是日期，是从01-31之间的数值
      十五，十六，十七都是数字0-9
      十八位可能是数字0-9，也可能是X
      */
    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
    // 判断格式是否正确
    var format = idcard_patter.test(idcode);
    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format ? true : false;
}

//校检是否为空（包含empty String、undefined、null）
function isNotEmpty(val) {
    if (val != null && val != '' && val != undefined) {
        return true
    }
    return false;
}

function getHttpURL() {
    //域名获取
    var httpUrl = window.location.host;
    if (httpUrl == "zhibo.tvplaza.cn:18080" || httpUrl == "localhost:8080") {
        httpUrl = "http://zhibo.tvplaza.cn:18080";
    } else {
        httpUrl = "http://lanjingapp.qtvnews.com";
    }
    return httpUrl;
}

/*##############Powered By Marklin  2019-02-27  封装校验正则表达式函数##############*/
/**全局校验正则表达式函数*/
function checkGlobalRegular(format, number) {
    return format.test(number);
}

/*##############Powered By Marklin  2019-03-19  封装全局刷新页面函数##############*/
/**刷新当前页面*/
function refreshPage() {
    let currentUrl = location.href;
    let urls = currentUrl.split("?");
    this.location.href = urls[0] + "?page=1";
}



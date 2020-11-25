// [2.1] 定义基础常量
const constant = {};
// [2.2] 定义接口API
const api = {
    /**分页查询用户列表*/
    save: '/api/console/role/save',
};
$(function () {
    $("#form-role-add").validate({
        rules: {
            name: {
                required: true,
            },
            code: {
                required: true,
            },
            message: {
                required: true,
            }
        },
        onkeyup: false,
        focusCleanup: true,
        success: "valid",
        submitHandler: function (form) {
            save();
        }
    });
});

//保存提交表单
function save() {
    let load = layer.load(1, {
        shade: [0.1, '#fff']
    });
    let valid = $('#form-role-add').valid();
    if (!valid) {
        alert("请输入必填项");
        return;
    }
    let form = document.getElementById('form-role-add');
    let formdata = new FormData(form);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: utils.consoleBaseUrl + api.save,
        data: formdata,
        cache: false,
        async: false,
        contentType: false,
        processData: false,
        success: function (data) {
            layer.close(load);
            console.log(data);//打印服务端返回的数据(调试用)
            if (200 == data.code) {
                layer.alert("保存提交成功");
                parent.searchList();
                removeIframe();
            } else {
                layer.alert(data.message);
            }
            ;
        }
    });
}

function removeIframe() {
    let index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

$(".textarea").Huitextarealength({
    minlength: 0,
    maxlength: 100
});



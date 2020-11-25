// [2.1] 定义基础常量
const constant = {};
// [2.2] 定义接口API
const api = {
    /**分页查询用户列表*/
    detail: '/api/console/role/detail',
    edit: '/api/console/role/edit'
};

let id = utils.getDeliverPage("id");
$(function () {
    //获取html标签内容复制到对应文本
    if (id != null && id != "") {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: utils.consoleBaseUrl + api.detail+"?id="+id,
            async: false,
            contentType: false,
            processData: false,
            cache: false,
            success: function (data) {
                if (200 == data.code) {
                    let role = data.result.role;
                    $('#id').val(role.id);
                    $('#name').val(role.name);
                    $('#code').val(role.code);
                    $('#message').val(role.message);
                    $('#scope').val(role.scope);
                    $('#remark').val(role.remark);
                    $('.textarea-length').html(role.remark.length);
                } else {
                    layer.alert(data.message);
                }
            }
        });
    }
    $("#form-role-edit").validate({
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
            edit();
        }
    });
});

//保存提交表单
function edit() {
    let load = layer.load(1, {
        shade: [0.1, '#fff']
    });
    let valid = $('#form-role-edit').valid();
    if (!valid) {
        alert("请输入必填项");
        return;
    }
    let form = document.getElementById('form-role-edit');
    let formdata = new FormData(form);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: utils.consoleBaseUrl + api.edit,
        data: formdata,
        cache: false,
        async: false,
        contentType: false,
        processData: false,
        success: function (data) {
            layer.close(load);
            console.log(data);//打印服务端返回的数据(调试用)
            if (data.code == 200) {
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
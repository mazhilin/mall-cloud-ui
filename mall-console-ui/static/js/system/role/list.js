// [2.1] 定义基础常量
const constant = {};
// [2.2] 定义接口API
const api = {
    /**分页查询用户列表*/
    list: '/api/console/role/list',
};

// [2.3] 封装页面查询事件按钮
function searchList() {
    let pageSize = $('#pageSize').val();
    let pageLimit = $("#pageLimit").val();
    let name = encodeURI($("#name").val());
    let status = $("#status").val();
    let scope = encodeURI(encodeURI($("#scope").val()));
    window.location.href = "list.html?&pageSize=" + pageSize +
        '&pageLimit=' + pageLimit +
        '&name=' + name +
        '&status=' + status +
        '&scope=' + scope;
}

/**定义全局变量-laypage*/
let laypage = layui.laypage;
let userId = 0;

/**封装全局函数*/
$(function () {
    /**调用keydown函数*/
    operation();
    /**初始化加载学生管理数据*/
    loadPageResultList();
});

// [2.3] 封装页面复选框事件按钮
function checkboxHandler() {
    $("th input[type='checkbox']").on('click', function () {
        $("th input[type='checkbox']").prop("checked", false);
        $(this).prop("checked", true);
        userId = $(this).val();
    })
}

/**封装刷新页面数据函数*/
function refreshPage() {
    let currentUrl = location.href;
    let urls = currentUrl.split("?");
    this.location.href = urls[0] + "?pageSize=1";
}


/**封装刷新页面数据函数*/
function refresh() {
    $("#status").val("");
    $("#scope").val("");
    $("#name").val("");
    searchList();
}


/**封装全局keydown函数事件*/
function operation() {
    $("body").keydown(function () {
        if (event.keyCode !== "13") {
            return;
        }
        // language=JQuery-CSS
        $("#searchButton").click()
    });
}


function  loadPageResultList() {
    YDUI.dialog.loading.open('正在加载....');
    if (utils.getDeliverPage("pageSize") != null) {
        $('#pageSize').val(utils.getDeliverPage("pageSize"));
    }
    if (utils.getDeliverPage("pageLimit") != null) {
        $('#pageLimit').val(utils.getDeliverPage("pageLimit"));
    }
    if (utils.getDeliverPage("name") != null) {
        $('#name').val(utils.getDeliverPage("name"));
    }
    let pageSize = $("#pageSize").val();
    let pageLimit = $("#pageLimit").val();
    let status = utils.getDeliverPage("status");
    let name = utils.getDeliverPage("name");
    let scope = utils.getDeliverPage("scope");
    $("#bodyHtml").empty();
    $.post(utils.consoleBaseUrl + api.list,
        {
            pageSize: pageSize,
            pageLimit: pageLimit,
            status: status,
            name: name,
            scope: scope
        }, function (data) {
            if (200 == data.code) {
                let html = "";
                let resultList = data.result.list;
                let orderSortNum = 0;
                if (resultList.length > 0) {
                    $.each(resultList, function (index, item) {
                        orderSortNum = (pageSize - 1) * pageLimit + index + 1;
                        html += `<tr class="text-c"><td><input name="param_ids" value="${item.id}"  data-attribute="${item.name}" data-id="${item.id}" data-status="${item.status}" type="checkbox"></td>`;
                        html += '<td class="list-index">' + utils.excludeUndefined(orderSortNum) + '</td>';
                        html += '<th width="">' + utils.excludeUndefined(item.name) + '</th>';
                        html += '<th width="">' + utils.excludeUndefined(item.code) + '</th>';
                        html += '<th width="">' + utils.excludeUndefined(item.message) + '</th>';
                        if (0 == item.scope) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">后端平台</span></td>';
                        } else if (1 == item.scope) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">APP平台</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-defaunt radius">SMR平台</span></td>';
                        }
                        if (0 == item.status) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">禁用</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">启用</span></td>';
                        }
                        html += '<td class="f-14 td-manage">';
                        if (item.status == 1) {
                            html += '<a style="text-decoration:none" onClick="stop( this ,\'' + item.id + '\',\'' + item.status + '\')" href="javascript:;" title="禁用"><i class="Hui-iconfont">&#xe605;</i></a>';
                        } else {
                            html += '<a style="text-decoration:none" onClick="open( this ,\'' + item.id + '\',\'' + item.status + '\')" href="javascript:;" title="启用"><i class="Hui-iconfont">&#xe60e;</i></a>';
                        }
                        html += '&ensp;<a style="text-decoration:none" onClick="edit(this,\'' + item.id + '\')" href="javascript:;" title="编辑"><i class="Hui-iconfont">&#xe60c;</i></a>';
                        html += '&ensp;<a style="text-decoration:none" onClick="reset(this,\'' + item.id + '\')" href="javascript:;" title="修改"><i class="Hui-iconfont">&#xe63f;</i></a>';
                        html += '&ensp;<a style="text-decoration:none" onClick="remove(this,\'' + item.id + '\')" href="javascript:;" title="删除"><i class="Hui-iconfont">&#xe609;</i></a>';
                        html += '</td></tr>';
                    });
                    laypage.render({
                        elem: 'pageFooter',
                        limit: 10,
                        curr: pageSize,
                        limits: [10, 20, 30, 40, 50],
                        layout: ["limit", 'prev', 'page', 'next', "skip"],
                        count: data.result.pageCount, //数据总数，从服务端得到
                        jump: function (obj, first) {
                            //obj包含了当前分页的所有参数，比如：
                            //得到当前页，以便向服务端请求对应页的数据。
                            console.log(obj.limit); //得到每页显示的条数
                            $("#pageLimit").val(obj.limit);
                            if (!first) {
                                $("body").attr("data-type", obj.curr);
                                this.loadPageResultList(obj.curr, obj.limit);
                            }
                        }
                    });
                }
                //共有数据
                $("#pageCount").html(data.result.pageCount);
                //显示本页共多少条
                $("#allData").html(data.result.list.length);
                //显示开始条数
                let startData = (pageSize - 1) * pageLimit + 1;
                $("#startData").html(startData);
                //显示结束条数
                let endData = startData + data.result.list.length - 1;
                $("#endData").html(endData);
                $("#bodyHtml").append(html);
                checkboxHandler();
                YDUI.dialog.loading.close();
            } else {
                YDUI.dialog.loading.close();
                layer.alert(data.message);
            }
        });
}


function reloadPageResultList(pageSize, pageLimit) {
    YDUI.dialog.loading.open('正在加载....');
    let status = $('#status').val();
    let name = $('#name').val();
    let scope = $('#scope').val();
    $("#bodyHtml").empty();
    $.post(utils.consoleBaseUrl + api.list,
        {
            pageSize: pageSize,
            pageLimit: pageLimit,
            status: status,
            name: name,
            scope: scope
        }, function (data) {
            if (200 == data.code) {
                let html = "";
                let resultList = data.result.list;
                let orderSortNum = 0;
                if (resultList.length > 0) {
                    $.each(resultList, function (index, item) {
                        orderSortNum = (pageSize - 1) * pageLimit + index + 1;
                        html += `<tr class="text-c"><td><input name="param_ids" value="${item.id}"  data-attribute="${item.name}" data-id="${item.id}" data-status="${item.status}" type="checkbox"></td>`;
                        html += '<td class="list-index">' + utils.excludeUndefined(orderSortNum) + '</td>';
                        html += '<th width="">' + utils.excludeUndefined(item.name) + '</th>';
                        html += '<th width="">' + utils.excludeUndefined(item.code) + '</th>';
                        html += '<th width="">' + utils.excludeUndefined(item.message) + '</th>';
                        if (0 == item.scope) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">后端平台</span></td>';
                        } else if (1 == item.scope) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">APP平台</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-defaunt radius">SMR平台</span></td>';
                        }
                        if (0 == item.status) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">禁用</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">启用</span></td>';
                        }
                        html += '<td class="f-14 td-manage">';
                        if (item.status == 1) {
                            html += '<a style="text-decoration:none" onClick="stop( this ,\'' + item.id + '\',\'' + item.status + '\')" href="javascript:;" title="禁用"><i class="Hui-iconfont">&#xe605;</i></a>';
                        } else {
                            html += '<a style="text-decoration:none" onClick="open( this ,\'' + item.id + '\',\'' + item.status + '\')" href="javascript:;" title="启用"><i class="Hui-iconfont">&#xe60e;</i></a>';
                        }
                        html += '<a style="text-decoration:none" onClick="edit(this,\'' + item.id + '\')" href="javascript:;" title="编辑"><i class="Hui-iconfont">&#xe60c;</i></a>';
                        html += '&ensp;<a style="text-decoration:none" onClick="reset(this,\'' + item.id + '\')" href="javascript:;" title="修改"><i class="Hui-iconfont">&#xe63f;</i></a>';
                        html += '<a style="text-decoration:none" onClick="remove(this,\'' + item.id + '\')" href="javascript:;" title="删除"><i class="Hui-iconfont">&#xe609;</i></a>';
                        html += '</td></tr>';
                    });
                }
                //共有数据
                $("#pageCount").html(data.result.pageCount);
                //显示本页共多少条
                $("#allData").html(data.result.list.length);
                //显示开始条数
                let startData = (pageSize - 1) * pageLimit + 1;
                $("#startData").html(startData);
                //显示结束条数
                let endData = startData + data.result.list.length - 1;
                $("#endData").html(endData);
                $("#bodyHtml").append(html);
                checkboxHandler();
                YDUI.dialog.loading.close();
            } else {
                YDUI.dialog.loading.close();
                layer.alert(data.message);
            }
        });
}



/*添加*/
function add(title, url, w, h) {
    layer_show(title, url, w, h);
}

/*编辑*/
function edit(obj, id) {
    let timestamp = Date.parse(new Date());
    let url = "edit.html?id=" + id + "&v=" + timestamp;
    this.add("编辑 | 系统用户", url, '', 490);
}


function open(obj, id) {
    let timestamp = Date.parse(new Date());
    let url = "edit.html?id=" + id + "&v=" + timestamp;
    this.add("编辑 | 系统用户", url, '', 490);
}

function stop(obj, id) {
    let timestamp = Date.parse(new Date());
    let url = "edit.html?id=" + id + "&v=" + timestamp;
    this.add("编辑 | 系统用户", url, '', 490);
}





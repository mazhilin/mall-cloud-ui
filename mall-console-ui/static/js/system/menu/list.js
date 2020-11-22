// [2.1] 定义基础常量
const constant = {
    web_view_menu_tab: '#tab-menu',
};
// [2.2] 定义接口API
const api = {
    /**分页查询用户列表*/
    category: '/api/console/menu/category',
    /**分页查询用户列表*/
    list: '/api/console/menu/list',
};

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
    $("#menuAuth").val("");
    $("#name").val("");
    searchList();
}

/**[1].封装全局函数*/
$(function () {
    /**加载页面选项卡信息*/
    loadMenuTabFrame();
    /**加载选项卡信息*/
    loadPageTabCategory();
});

/**定义全局变量-laypage*/
let laypage = layui.laypage;
/**定义全局变量-categoryIds*/
let categoryIds = null;
let initCategoryId=null;

/**初始化加载页面选项卡*/
function loadMenuTabFrame() {
    !function ($) {
        $.fn.Huitabs = function (options) {
            let defaults = {
                tabBars: '.tabBars span',
                tabCon: ".tabCon",
                className: "current",
                tabEvent: "click",
                index: 0,
            };
            let optionTab = $.extend(defaults, options);
            this.each(function () {
                /*初始化选项卡时执行*/
                let option = $(this);
                option.find(optionTab.tabBars).removeClass(optionTab.className);
                option.find(optionTab.tabBars).eq(optionTab.index).addClass(optionTab.className);
                /*选中选项卡时执行*/
                option.find(optionTab.tabBars).on(optionTab.tabEvent, function () {
                    option.find(optionTab.tabBars).removeClass(optionTab.className);
                    //销毁分页插件
                    $("#pageFooter").remove();
                    $(".page-footer").append('<div id = "pageFooter" ></div>');
                    //清空查询条件
                    $(this).addClass(optionTab.className);
                    let index = option.find(optionTab.tabBars).index(this);
                    // 调用加载数据列表
                    loadTabResultList(option.find(optionTab.tabBars).eq(index).attr("data-menuId"));
                });
            });
        }
    }(window.jQuery);
}

/**依据选中的菜单栏目查询列表数据*/
function loadTabResultList(selectOne) {
    if (categoryIds != null) {
        $.each(categoryIds, function (index, item) {
            if (item.id == selectOne) {
                $("#categoryId").val(item.id);
                $("#categoryName").val(item.name);
                loadTabPageResultList(1, item.id);
            }
        });
    }
}

/**切换选项卡加载页面列表数据*/
function loadTabPageResultList(pageSize, categoryId) {
    YDUI.dialog.loading.open('正在加载....');
    let pageLimit = $("#pageLimit").val();
    $("#bodyHtml").empty();
    $.post(utils.consoleBaseUrl + api.list, {
        pageSize: pageSize,
        pageLimit: pageLimit,
        categoryId: categoryId
    }, function (data) {
        if (200 == data.code) {
            let html = "";
            let resultList = data.result.list;
            if (resultList.length > 0) {
                $.each(resultList, function (index, item) {
                    let orderSortNum = (pageSize - 1) * pageLimit + index + 1;
                    html += `<tr class="text-c"><td><input name="param_ids" value="${item.id}"  data-attribute="${item.name}" data-id="${item.id}" data-status="${item.status}" type="checkbox"></td>`;
                    html += '<td class="list-index">' + orderSortNum + '</td>';
                    html += '<th width="">' + utils.excludeUndefined(item.name) + '</th>';
                    html += '<th width="">' + utils.excludeUndefined(item.code) + '</th>';
                    if (1 == item.type) {
                        html += '<td class="td-status"><span class="label label-defaunt radius">菜单</span></td>';
                    } else {
                        html += '<td class="td-status"><span class="label label-success radius">目录</span></td>';
                    }
                    html += '<th width="">' + utils.excludeUndefined(item.event) + '</th>';
                    if (0 == item.isInnerMenu) {
                        html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                    } else {
                        html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
                    }
                    if (0 == item.isShowMenu) {
                        html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                    } else {
                        html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
                    }
                    if (0 == item.isDelete) {
                        html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                    } else {
                        html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
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
                            // 构建分页查询数据
                            buildPageResultList(obj.curr, obj.limit);
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


/**初始化加载类别*/
function loadPageTabCategory() {
    YDUI.dialog.loading.open('正在加载....');
    $.post(utils.consoleBaseUrl + api.category, function (data) {
        if (200 == data.code) {
            let html = "";
            let resultList = data.result.list;
            if (resultList.length > 0) {
                categoryIds = resultList;
                initCategoryId = $("#categoryId").val();
                let initIndex = 0;
                $.each(resultList, function (index, item) {
                    if (index == 0) {
                        $("#categoryId").val(item.id);
                        $("#categoryName").val(item.name);
                    }
                    html = '<span data-menuId="' + item.id + '" >' + item.name + '</span>';
                    $("#tabBar-menu").append(html);
                    if (initCategoryId != null && initCategoryId !== '' && initCategoryId !== undefined) {
                        if (initCategoryId == item.id) {
                            initIndex = index;
                        }
                    }
                });
                $('.skin-minimal input').iCheck({
                    checkboxClass: 'icheckbox-blue',
                    radioClass: 'iradio-blue',
                    increaseArea: '20%'
                });
                $(constant.web_view_menu_tab).Huitabs({
                    index: initIndex
                });
                $("#bodyHtml").empty();
                loadPageResultList();
                YDUI.dialog.loading.close();
            }
        }else {
            YDUI.dialog.loading.close();
            layer.alert(data.message);
        }
    });
}

/**初始化加载列表数据*/
function loadPageResultList() {
    let pageSize = 1;
    let pageLimit = $("#pageLimit").val();
    let categoryId = $('#categoryId').val();
    YDUI.dialog.loading.open('正在加载....');
    $("#bodyHtml").empty();
    $.post(utils.consoleBaseUrl + api.list, {
            pageSize: pageSize,
            pageLimit: pageLimit,
            categoryId: categoryId
        }, function (data) {
            if (200 == data.code) {
                let html = "";
                let resultList = data.result.list;
                if (resultList.length > 0) {
                    $.each(resultList, function (index, item) {
                        let orderSortNum = (pageSize - 1) * pageLimit + index + 1;
                        html += `<tr class="text-c"><td><input name="param_ids" value="${item.id}"  data-attribute="${item.name}" data-id="${item.id}" data-status="${item.status}" type="checkbox"></td>`;
                        html += '<td class="list-index">' + orderSortNum + '</td>';
                        html += '<th width="">' + utils.excludeUndefined(item.name) + '</th>';
                        html += '<th width="">' + utils.excludeUndefined(item.code) + '</th>';
                        if (1 == item.type) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">菜单</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">目录</span></td>';
                        }
                        html += '<th width="">' + utils.excludeUndefined(item.event) + '</th>';
                        if (0 == item.isInnerMenu) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
                        }
                        if (0 == item.isShowMenu) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
                        }
                        if (0 == item.isDelete) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
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
                                // 构建分页查询数据
                                buildPageResultList(obj.curr, obj.limit);
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

function buildPageResultList(pageSize, pageLimit) {
    YDUI.dialog.loading.open('正在加载....');
    let categoryId = $('#categoryId').val();
    let status = utils.getDeliverPage("status");
    let name = utils.getDeliverPage("name");
    let scope = utils.getDeliverPage("scope");
    let menuAuth = utils.getDeliverPage("menuAuth");
    $("#bodyHtml").empty();
    $.post(utils.consoleBaseUrl + api.list,
        {
            pageSize: pageSize,
            pageLimit: pageLimit,
            categoryId: categoryId,
            status: status,
            name: name,
            scope: scope,
            menuAuth: menuAuth
        }, function (data) {
            if (200 == data.code) {
                YDUI.dialog.loading.open('正在加载....');
                let html = "";
                let resultList = data.result.list;
                if (resultList.length > 0) {
                    $.each(resultList, function (index, item) {
                        let orderSortNum = (pageSize - 1) * pageLimit + index + 1;
                        html += `<tr class="text-c"><td><input name="param_ids" value="${item.id}"  data-attribute="${item.name}" data-id="${item.id}" data-status="${item.status}" type="checkbox"></td>`;
                        html += '<td class="list-index">' + orderSortNum + '</td>';
                        html += '<th width="">' + utils.excludeUndefined(item.name) + '</th>';
                        html += '<th width="">' + utils.excludeUndefined(item.code) + '</th>';
                        if (1 == item.type) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">菜单</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">目录</span></td>';
                        }
                        html += '<th width="">' + utils.excludeUndefined(item.event) + '</th>';
                        if (0 == item.isInnerMenu) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
                        }
                        if (0 == item.isShowMenu) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
                        }
                        if (0 == item.isDelete) {
                            html += '<td class="td-status"><span class="label label-defaunt radius">否</span></td>';
                        } else {
                            html += '<td class="td-status"><span class="label label-success radius">是</span></td>';
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

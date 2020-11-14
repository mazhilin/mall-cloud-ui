/**[1].封装全局函数*/
$(function () {
    /**初始化加载客户详情信息*/
    loadCustomerUserDetail();
    /**加载页面选项卡信息*/
    loadPageTabFrame();
    /**加载选项卡信息*/
    loadPageTabCategory();
});

/**定义全局变量-laypage*/
let laypage = layui.laypage;
/**定义全局变量-categoryIds*/
let categoryIds = null;
let oldIndexData = 0;
let paramIndex = 0;
let customerId = getQueryString("id");

/**[2].获取客户数据详情信息*/
function loadCustomerUserDetail() {
    $.ajax({
        type: 'GET',
        url: '/fansi/customerUser/achieveCustomerUserDetail?id=' + customerId,
        dataType: 'json',
        error: function (data) {
            console.error(data);
            if (data.responseText === "logout") {
                top.location.href = "/fansi?v=0.01";
            }
        },
        success: function (data) {
            if (data === "logout") {
                window.location.href = "/fansi?v=0.01";
            } else {
                if (data.code === 200) {
                    console.log(data.result);
                    let customerUser = data.result.customerUser;
                    $("#headPic").html('<ul class="cl portfolio-area"><li class="item" style="margin-right: 0px; margin-top: 0px;"><div class="picbox"><img src="' + customerUser.headPic + '"></div></li></ul>');
                    $("#userName").html(customerUser.userName);
                    $("#sex").html(customerUser.sex);
                    $("#sourceType").html(customerUser.sourceType);
                    $("#studentClass").html(customerUser.studentClass);
                    $("#phone").html(customerUser.phone);
                    $("#studentName").html(customerUser.studentName);
                    $("#organizationName").html(customerUser.organizationName);
                    $("#demand").html(customerUser.demand);
                    $("#courseConsultant").html(customerUser.courseConsultant);
                    /*创建人*/
                    $("#createBy").html(customerUser.createBy);
                    /*创建时间*/
                    $("#createTime").html(formatDateTime(customerUser.createTime));
                    /*修改人*/
                    $("#updateBy").html(customerUser.updateBy);
                    /*修改时间*/
                    $("#updateTime").html(formatDateTime(customerUser.updateTime));
                }
            }
        }
    });
}

/**初始化加载页面选项卡*/
function loadPageTabFrame() {
    !function ($) {
        $.fn.Huitabs = function (options) {
            let defaults = {
                tabBars: '.tabBars span',
                tabCon: ".tabCon",
                className: "current",
                tabEvent: "click",
                index: 0,
            }
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
                    loadTabResultList(option.find(optionTab.tabBars).eq(index).attr("data-classifyId"));
                });
            });
        }
    }(window.jQuery);
}

/**初始化加载类别*/
function loadPageTabCategory() {
    //[2] 获取菜单分类
    $.ajax({
        type: 'GET',
        url: '/fansi/customerUser/findStudentsCategoryList?customerId='+ customerId,
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.code === 200) {
                debugger;
                let tabBarHtml = "";
                let resultList = data.result.resultList;
                if (resultList.length > 0) {
                    categoryIds = resultList;
                    let initCategoryId = $("#categoryId").val();
                    let initIndex = 0;
                    $.each(resultList, function (index, item) {
                        if (index === 0) {
                            $("#categoryId").val(item.id);
                            $("#categoryName").val(item.studentName);
                        }
                        tabBarHtml = '<span data-classifyId="' + item.id + '" >' + item.studentName + '</span>';
                        $("#tabBar-student").append(tabBarHtml);
                        if (initCategoryId != null && initCategoryId !== '' && initCategoryId !== undefined) {
                            if (initCategoryId === item.id) {
                                initIndex = index;
                            }
                        }
                    });
                    $('.skin-minimal input').iCheck({
                        checkboxClass: 'icheckbox-blue',
                        radioClass: 'iradio-blue',
                        increaseArea: '20%'
                    });
                    $("#tab-student").Huitabs({
                        index: initIndex
                    });
                    $("#bodyHtml").empty();
                    //加载菜单分类列表数据
                }
            } else {
                layer.msg(data.message, {icon: 5, time: 1000});
            }
        },
        error: function (data) {
            layer.msg("加载孩子选项卡列表失败!", {icon: 5, time: 1000});
        },
    });
}

/**依据选中的菜单栏目查询列表数据*/
function loadTabResultList(selectOne) {
    if (categoryIds != null) {
        $.each(categoryIds, function (index, item) {
            if (item.id === selectOne) {
                $("#categoryId").val(item.id);
                $("#categoryName").val(item.studentName);
                loadTabPageResultList(1, item.id);
            }
        });
    }
}


/**切换选项卡加载页面列表数据*/
function loadTabPageResultList(pageSize, categoryId) {
    paramIndex = "";
    paramId = "";
    oldIndexData = "";
    let pageLimit = $("#pageLimit").val();
    $("#bodyHtml").empty();
    $.ajax({
        type: 'POST',
        url: '/turbo/customerUser/findStudentsFollowList?pageSize=' + pageSize
            + '&pageLimit=' + pageLimit
            + '&studentId=' + categoryId
        ,
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                let html = "";
                let resultList = data.result.resultList;
                if (resultList.length > 0) {
                    $.each(resultList, function (index, item) {
                        let orderSortNum = (pageSize - 1) * pageLimit + index + 1;
                        html += '<tr class="text-c">';
                        html += '<th class="list-index">' + orderSortNum + '</th>';
                        /*表主键id*/
                        html += '<th width="" hidden="hidden">' + excludeUndefined(item.id) + '</th>';
                        /*跟进人*/
                        html += '<th width="">' + excludeUndefined(item.systemUserName) + '</th>';
                        /*被跟进客户*/
                        html += '<th width="">' + excludeUndefined(item.customerName) + '</th>';
                        /*跟进记录*/
                        html += '<th width="">' + excludeUndefined(item.mark) + '</th>';
                        /*跟进状态：0-体验 1-邀约 2-跟进 3-初级成交 4-申请跟进 5-中级成交 6- 高级成交 其他-后台默认成交*/
                        switch (item.followType) {
                            //0-体验
                            case  0:
                                html += '<td class="td-status"><span class="label label-success radius">体验</span></td>';
                                break;
                            //1-邀约
                            case  1:
                                html += '<td class="td-status"><span class="label label-primary radius">邀约</span></td>';
                                break;
                            //2-跟进
                            case  2:
                                html += '<td class="td-status"><span class="label label-primary radius">跟进</span></td>';
                                break;
                            //3-初级成交
                            case  3:
                                html += '<td class="td-status"><span class="label label-error radius">初级成交</span></td>';
                                break;
                            //4-申请跟进
                            case  4:
                                html += '<td class="td-status"><span class="label label-warning radius">申请跟进</span></td>';
                                break;
                            // 5-中级成交
                            case  5:
                                html += '<td class="td-status"><span class="label label-defaunt radius">中级成交</span></td>';
                                break;
                            //6- 高级成交
                            case  6:
                                html += '<td class="td-status"><span class="label label-defaunt radius">高级成交</span></td>';
                                break;
                            //后台创建- 默认成交
                            default:
                                html += '<td class="td-status"><span class="label label-defaunt radius">成交</span></td>';
                                break;
                        }
                        /**审核状态*/
                        switch (item.status) {
                            case 0:
                                html += '<td class="td-status"><span class="label label-defaunt radius">待审核</span></td>';
                                break;
                            case 1:
                                html += '<td class="td-status"><span class="label label-success radius">已审核</span></td>';
                                break;
                            case 2:
                                html += '<td class="td-status"><span class="label label-success radius">已驳回</span></td>';
                                break;
                            default:
                                html += '<td class="td-status"><span class="label label-success radius">未知</span></td>';
                                break;
                        }
                        /*菜单名称*/
                        html += '<th width="">' + crtTimeFtt(item.createTime) + '</th>';
                        html += '<th width="">' + excludeUndefined(followDay) + '</th>';
                        html += '</th></tr>';
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
                                $("body").attr("data-type", obj.curr)
                                //buildPageResultList(obj.curr, obj.limit, menuName, status);
                            }
                        }
                    });
                }
                //共有数据
                $("#totalCount").html(data.result.totalCount);
                //显示本页共多少条
                $("#allData").html(resultList.length);
                //显示开始条数
                let startData = (pageSize - 1) * pageLimit + 1;
                //显示结束条数
                let endData = startData + resultList.length - 1;
                $("#startData").html(startData);
                $("#endData").html(endData);
                $("#bodyHtml").append(html);
            }
        },
        error: function (data) {
            if (data.responseText === "logout") {
                top.location.href = "/turbo?v=0.01";
            }
            layer.msg("查询失败请，稍后重试！", {icon: 5, time: 1000});
        }
    });
}



/*
//父母业绩
function parent2(res) {
    let data = [52, 70, 40, 80, 55, 62, 55, 62, 29, 58, 43, 70];
/!*    if (res != undefined && res != null) {
        data = res;
    }*!/
    let selectYear = '2019年';
    let yunit = '万元';
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('parent'));
    // 指定图表的配置项和数据
    option = {
        tooltip: {
            formatter: function (param) {
                return selectYear + param.name + "<br>"
                    + param.marker + param.value + yunit + "<br>";
            }
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '12%',
            containLabel: true
        },
        xAxis: {
            name: '时间',
            nameTextStyle: {
                color: '#666'
            },
            type: 'category',
            boundaryGap: false,//坐标轴两边留白策略
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            splitLine: {//网线
                show: true,
                lineStyle: {
                    color: '#e6e6e6'
                }
            },
            axisLabel: {
                color: '#666'
            },
            axisLine: {
                lineStyle: {
                    color: '#adadad',
                    width: 1,
                }
            }
        },
        yAxis: {
            name: '万元',
            nameTextStyle: {
                color: '#666',
                padding: [3, 4, 0, 26]
            },
            type: 'value',
            min: 10,
            splitLine: {//网线
                show: true,
                lineStyle: {
                    color: '#e6e6e6'
                }
            },
            axisLabel: {
                color: '#666',
            },
            axisLine: {
                lineStyle: {
                    color: '#adadad',
                    width: 1,
                }
            }
        },
        series: [{
            data: data,
            type: 'line',
            smooth: true,//是否平滑曲线显示
            areaStyle: {
                color: 'rgba(118, 164, 174,.4)'
            },
            symbol: 'circle',//拐点样式
            symbolSize: 6,//拐点大小
            lineStyle: {
                normal: {
                    lineStyle: {
                        width: 1,//折线宽度
                        color: "#387c89",//折线颜色
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "#387c89",
                    borderColor: '#387c89'  // 线条颜色
                }
            },
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

/!*function getOrganization(areaId) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/fansi/organization/selectSchools?areaId=" + areaId,
        async: false,
        contentType: false,
        processData: false,
        cache: false,
        error: function (data) {
            window.location.href = "/fansi?v=0.01";
            return false;
        },
        success: function (data) {
            $("#organizationId").empty();
            $("#organizationId").append("<option value=''>请选择校区</option>");
            if (data.code == 200) {
                var list = data.result.mapList;
                if (list.length > 0) {
                    $.each(list, function (index, item) {
                        $("#organizationId").append("<option value='" + item.id + "'>" + item.organizationName + "</option>");
                    });
                }
            }
        }
    });
}*!/

/!*查询省市区等地区列表*!/
/!*function getDistrict(idName, level, pid) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/fansi/organization/organizationCity?level=" + level + "&pid=" + pid,
        async: false,
        contentType: false,
        processData: false,
        cache: false,
        error: function (data) {
            window.location.href = "/fansi?v=0.01";
            return false;
        },
        success: function (data) {
            console.log(pid);
            $("#" + idName + "").empty();
            if ("provinceId" == idName) {
                $("#" + idName + "").append("<option value=''>请选择省份</option>");
            } else if ("cityId" == idName) {
                $("#" + idName + "").append("<option value=''>请选择市</option>");
            } else if ("areaId" == idName) {
                $("#" + idName + "").append("<option value=''>请选择区</option>");
            } else {
                $("#" + idName + "").append("<option value=''>请选择</option>");
            }
            if (data.code == 200) {
                var list = data.result.mapList;
                if (list.length > 0) {
                    $.each(list, function (index, item) {
                        $("#" + idName + "").append("<option value='" + item.id + "'>" + item.name + "</option>");
                    });
                }
            }
        }
    });
}*!/

/!*function getParent() {
    $.get(`/fansi/home/get/parent?organizationId=${$("#organizationId").val()}&year=${$("#parentYear").val()}`, function (data) {
        if (data.code == 200) {
            $("#parent").parent().parent().find(".people").html(data.result.parent.people);
            $("#parent").parent().parent().find(".all").html(data.result.parent.all);
            $("#parent").parent().parent().find(".mouth").html(data.result.parent.mouth);
            parent2(data.result.parentList);
        } else {
            parent2();
        }
    });
}*!/

/!*function getStudentAndCoin() {
    $.get(`/fansi/home/get/studentAndCoin?organizationId=${$("#organizationId").val()}`, function (data) {
        if (data.code == 200) {
            studentNum(data.result.studentList);
            $(".student-count").html(data.result.studentAll);
            let all = data.result.coinAll;
            let userAll = data.result.userAll;
            let userCount = data.result.userCount;
            let customerAll = data.result.customerAll;
            let customerCount = data.result.customerCount;
            $(".fansi-all").html(all);
            console.log(`${userAll / all}%`);
            $(".userAll").css("width", `${userAll / all * 100}%`).parent().parent().find("span").text(userAll);
            $(".userCount").css("width", `${userCount / all * 100}%`).parent().parent().find("span").text(userCount);
            $(".customerAll").css("width", `${customerAll / all * 100}%`).parent().parent().find("span").text(customerAll);
            $(".customerCount").css("width", `${customerCount / all * 100}%`).parent().parent().find("span").text(customerCount);
        } else {
            studentNum();
        }
    });
}*!/

//互动 邀约量等
function inter(data) {
    let myChart = echarts.init(document.getElementById('inter'));
    let inviteList = [3, 18, 30, 20, 8, 10, 4, 23, 12, 19, 24, 23];
    let volumeList = [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20];
    let successList = [9, 15, 19, 20, 24, 5, 19, 32, 44, 20, 16, 26];
    if (data.result.inviteList != undefined && data.result.inviteList != null) {
        inviteList = data.result.inviteList;
    }
    if (data.result.volumeList != undefined && data.result.volumeList != null) {
        volumeList = data.result.volumeList;
    }
    if (data.result.successList != undefined && data.result.successList != null) {
        successList = data.result.successList;
    }
    // 指定图表的配置项和数据
    let option = {
        title: {},
        tooltip: {},
        legend: {
            data: ['邀约量', '体验量', '成交量']
        },
        xAxis: {
            data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            axisLine: {
                show: true
            },
            splitLine: {
                show: true
            }
        },
        grid: {
            top: '10%'
        },
        yAxis: {},
        series: [{
            name: '邀约量',
            type: 'bar',
            data: inviteList,
            itemStyle: {
                normal: {
                    color: '#26b99a'
                }
            }
        }, {
            name: '体验量',
            type: 'bar',
            data: volumeList,
            itemStyle: {
                normal: {
                    color: '#34495e'
                }
            }
        }, {
            name: '成交量',
            type: 'bar',
            data: successList,
            itemStyle: {
                normal: {
                    color: '#acadac'
                }
            }
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

// 右脑开发
function perfor() {
    let data = [52, 70, 40, 80, 55, 62, 55, 62, 29, 58, 43, 70];
/!*    if (res != undefined && res != null) {
        data = res;
    }*!/
    let selectYear = '2019年';
    let yunit = '万元';
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('perfor'));
    // 指定图表的配置项和数据
    let option = {
        tooltip: {
            formatter: function (param) {
                return selectYear + param.name + "<br>"
                    + param.marker + param.value + yunit + "<br>";
            }
        },
        grid: {
            left: '3%',
            right: '8%',
            bottom: '12%',
            containLabel: true
        },
        xAxis: {
            name: '时间',
            nameTextStyle: {
                color: '#666'
            },
            type: 'category',
            boundaryGap: false,//坐标轴两边留白策略
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            splitLine: {//网线
                show: true,
                lineStyle: {
                    color: '#e6e6e6'
                }
            },
            axisLabel: {
                color: '#666'
            },
            axisLine: {
                lineStyle: {
                    color: '#adadad',
                    width: 1,
                }
            }
        },
        yAxis: {
            name: '万元',
            nameTextStyle: {
                color: '#666',
                padding: [3, 4, 0, 26]
            },
            type: 'value',
            min: 10,
            splitLine: {//网线
                show: true,
                lineStyle: {
                    color: '#e6e6e6'
                }
            },
            axisLabel: {
                color: '#666',
            },
            axisLine: {
                lineStyle: {
                    color: '#adadad',
                    width: 1,
                }
            }
        },
        series: [{
            data: data,
            type: 'line',
            smooth: true,//是否平滑曲线显示
            areaStyle: {
                color: 'rgba(118, 164, 174,.4)'
            },
            symbol: 'circle',//拐点样式
            symbolSize: 6,//拐点大小
            lineStyle: {
                normal: {
                    lineStyle: {
                        width: 1,//折线宽度
                        color: "#387c89",//折线颜色
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: "#387c89",
                    borderColor: '#387c89'  // 线条颜色
                }
            },
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

//学生相关
function studentNum(res) {
    let myChart = echarts.init(document.getElementById('number'));
    let data = [
        {value: 335, name: '少儿班'},
        {value: 310, name: '初一'},
        {value: 100, name: '初二'},
        {value: 234, name: '高一'},
        {value: 135, name: '中级'},
        {value: 1548, name: '高二'}
    ];
    if (res != undefined && res != null) {
        data = res;
    }
    let option = {
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['40%', '55%'],
                center: ['50%', '50%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

//互动量
/!*function getInter() {
    $.get(`/fansi/home/get/active?organizationId=${$("#organizationId").val()}&year=${$("#activeYear").val()}`, function (data) {
        if (data.code == 200) {
            inter(data);
        } else {
            inter(null);
        }
    });
}*!/

//右脑开发
/!*function getRight() {
    $.get(`/fansi/home/get/normal?organizationId=${$("#organizationId").val()}&year=${$("#rightYear").val()}`, function (data) {
        if (data.code == 200) {
            console.log(data.result.normal.all)
            console.log("id = " + $("#organizationId").val())
            $("#perfor").parent().parent().find(".all").html(data.result.normal.all);
            $("#perfor").parent().parent().find(".mouth").html(data.result.normal.mouth);
            $("#perfor").parent().parent().find(".week").html(data.result.normal.week);
            perfor(data.result.normalList);
        } else {
            perfor(null);
        }
    });
}*!/
function getRight() {
    $("#perfor").parent().parent().find(".all").html(100);
    $("#perfor").parent().parent().find(".mouth").html(1200);
    $("#perfor").parent().parent().find(".week").html(2020);
    perfor();
}

function getParent() {
    $("#parent").parent().parent().find(".people").html(200);
    $("#parent").parent().parent().find(".all").html(200);
    $("#parent").parent().parent().find(".mouth").html(200);
    parent2(null)
}

//邀约量
$(function () {
    getDistrict("provinceId", 1, 0);
    getInter();
    getRight();
    getParent();
    getStudentAndCoin();
});

/!*查询市列表*!/
function selectProvince() {
    getDistrict("cityId", 2, $("#provinceId").val());
    $("#areaId").html("<option value=''>筛选区</option>");
    $("#organizationId").html("<option value=''>筛选学校</option>");
}

/!*查询区列表*!/
function selectCity() {
    getDistrict("areaId", 3, $("#cityId").val());
    $("#organizationId").html("<option value=''>筛选学校</option>");
}

/!*查询校区列表*!/
function selectArea() {
    getOrganization($("#areaId").val());
}

/!*查询校区业绩*!/
function selectOrg() {
    if (($("#provinceId").val()) == undefined || ($("#provinceId").val()) == null) {
        $("#organizationId").val("")
    }
    getInter();
    getRight();
    getParent();
    getStudentAndCoin();
}*/

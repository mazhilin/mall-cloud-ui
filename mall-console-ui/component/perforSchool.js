var system = (function () {
    function init() {
        studentNum();
        inter();
        parents();
    }
    function studentNum() {
        var myChart = echarts.init(document.getElementById('number'));

        option = {
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : ['40%', '55%'],
                    center: ['50%', '50%'],
                    data:[
                        {value:335, name:'少儿班'},
                        {value:310, name:'初一'},
                        {value:100, name:'初二'},
                        {value:234, name:'高一'},
                        {value:135, name:'中级'},
                        {value:1548, name:'高二'}
                    ],
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
    }
    function inter() {
        var myChart = echarts.init(document.getElementById('inter'));

        // 指定图表的配置项和数据
        var option = {
            title: {
            },
            tooltip: {},
            legend: {
                data:['邀约量','体验量','成交量']
            },
            xAxis: {
                data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
                axisLine:{
                    show:true
                },
                splitLine:{
                    show:true
                }
            },
            grid:{
                top:'10%'
            },
            yAxis: {

            },
            series: [{
                name: '邀约量',
                type: 'bar',
                data: [3, 18, 30, 20, 8, 10,4, 23, 12, 19, 24, 23],
                itemStyle:{
                    normal:{
                        color: '#26b99a'
                    }
                }
            },{
                name: '体验量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20,5, 20, 36, 10, 10, 20],
                itemStyle:{
                    normal:{
                        color: '#34495e'
                    }
                }
            },{
                name: '成交量',
                type: 'bar',
                data: [9, 15, 19, 20, 24, 5,19, 32, 44, 20, 16, 26],
                itemStyle:{
                    normal:{
                        color: '#acadac'
                    }
                }
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    function parents() {
        var selectYear = '2018年'
        var yunit = '万元';
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('perfor'));
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
                data: [52, 70, 40, 80, 55, 62, 55, 62, 29, 58, 43, 70],
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
    }
    return {
        init: init
    }
})()
system.init();
function checkDate1(dq){
    console.log(dq.cal.getNewDateStr())
}
function checkDate2(){
    console.log($("#datemax2").val())
}
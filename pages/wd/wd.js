var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
    data: {
        tabs: ["待确认", "已确认", "完成"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0
    },
    onLoad: function () {
        var that = this;
        //获取数据
        app.ajax(app.ceport.wd, {}, function (res) {
            console.log(res);
            var tabs = that.tabs;
            var activeIndex = that.activeIndex;
            var sliderOffset = that.sliderOffset;
            var sliderLeft = that.sliderLeft;
            that.setData({
                tabs: tabs,
                activeIndex: activeIndex,
                sliderOffset: sliderOffset,
                sliderLeft: sliderLeft,
                state: res.data
            });
        });
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});
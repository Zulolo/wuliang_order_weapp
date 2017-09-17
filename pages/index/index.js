//获取应用实例
var app = getApp()
Page({
  data: {
    "cesh": [1, 1, 1]
  },
  //查看地图
  seeMap: function () {
    var that = this;
    wx.openLocation({
      latitude: +that.data.info.latitude,
      longitude: +that.data.info.longitude,
      scale: 28
    })
  },
  //打电话
  tapCall: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.info.tel
    })
  },
  //初始化
  onLoad: function () {
    app.getAppid(function(appid){
      console.log(appid);
    });
    var that = this
    //获取数据
    app.ajax(app.ceport.portal, {}, function (res) {
      //渲染其他数据
      that.setData({
        info: res.data
      })
      wx.setStorage({
        key: "name",
        data: res.data.name
      })
      //渲染星星的个数
      var starlevel = [];
      if (res.data.level > 0) {
        var i, len;
        for (i = 1, len = res.data.level; i <= len; i++) {
          starlevel.push(1);
        }
        if(i = len){
          that.setData({
            info: res.data,
            starlevel: starlevel
          })
        }
      }
    });
  }
})
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
    var that = this;
    app.ownLogin(that.refreshAllInfo);
  },

  // 刷新商户和菜单等信息 
  refreshAllInfo: function () {
    var that = this;
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
      if (res.data.rank > 0) {
        var i, len;
        for (i = 1, len = res.data.rank; i <= len; i++) {
          starlevel.push(1);
        }
        if (i = len) {
          that.setData({
            info: res.data,
            starlevel: starlevel
          })
        }
      }
    });
    app.ajax(app.ceport.menu, {}, function (m) {
      app.globalData.menu = new app.Cgarry(m.data);
      app.globalData.wmmenu = new app.Cgarry(m.data);
      app.globalData.pdmenu = new app.Cgarry(m.data);
      // console.log(that.globalData.menu);
      // console.log(that.globalData.wmmenu);
      // console.log(that.globalData.pdmenu);
    });
  },
})
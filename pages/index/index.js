//获取应用实例
var app = getApp()
Page({
  data: {
    "cesh": [1, 1, 1],
    "info": {"manage_access": false}    
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
    app.ownLogin([that.refreshShopInfo, app.getDishesInfo]);
  },

  // 刷新商户和菜单等信息 
  refreshShopInfo: function () {
    var that = this;
    app.getShopInfo(function(){
      console.log("refreshShopInfo", app.globalData.info);
      that.setData({
        info: app.globalData.info
      })
    });
  },
})
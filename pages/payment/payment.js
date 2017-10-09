var app = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function (options) {
    var that = this;
    app.getOpenID([function () {
      var postdata = {
        openid: app.globalData.openid,
        orderid: options.orderid
      };
      // var postdatastr = JSON.stringify(postdata);
      // console.log(postdatastr);
      //获取数据
      app.ajax(app.api_endpoint.payment, postdata, function (res) {
        console.log(res);
        that.setData({
          xs: res.data,
          flag: options.flag,
          orderid: options.orderid
        })
      });
      //获取商户名称
      wx.getStorage({
        key: 'name',
        success: function(res) {
          that.setData({
            name: res.data
          });
        }
      });
    }]);
  },
  //支付按钮
  pay: function () {
    var that = this;
    var successurl = 'msg_success?flag=1&id=' + this.data.orderid;
    var failurl = 'msg_fail?flag=0&id=' + this.data.orderid;
    wx.requestPayment({
      'timeStamp': that.data.xs.timeStamp,
      'nonceStr': that.data.xs.nonceStr,
      'package': that.data.xs.package,
      'signType': 'MD5',
      'paySign': that.data.xs.paySign,
      'success': function (res) {
        wx.redirectTo({
          url: successurl
        })
      },
      'fail': function (res) {
        wx.redirectTo({
          url: failurl
        })
      }
    })
  }
});

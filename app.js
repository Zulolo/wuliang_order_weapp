//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    function Cgarry(m) {
      this.cost = m.cost;
      this.number = m.number;
      this.menu = [];
      var that = this;
      m.menu.forEach(function (v, i) {
        that.menu[i] = {};
        that.menu[i].typeName = v.typeName;
        that.menu[i].menuContent = [];
        v.menuContent.forEach(function (m, n) {
          that.menu[i].menuContent[n] = {};
          that.menu[i].menuContent[n].name = m.name;
          that.menu[i].menuContent[n].src = m.src;
          that.menu[i].menuContent[n].sales = m.sales;
          that.menu[i].menuContent[n].rating = m.rating;
          that.menu[i].menuContent[n].price = m.price;
          that.menu[i].menuContent[n].numb = m.numb;
          that.menu[i].menuContent[n].id = m.id;
        }, this);
      }, this);
    }
    this.ajax(that.ceport.menu, {}, function (m) {
      that.globalData.menu = new Cgarry(m.data);
      that.globalData.wmmenu = new Cgarry(m.data);
      that.globalData.pdmenu = new Cgarry(m.data);
    });
  },
  getAppid: function (bc) {
    var that = this;
    if (that.globalData.appid != "") {
      bc(that.globalData.appid);
    } else {
      //调用微信登录接口
      wx.login({
        success: function (loginCode) {
          var appid = 'wx8449a5bd701c38e8'; //填写微信小程序appid
          var secret = '7abfc4a1482e3438c0b700148d56ac2d'; //填写微信小程序secret
          var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + loginCode.code + '&grant_type=authorization_code';
          //调用request请求api转换登录凭证
          wx.request({
            url: url,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.globalData.appid = res.data.openid;
              bc(res.data.openid); //获取openid
            }
          })
        }
      })
    }
  },
  //封装获取数据的方式
  ajax: function (url, data, fun, post) {
    var method = "post";
    var header = {
      'content-type': 'application/json'
    };
    if (post) {
      method = "POST";
      header = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
    }
    console.log(method);
    //获取数据
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        console.log(res.data);
        var data = {
          errcode: '0',
          data: res.data.result
        }
        fun(data);
        // fun(res.data);
      }
    });
  },
  //测试接口
  ceport: {
    //主页信息接口
    portal: "https://www.zulolo.com/wuliang_order/shop_info",
    //菜单信息
    menu: "https://www.zulolo.com/wuliang_order/dishes",
    //状态接口
    wd: "http://www.easy-mock.com/mock/59979e65059b9c566dc7bcc6/index/state",
    //获取我的订单数据
    state: "http://www.easy-mock.com/mock/59979e65059b9c566dc7bcc6/index/stateq",
    //支付页面
    //payment: "http://www.easy-mock.com/mock/59979e65059b9c566dc7bcc6/index/payment",
    payment:"http://shanggao.wshoto.com/app/index.php?i=3&c=entry&id=2&do=orderdetail_api&m=weisrc_dish",
    //待支付页面
    dcxz: "http://www.easy-mock.com/mock/59979e65059b9c566dc7bcc6/index/dcxz",
    //post点菜数据接口
    podc: "http://shanggao.wshoto.com/app/index.php?i=3&c=entry&storeid=2&mode=4&do=addtoorder_api&m=weisrc_dish"
  },
  globalData: {
    appid: "",
    menu: {
      cost: 0,
      number: 0,
      menu: []
    },
    wmmenu: {
      cost: 0,
      number: 0,
      menu: []
    },
    pdmenu: {
      cost: 0,
      number: 0,
      menu: []
    }
  }
})
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
        that.menu[i].typeName = v.ProductType;
        that.menu[i].menuContent = [];
        v.menuContent.forEach(function (m, n) {
          that.menu[i].menuContent[n] = {};
          that.menu[i].menuContent[n].name = m.ProductName;
          that.menu[i].menuContent[n].src = m.ProductImage;
          that.menu[i].menuContent[n].sales = 66;
          that.menu[i].menuContent[n].rating = 3;
          that.menu[i].menuContent[n].price = m.ProductPrice;
          that.menu[i].menuContent[n].numb = 888;
          that.menu[i].menuContent[n].id = m._id;
        }, this);
      }, this);
    }
    this.ajax(that.ceport.menu, {}, function (m) {
      that.globalData.menu = new Cgarry(m.data);
      that.globalData.wmmenu = new Cgarry(m.data);
      that.globalData.pdmenu = new Cgarry(m.data);
      // console.log(that.globalData.menu);
      // console.log(that.globalData.wmmenu);
      // console.log(that.globalData.pdmenu);
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
          var appid = 'xxxxxxxxxxx'; //填写微信小程序appid
          var secret = 'ssssssssssssssssss'; //填写微信小程序secret
          that.ajax(that.ceport.login, { appid, secret}, function (res) {
            that.globalData.appid = res.data.openid;
            bc(res.data.openid); //获取openid
          }, "POST");
        }
      })
    }
  },
  //封装获取数据的方式
  ajax: function (url, query_data, fun, post) {
    var method = "GET";
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
      data: query_data,
      header: header,
      success: function (res) {
        console.log(res.data);
        var repack_data = {
          errcode: '0',
          data: res.data
        }
        fun(repack_data);
        // fun(res.data);
      }
    });
  },
  //测试接口
  ceport: {
    login: "https://www.zulolo.com/wuliang_order/login",
    //主页信息接口
    portal: "https://www.zulolo.com/wuliang_order/shop_info",
    //菜单信息
    menu: "https://www.zulolo.com/wuliang_order/dishes",
    //状态接口
    wd: "https://www.zulolo.com/mock/59979e65059b9c566dc7bcc6/index/state",
    //获取我的订单数据
    state: "https://www.zulolo.com/mock/59979e65059b9c566dc7bcc6/index/stateq",
    //支付页面
    //payment: "http://www.easy-mock.com/mock/59979e65059b9c566dc7bcc6/index/payment",
    payment:"https://www.zulolo.com/app/index.php?i=3&c=entry&id=2&do=orderdetail_api&m=weisrc_dish",
    //待支付页面
    dcxz: "https://www.zulolo.com/mock/59979e65059b9c566dc7bcc6/index/dcxz",
    //post点菜数据接口
    podc: "https://www.zulolo.com/app/index.php?i=3&c=entry&storeid=2&mode=4&do=addtoorder_api&m=weisrc_dish"
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
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.globalData.session = wx.getStorageSync('session');
    var that = this;
    // this.getOpenID(function (openid) {
    //   // console.log("openid:", openid);
    // });
  },

  Cgarry: function (m) {
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
        that.menu[i].menuContent[n].numb = 0;
        that.menu[i].menuContent[n].id = m._id;
      }, this);
    }, this);
  },

  executeAllCallbacks: function (funcs) {
    if (funcs) {
      var i, len;
      for (i = 0, len = funcs.length; i < len; i++) {
        funcs[i]();
      }
    }
  },

  chechOwnSession: function (funcs) {
    var that = this;
    that.ajax(that.api_endpoint.login, {}, function (res) { 
      that.executeAllCallbacks(funcs);
    });
  },

  handleUserInfo: function(reply) {
    console.log("handleUserInfo:", reply);
  },

  getOpenID: function (funcs) {
    var that = this;
    // console.log("what fuck is bc?", bc);
    if (that.globalData.openid != "") {
      that.executeAllCallbacks(funcs);
    } else {
      //调用微信登录接口
      wx.login({
        success: function (loginCode) {
          var code = loginCode.code;
          that.ajax(that.api_endpoint.login, { code }, function (res) {
            that.globalData.openid = res.data.openid;
            that.globalData.session = res.data.session;
            wx.setStorageSync('session', res.data.session);
            that.executeAllCallbacks(funcs);
          }, "POST");
        }
      });

      // 获取用户信息
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                that.ajax(that.api_endpoint.userinfo, res, that.handleUserInfo, "POST");
              }
            })
          } else {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                // 用户已经同意小程序使用user info功能，后续调用 wx.startRecord 接口不会弹窗询问
                wx.getUserInfo({
                  success: res => {
                    that.ajax(that.api_endpoint.userinfo, res, that.handleUserInfo, "POST");
                  }
                })
              }
            })
          }
        }
      })
    }
  },

  ownLogin: function (funcs) {
    var that = this
    if (that.globalData.openid != "") {
      wx.checkSession({
        success: function () {
          // openid 未过期，并且在本生命周期一直有效
          // check 自己的session 有没有过期
          that.chechOwnSession(funcs);
        },
        fail: function () {
          //登录态过期
          that.getOpenID(funcs);
        }
      })
    } else {
      that.getOpenID(funcs);
    }
  },

  // 刷新商户和菜单等信息到全局变量 
  getShopInfo: function (func) {
    var that = this;
    that.ajax(that.api_endpoint.portal, {}, function (res) {
      that.globalData.info = res.data;
      that.globalData.info.money = 10;
      wx.setStorage({
        key: "name",
        data: res.data.name
      })
      //星星的个数
      var starlevel = [];
      if (res.data.rank > 0) {
        var i, len;
        for (i = 1, len = res.data.rank; i <= len; i++) {
          that.globalData.starlevel.push(1);
        }
      }
      if (func) {
        func();
      }
    });
  },

  getDishesInfo: function (func) {
    var that = this;
    that.ajax(that.api_endpoint.menu, {}, function (m) {
      that.globalData.menu = new that.Cgarry(m.data);
      that.globalData.wmmenu = new that.Cgarry(m.data);
      that.globalData.pdmenu = new that.Cgarry(m.data);
      if (func) {
        func();
      }
    });
  },

  //封装获取数据的方式
  ajax: function (url, query_data, func, post, file_name, file_path) {
    var method = "GET";
    var header = {
      'content-type': 'application/json',
      'session': this.globalData.session
    };
    // console.log("Herder session", this.globalData.session);
    if (post) {
      method = "POST";
    }
    // console.log(method, url, file_path);
    //获取数据
    if (file_path && file_name) {
      wx.uploadFile({
        url: url, 
        filePath: file_path,
        name: file_name,
        formData: query_data,
        header: header,
        success: function (res) {
          console.log("wx.uploadFile response:", res);
          func(res);
        }
      })
    } else {
//      console.log("prequery", query_data);
      wx.request({
        url: url,
        method: method,
        data: query_data,
        header: header,
        success: function (res) {
          console.log("wx.request response:", res);
          func(res);
        }
      });
    }
  },

  //测试接口
  api_endpoint: {
    login: "https://www.zulolo.com/wuliang_order/login",
    userinfo: "https://www.zulolo.com/wuliang_order/user_info",
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
    openid: "",
    session: "",
    info: {},
    starlevel: [],
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
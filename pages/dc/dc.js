//获取应用实例
var app = getApp()
Page({
  data: {
    height: 'height:15px;',
    //整个菜单
    menu: [],
    currentPage: 0,
    selected: 0,
    howMuch: 12,
    //总价格
    cost: 0,
    number: 0
  },

  //监听页面加载
  onLoad: function (options) {
    var that = this;
    console.log("options.flag", options.flag);
    //重新获取高度
    wx.getSystemInfo({
      success: function (res) {
        var height = "height:" + res.windowHeight + 'px;';
        that.setData({
          height: height,
        })
      }
    });
    var menu;
    //渲染菜单数据
    if (options.flag === "0") {
      menu = app.globalData.menu;
      console.log("001");
    } else if (options.flag === "1") {
      menu = app.globalData.wmmenu;
      console.log("002");
    } else if (options.flag === "2") {
      menu = app.globalData.pdmenu;
      console.log("003");
    }
    that.setData({
      menu: menu.menu,
      cost: menu.cost,
      number: menu.number,
      flag: options.flag
    })
  },

  //增加吃的
  addToTrolley: function (e) {
    var info = this.data.menu;
    info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
    this.data.number++;
    var number = this.data.number;
    var flag = this.data.flag;
    var cost = Number(this.data.cost) + Number(this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price);
    console.log(cost);
    console.log('number=' + number);
    if (flag === "0") {
      app.globalData.menu.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
      app.globalData.menu.cost = cost;
      app.globalData.menu.number = number;
    } else if (flag === "1") {
      app.globalData.wmmenu.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
      app.globalData.wmmenu.cost = cost;
      app.globalData.wmmenu.number = number;
    } else if (flag === "2") {
      app.globalData.pdmenu.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
      app.globalData.pdmenu.cost = cost;
      app.globalData.pdmenu.number = number;
    }
    this.setData({
      cost: cost,
      menu: info,
      number: number,
      flag: flag
    })
  },

  //减少吃的
  removeFromTrolley: function (e) {
    var info = this.data.menu;
    var cost = Number(this.data.cost) - Number(this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price);
    var numb;
    var number = this.data.number;
    var flag = this.data.flag;
    if (info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb != 0) {
      info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb--;
      numb = info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb;
      number = +number - 1;
      if (flag === "0") {
        app.globalData.menu.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].numb = numb;
        app.globalData.menu.cost = cost;
        app.globalData.menu.number = number;
      } else if (flag === "1") {
        app.globalData.wmmenu.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].numb = numb;
        app.globalData.wmmenu.cost = cost;
        app.globalData.wmmenu.number = number;
      } else if (flag === "2") {
        app.globalData.pdmenu.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].numb = numb;
        app.globalData.pdmenu.cost = cost;
        app.globalData.pdmenu.number = number;
      }
      this.setData({
        cost: cost,
        menu: info,
        number: number,
        flag: flag
      })
    }
  },

  //切换菜单
  changeMenuType: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset.index);
  },

  //下单
  placeOrder: function () {
    var that = this;
    wx.getStorage({
      key: 'name',
      success: function(res) {
        console.log(res.data);
        var tjdata = {
          cost: that.data.cost,
          number: that.data.number,
          name: res.data,
          order: []
        }
        that.data.menu.forEach(function (v) {
          v.menuContent.forEach(function (m) {
            if (m.numb > 0) {
              tjdata.order.push(m);
            }
          }, this);
        }, this);
        var letdata = JSON.stringify(tjdata);
        //存本地缓存
        wx.setStorage({
          key: "letdata",
          data: letdata,
          complete: function () {
            //选好了，点击购买
            var url = '../dcxz/dcxz';
            if (that.options.flag == '1') {
              url = '../dcxz/dcxzwm';
            }
            if (that.data.cost != 0) {
              wx.redirectTo({
                url: url
              });
            }
          }
        })
      }
    });
  }
})

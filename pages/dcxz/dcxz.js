//获取应用实例
var app = getApp()

//封装tusi
function tusi(str, flag, fun) {
  var icon = 'loading';
  if (flag) {
    icon = 'success';
  }
  wx.showToast({
    title: str,
    icon: icon,
    duration: 2000,
    complete: function () {
      if (fun) {
        fun();
      }
    }
  });
}

Page({
  data: {
    name: '',
    tel: '',
    sex: "",
    zh: "",
    radioItems: [
      { name: '先生', value: '0' , checked: true},
      { name: '女士', value: '1' }
    ]
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
    console.log(app.globalData.dcmenu);
    //获取数据
    wx.getStorage({
      key: 'letdata',
      success: function(res) {
        console.log(res.data)
        var infodata = JSON.parse(res.data);
        that.setData({
          dcxz: infodata
        })
      } 
    });
    //从本地缓存获取数据
    wx.getStorage({
      key: 'mymsg',
      success: function(res) {
        console.log(res.data)
        var infodata = JSON.parse(res.data);
        console.log(infodata.name);
        var radioItems = that.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
          radioItems[i].checked = radioItems[i].value == infodata.sex;
        }
        that.setData({
          name: infodata.name,
          tel: infodata.tel,
          sex: infodata.sex,
          zh: infodata.zh,
          radioItems: radioItems
        });
      } 
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      sex: e.detail.value
    });
  },
  //提交订单
  sub: function (e) {
    var that = this;
    console.log(this.data.name);
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (this.data.name === '') {
      tusi('请填写姓名');
    } else if (this.data.tel === '') {
      tusi('请填写手机号');
    } else if (!myreg.test(that.data.tel)) {
      tusi('请输入有效的手机号');
    } else {
      var mymsg = {
        name: that.data.name,
        tel: that.data.tel,
        sex: that.data.sex,
        zh: that.data.zh
      };
      var str = JSON.stringify(mymsg);
      //存本地缓存
      wx.setStorage({
        key: "mymsg",
        data: str,
        complete: function () {
          //整理post的提交数据
          var postData = that.data.dcxz;
          app.getAppid(function(appid){
            postData.appid = appid;
            postData.flag = "0";
            postData.userinfo = {
              name: that.data.name,
              tel: that.data.tel,
              sex: that.data.sex,
              zh: that.data.sex,
              address: "",
              addrdetail: "",
              bz: "",
              servicetime: ""
            };
            var jsonur = JSON.stringify(postData);
            app.ajax(app.api_endpoint.podc, jsonur, function(m){
              //这边支付接口传回的参数需要重新处理
              var id = m.data.orderid;
              var url = '../payment/payment?id=' + id;
              console.log(url);
              tusi('提交成功', true, function () {
                wx.redirectTo({
                  url: url
                })
              }, true);
            }, true);
          });
        }
      })
    }
  },
  //同步姓名
  wname: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //电话
  tel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  //同步桌号
  zh: function (e) {
    this.setData({
      zh: e.detail.value
    })
  }
})
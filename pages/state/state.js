var app = getApp()

function _next(n, fun) {
  var that = this;
  if (this.data.progress >= n) {
    this.setData({
      disabled: false
    });
    if(fun){
      fun();
    }
    return true;
  }
  this.setData({
    progress: ++this.data.progress
  });
  setTimeout(function () {
    _next.call(that, n, fun);
  }, 20);
}

function _next2(n) {
  var that = this;
  if (this.data.progress2 >= n) {
    this.setData({
      disabled2: false
    });
    return true;
  }
  this.setData({
    progress2: ++this.data.progress2
  });
  setTimeout(function () {
    _next2.call(that, n);
  }, 20);
}


//改变头部的状态
function cgheader(flag, that) {
  if (flag === '1') {
    that.setData({
      yq2: "background: #F1544E;"
    });
  } else if (flag === '2') {
    that.setData({
      yq2: "background: #F1544E;",
      yq3: "background: #F1544E;"
    });
  }
}

Page({
  data: {
    progress: 0,
    disabled: false,
    progress2: 0,
    disabled2: false,
    yq1: "background: #F1544E;"
  },
  onLoad: function (options) {
    console.log(options.flag);
    console.log(options.id);

    var that = this;

    //修改状态颜色
    cgheader(options.flag, this);
    that.setData({

    });
    //获取数据
    app.ajax(app.api_endpoint.state, {}, function (res) {
      that.setData({
        state: res.data,
        flag: options.flag,
        id: options.id
      });
    });
    if (this.data.disabled) return;
    this.setData({
      progress: 0,
      disabled: true
    });
    console.log(options.flag);
    //修改动画状态
    if(options.flag == '0'){
      _next.call(this, 50);
    }else if(options.flag == '1'){
      _next.call(this, 100, function(){
        _next2.call(that, 50);
      });
    }else if(options.flag == '2'){
      _next.call(this, 100, function(){
        _next2.call(that, 100);
      });
    }
  },
  //取消订单
  cancle: function () {
    wx.showModal({
      title: '提示',
      content: '确认取消！',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('确定')
          //缺一个提交后台数据库的操作
          // 关闭当前页面返回上级页面
          wx.navigateBack();
        } else {
          console.log('取消')
        }
      }
    });
  },
  //确认订单
  sure: function(){
    var url = '../payment/payment?flag=' + this.data.flag + '&id=' + this.data.id;
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000,
      complete: function(){
        wx.redirectTo({
          url: url
        });
      }
    });
  }
});
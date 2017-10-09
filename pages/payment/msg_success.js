Page({
    data:{},
    onLoad: function(options){
      this.data.flag = options.flag;
      this.data.orderid = options.orderid;
    },
    endbp: function(){
      var url = '../state/state?flag=' + this.data.flag + '&orderid=' + this.data.orderid;
      console.log(url);
      wx.redirectTo({
          url: url
      })
    }
});
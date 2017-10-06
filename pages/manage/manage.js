var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
  data: {
      uploading: false,
      img_src: "https://www.zulolo.com/images/default_dish.jpg",
      dish_name: "熏肉大饼",
      dish_type: "营养套餐",
      dish_size: "中",
      dish_price: 8.5,
      dish_desc: "好吃的很"
  },

  dish_name_input: function (event) {
    if (event.detail.value != "") {
      this.setData({
        dish_name: event.detail.value
      })
    }
  },

  dish_type_input: function (event) {
    if (event.detail.value != "") {
      this.setData({
        dish_type: event.detail.value
      })
    }
  },

  dish_size_input: function (event) {
    if (event.detail.value != "") {
      this.setData({
        dish_size: event.detail.value
      })
    }
  },

  dish_price_input: function (event) {
    this.setData({
      dish_price: parseFloat(event.detail.value)
    })
  },

  dish_desc_input: function (event) {
    if (event.detail.value != "") {
      this.setData({
        dish_desc: event.detail.value
      })
    }
  },

  select_img: function (event) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          img_src: res.tempFilePaths[0]
        })
      }
    })
  },

  add_dish_cb: function (res) {
    var that = this;
    that.data.uploading = false;
    wx.hideLoading();
    console.log("add dish", res.data);
    if (res.statusCode != 200) {
      wx.showModal({
        title: '错误',
        content: '添加菜品失败',
        showCancel: false,
        success: function (res) { }
      })
    } else {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      app.getDishesInfo();
    }
  },

  add_dish: function (event) {
    var that = this;
    console.log(that.data.dish_name, that.data.dish_type, that.data.dish_size, that.data.dish_desc, that.data.dish_price);
    if ((that.data.dish_name != "") && 
      (that.data.dish_type != "") && 
      (that.data.dish_size != "") && 
      (that.data.dish_desc != "") && 
      (that.data.dish_price > 0)) {   
      var ProductName = that.data.dish_name;
      var ProductType = that.data.dish_type;
      var ProductSize = that.data.dish_size;
      var ProductDesc = that.data.dish_desc;
      var ProductPrice = that.data.dish_price;

      // add new dish
      if (that.data.img_src.startsWith("https://")) {
        // no new image taken
        app.ajax(app.api_endpoint.menu,
          { ProductName, ProductType, ProductSize, ProductDesc, ProductPrice },
          that.add_dish_cb, "POST");
      } else {
        // new image has been selected
        app.ajax(app.api_endpoint.menu,
          { ProductName, ProductType, ProductSize, ProductDesc, ProductPrice },
          that.add_dish_cb, "POST", "ProductImage", that.data.img_src);
      }
      

      // handling GUI
      that.data.uploading = true;
      wx.showLoading({
        title: '和服务器通信中',
      });
      setTimeout(function () {
        if (that.data.uploading == true) {
          that.data.uploading = false;
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: '和服务器通信失败',
            showCancel: false,
            success: function (res) { }
          })
        }
      }, 5000);
    } else {
      wx.showModal({
        title: '错误',
        content: '请检查输入信息',
        showCancel: false,
        success: function (res) {}
      })
    }
  }
});
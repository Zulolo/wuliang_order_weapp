Page({
    data:{},
    onLoad: function(options){
        this.data.flag = options.flag;
        this.data.id = options.id;
    },
    endbp: function(){
        var url = '../state/state?flag=' + this.data.flag + '&id=' + this.data.id;
        console.log(url);
        wx.redirectTo({
            url: url
        })
    }
});
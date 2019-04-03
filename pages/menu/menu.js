Page({
  data: {
    
    userName: ""
  },
  onLoad: function (options) {

    var userName = options.userName;
    var password=options.password;
    wx.setStorageSync('userName', userName);
    wx.setStorageSync('password', password)
  },
  //跳转到绑定页面
  bindequipment:function(){
    wx.navigateTo({
      url: '/pages/bind/bind'
    })
  },
  check:function(){
    //跳转到审核页面
    wx.navigateTo({
      url: '/pages/checkList/checkList'
    })
  }


})
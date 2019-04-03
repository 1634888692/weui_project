//引入md5加密
var md = require("../../md5.min.js")
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    password: "",
    userName: ""
  },
  //监视表单的用户名
  userName: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //监听表单中的密码值
  watchPassWord: function(e) {
    var a = md.hexMD5(e.detail.value);

    this.setData({
      password: a
    })
  },
  //事件处理函数
  submit: function(e) {
    console.log("密码值===" + this.data.password);
    //校验不能为空
    if (this.data.password) {
      //发送请求到后台
      var that = this.data.password;
      var thatUserName = this.data.userName;
      var url = app.globalData.url;
      wx.request({
        url: app.globalData.url + '/servlet/weChatAdminLogin',
        data: {
          password: that,
          userName: thatUserName
        },
        method: "get",
        success: function(res) {
          if (res.data.status == "200") {
            wx.navigateTo({
              url: '/pages/menu/menu?userName=' + thatUserName + "&password=" + that
            })
          } else {
            wx.showToast({
              title: '用户不存在',
              icon: 'false',
              duration: 2000
            });
          }

        }


      })
    } else {
      wx.showToast({
        title: '不能为空',
        icon: 'false',
        duration: 2000
      });

    }
  }


})
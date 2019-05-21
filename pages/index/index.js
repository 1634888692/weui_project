//引入md5加密
var md = require("../../md5.min.js")
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    password: "",
    userName: "",
    openid:""
   
  },
  onLoad: function() {
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // wx.navigateTo({
              //   url: '/pages/visitoruploadimage/visitoruploadimage',
              // })
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  //监视表单的用户名
  userName: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
 

  
  loginInfo: function() {
    var that = this;
    wx.login({

      success: function(res) {
        if (res.code) {
          console.log("======" + res.code)
          wx.request({
            url: app.globalData.url + '/servlet/getopenid',
            data: {
              code: res.code

            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              var session_key = res.data.obj.session_key;
              // var json=JSON.parse(res.data.obj);
              // var session_key = json("session_key")
              // var userinfo = {};
              var userInfo = wx.getStorageSync("userInfo");


              wx.setStorageSync('openid', res.data.obj.openid);
              //将游客的信息插入到数据库中
              wx.request({
                url: app.globalData.url+ '/servlet/insertData',
                data:{
                  openid: res.data.obj.openid,
                  avatarUrl: userInfo.avatarUrl,
                  city: userInfo.city,
                  country: userInfo.country,
                  gender: userInfo.gender,
                  language: userInfo.language,
                  province: userInfo.province,
                  nickName: userInfo.nickName


                },
                success:function(res){
                  
                  //进行跳转到游客绑定页面
                  wx.navigateTo({
                    url: '/pages/visitoruploadimage/visitoruploadimage',
                  })
                }
              })
             
              //进行位置定位
              //that.location();

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  bindGetUserInfo(res) {
    console.log(res);
    if (res.detail.userInfo) {
      console.log("点击了同意授权");
      //登录后台进行获取openid和session_key
      wx.setStorageSync('userInfo', res.detail.userInfo);
      this.loginInfo();
    } else {
      console.log("点击了拒绝授权");
    }
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
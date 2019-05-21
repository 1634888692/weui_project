const app = getApp();
Page({
  data:{
    datalist:[]
  },
  //点击审核事件
  check: function (e) {
    console.log("=============" + e.currentTarget.id)
    var index = e.target.dataset.item;

    var that = this;
    //发送请求到后台审核
    wx.request({
      url: app.globalData.url + '/servlet/CheckAdver',
      data: {
        id: e.currentTarget.id
      },
      method: "get",
      success: function (res) {
        if (res.data.status == "200") {
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          console.log("===========")
          that.data.datalist.splice(index, 1);
          that.setData({
            datalist: that.data.datalist,
          })
        }
        console.log("===========")
      }
    })
  },
  /**
   * 搜索
   */
  wxSearchInput: function (value) {
    //在缓存中取出用户名
    var userName = wx.getStorageSync('userName');
    var password = wx.getStorageSync("password");
    var that = this;
    if (value.detail.value.length > 0) {
      wx.request({
        url: app.globalData.url + '/servlet/getNoCheckAdverList',
        data: {
          userName: userName,
          password: password,
          search: value.detail.value.replace(/\s*/g, "")
        },

        method: 'GET',

        success: function (res) {
          if (res.data.status = "200") {


            that.setData({
              datalist: res.data.obj,
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //在缓存中取出用户名
    var userName = wx.getStorageSync('userName');
    var password = wx.getStorageSync("password");
    var that = this;
    //通过用户请求后台，查询数据
    wx.request({
      url: app.globalData.url + '/servlet/getNoCheckAdverList',
      data: {
        userName: userName,
        password: password
      },
      method: "GET",
      success: function (res) {

        that.setData({
          datalist: res.data.obj,
        })

        wx.hideLoading()
      }
    });

  }
})
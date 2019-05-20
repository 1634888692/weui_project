const app = getApp();
Page({
  data: {
    xiaoqu: [],
    qishu: [],
    dongshu: [],
    index: 0,
    index_qishu: 0,
    index_dongshu: 0,
    xiaoqu_id: "",
    qishu_id: "",
    dongshu_id: "",
    eId: "",
    hidden_sao: true,
    hidden_input: true,
    hidden_sub: true,
    hidden_switch: true,
    eq_name1: "",
    bindtype: ""
  },
  onLoad: function(options) {
    //向后台请求小区名称数据
    var that = this;
    wx.request({
      url: app.globalData.url + '/servlet/xiaoqu',
      data: {},
      method: "GET",
      success: function(res) {
        that.setData({
          xiaoqu: res.data.obj
        })
        console.log("========")
      }

    })
  },
  //选中小区触发
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.xiaoqu[e.detail.value].id)
    this.setData({
      index: e.detail.value,
      xiaoqu_id: this.data.xiaoqu[e.detail.value].id
    })
    var that = this;
    //通过小区的id,请求后台查询期数
    wx.request({
      url: app.globalData.url + '/servlet/qishu',
      data: {
        id: that.data.xiaoqu[e.detail.value].id
      },
      method: "get",
      success: function(res) {
        that.setData({
          qishu: res.data.obj
        })
        console.log("=========")
      }
    })
  },
  //选中期数触发
  bindPickerQishuChange: function(e) {
    var that = this
    this.setData({
      index_qishu: e.detail.value,
      qishu_id: that.data.qishu[e.detail.value].id
    })

    //向后台查询查询栋数
    wx.request({
      url: app.globalData.url + '/servlet/dongshu',
      data: {
        id: that.data.qishu[e.detail.value].id
      },
      method: "GET",
      success: function(res) {
        that.setData({
          dongshu: res.data.obj
        })
        console.log("==========")
      }
    })
  },
  //选中栋数
  bindPickerDongshuChange: function(e) {
    var that = this
    this.setData({
      index_dongshu: e.detail.value,
      //给栋数赋值
      dongshu_id: that.data.dongshu[e.detail.value].id,
      hidden_sao: false
    })
  },
  //扫二维码
  saoma: function() {
    var that = this;
    wx.scanCode({
      success: function(res) {
        console.log("二维码的结果========" + res.result)
        //请求接口
        wx.request({
          url: app.globalData.url + '/servlet/qRcode',
          data: {
            eId: res.result
          },
          method: "get",
          success: function(res) {
            if (res.data.satuts = "200") {
              that.setData({
                eId: res.data.obj,
                hidden_input: false
              })
            }
          }
        })
      }
    })
  },
  sub: function() {
    console.log("小区的id====" + this.data.xiaoqu_id + "  期数id====" + this.data.qishu_id + "   栋数id====" + this.data.dongshu_id + "    设备id==" + this.data.eId + "   设备名称===" + this.data.eq_name1 + "    是否为门禁机" + this.data.bindtype)
    var that = this
    //向后台提交绑定数据
    wx.request({
      url: app.globalData.url + '/servlet/bind',
      method: "get",
      data: {
        bindtype: that.data.bindtype,
        dongshu_id: that.data.dongshu_id,
        eId: that.data.eId,
        eq_name1: that.data.eq_name1
      },
      success: function(res) {
        if (res.data.satuts = "200") {

          wx.showToast({
            title: "成功绑定",
            icon: 'false',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'false',
            duration: 2000
          });
        }
      },
      fail: function() {
        wx.showToast({
          title: '绑定失败',
          icon: 'false',
          duration: 2000
        });
      }
    })
  },
  //获取设备名称
  eqName: function(e) {
    this.setData({
      eq_name1: e.detail.value,
      hidden_switch: false
    })
  },
  //switch开关
  changeSwitch: function(e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      this.setData({
        bindtype: 1,
        hidden_sub: false
      })

    } else(
      this.setData({
        bindtype: 0,
        hidden_sub: false
      })
    )


  }

})
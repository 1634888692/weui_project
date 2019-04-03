const app = getApp();
Page({
  data: {
    xiaoqu: [],
    qishu: [],
    dongshu: [],
    index: 0,
    index_qishu: 0,
    index_dongshu: 0,
    xiaoqu_id:"",
    qishu_id:"",
    dongshu_id:""
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
    var that=this
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
  bindPickerDongshuChange:function(e){
    var that = this
    this.setData({
      index_dongshu: e.detail.value,
      //给栋数赋值
      dongshu_id: that.data.dongshu[e.detail.value].id
    })
  },
  //扫二维码
  saoma:function(){
wx.scanCode({
  success:function(res){
    console.log("二维码的结果========"+res.result)
  }
})
  }

})
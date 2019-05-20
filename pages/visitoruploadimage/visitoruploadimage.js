//获取应用实例
const app = getApp()
Page({
  data: {
    qishuisHidden: true,
    dongshuisHidden: true,
    equipmentHidden: true,
    index: 0,
    startDate: '',
    endDate: '',
    fileId: [],
    images: [],
    residential: [],
    xiaoqu_id: "",
    qishu: [],
    qishu_id: "",
    index_qishu: 0,
    dongshu: [],
    dongshu_id: "",
    equipment: [],
    mac: "",
    index_equipment: 0,
    index_dongshu: 0,
    imageWidth: 500 / 4 - 10,
    we: ""
  },
  //选中设备激发
  bindPickerEquipmentChange: function(e) {
    this.setData({
      index_equipment: e.detail.value,
      mac: this.data.equipment[e.detail.value].id
    })
  },
  //选中栋数激发
  bindPickerDongshuChange: function(e) {
    if (e.detail.value == 0) {
      return;
    }
    //将设备的id为null
    var that = this;
    this.setData({
      index_dongshu: e.detail.value,
      dongshu_id: that.data.dongshu[e.detail.value].id,
      equipmentHidden: false,
      mac: "",
      equipment: []

    })
    //想后台请求查询栋数下面的设备
    wx.request({
      url: app.globalData.url + '/servlet/getEquipment',
      data: {
        id: that.data.dongshu[e.detail.value].id
      },
      method: "GET",
      success: function(res) {
        that.setData({
          equipment: res.data.obj,
        })
        if (res.data.obj.length > 0) {
          console.log("=====第一个设备===" + that.data.equipment[0].id)
          that.setData({
            mac: that.data.equipment[0].id
          })

        }

      }
    })

  },
  //选中期数触发
  bindPickerQishuChange: function(e) {
    if (e.detail.value == 0) {
      return;
    }
    var that = this
    //隐藏设备，设备id为null
    this.setData({
      index_qishu: e.detail.value,
      qishu_id: that.data.qishu[e.detail.value].id,
      dongshuisHidden: false,
      mac: "",
      equipmentHidden: true,
      equipment: []
    })

    //向后台查询查询栋数
    wx.request({
      url: app.globalData.url + '/servlet/dongshu',
      data: {
        id: that.data.qishu[e.detail.value].id,
        we:"we"
      },
      method: "GET",
      success: function(res) {
        that.setData({
          dongshu: res.data.obj
        })
        that.setData({
          dongshu_id: that.data.dongshu[0].id
        })

      }
    })
  },
  //选中小区触发
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    //将期数的id设为null,栋数id设为null,设备mac地址设为null
    //栋数隐藏，设备隐藏

    this.setData({
      index: e.detail.value,
      xiaoqu_id: this.data.residential[e.detail.value].id,
      qishuisHidden: false,
      qishu_id: "",
      dongshu_id: "",
      mac: "",
      qishu: [],
      dongshu: "",
      dongshuisHidden: true,
      equipmentHidden: true
    })
    var that = this;
    //通过小区的id,请求后台查询期数
    wx.request({
      url: app.globalData.url + '/servlet/qishu',
      data: {
        id: that.data.residential[e.detail.value].id,
        we: "we"
      },
      method: "get",
      success: function(res) {
        that.setData({
          qishu: res.data.obj
        })
        that.setData({
          qishu_id: that.data.qishu[0].id
        })
        console.log("=========")
      }
    })
  },
  //通过经纬度查询小区
  getResidential: function(latitude, longitude) {
    var that = this;
    //向后台通过经纬度请求查询数据
    wx.request({
      url: app.globalData.url + '/servlet/getRnameLongitudeAndLatitude',
      data: {
        longitude: latitude,
        latitude: longitude,

      },
      success: function(e) {
        that.setData({
            residential: that.data.residential.concat(e.data.obj)
          }),
          that.setData({
            xiaoqu_id: that.data.residential[0].id
          })

      }

    })
  },
  location: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        //通过经纬度查询附近的小区
        that.getResidential(latitude, longitude);

      }
    })
  },
  initTime: function() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var ed = D + 3;
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日');

    this.setData({
      startDate: Y + "-" + M + "-" + D,
      endDate: Y + "-" + M + "-" + ed


    })
  },
  onLoad: function(options) {
    //初始化时间
    this.initTime();
    //进行定位
    this.location()
  },
  submit: function() { // 提交图片，事先遍历图集数组
    var that = this;
    var fileId1 = that.data.fileId;
    var mac = that.data.mac;


    wx.request({
      url: app.globalData.url + '/servlet/addVisitorData',
      data: {
        fileId: that.data.fileId,
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        mac: that.data.mac,
        typeId: that.data.typeId,
        xiaoqu_id: that.data.xiaoqu_id,
        qishu_id: that.data.qishu_id,
        dongshu_id: that.data.dongshu_id

      },
      method: "get",
      success: function(e) {

        wx.showToast({
          title: e.data.msg,
          icon: 'succes',
          duration: 1000,
          mask: true
        })




      }

    })


  },
  delete: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.images;
    var fileId = this.data.fileId;

    images.splice(index, 1);
    //移除对应的数组中的值
    fileId.splice(index, 1);


    this.setData({
      images: images,
      fileId: fileId

    });

  },
  chooseImage: function() { // 选择图片
    console.log("图片的张数===" + this.data.images.length)
    if (this.data.images.length >= 1) {
      wx.showToast({
        title: '只能上传一张',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],

      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function(res) { // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        that.setData({
          images: that.data.images.concat(tempFilePaths)

        });

        //小程序自带的上传图片接口
        wx.uploadFile({
          url: app.globalData.url + '/servlet/uploadFile',
          filePath: tempFilePaths,
          name: 'file',

          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function(res) {
            console.log("fileId===" + JSON.parse(res.data).obj)
            that.setData({
              fileId: that.data.fileId.concat(JSON.parse(res.data).obj)

            })
            console.log("[]fileId======" + that.data.fileId)
          },
          fail: function(err) {
            console.log()
          }
        })

      },
      complete: function() {
        var fileId1 = that.data.fileId;

      }

    });


  },
})
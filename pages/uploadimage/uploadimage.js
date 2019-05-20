//获取应用实例
const app = getApp()
var date = require('../../utils/util.js')



Page({
  data: {
    images: [],
    uploadedImages: [],
    index: 0,
    index_type: 0,
    imageWidth: 500 / 4 - 10,
    type: [],
    typeId: "",
    startDate: '2016-09-01',
    endDate: '2016-09-01',
    bindName: "",
    isHidden: true,
    eqIndex: 0,
    eqName: [],
    fileId: [],
    eqId: "",
    xiaoqu: [],
    qishu: [],
    equipment: [],
    index_equipment: 0,
    mac:"",

    xiaoqu_id: "",
    qishu_id: "",
    dongshu_id: "",
    index_qishu: 0,
    index_dongshu: 0,
    dongshu: [],
    dateTime:""


  },
  onLoad: function(options) {
    
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
    
    this.setData({
      startDate: Y+"-"+M+"-"+D,
      endDate:Y+1+"-"+M+"-"+D

    
    })
    var that = this;
    var objectId = options.objectId;
    console.log(objectId);
    //通过用户名和密码请求后台查询主屏绑定类型数据
    wx.request({
      url: app.globalData.url + '/servlet/getTypeData',
      data: {
        userName: wx.getStorageSync('userName'),
        password: wx.getStorageSync("password")
      },
      method: "get",
      success: function(res) {


        that.setData({
          type: that.data.type.concat(res.data.obj)
        });

      }
    })

  },
  //选中结束时间出发
  bindEndDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  //选中设备激发
  bindPickerEquipmentChange:function(e){
    this.setData({
      index_equipment: e.detail.value,
      mac: this.data.equipment[e.detail.value].id
    })
  },
  //选中栋数激发
  bindPickerDongshuChange: function(e) {
    var that=this;
    this.setData({
      index_dongshu: e.detail.value,
      dongshu_id: that.data.dongshu[e.detail.value].id,
      
    })
    //想后台请求查询栋数下面的设备
    wx.request({
      url: app.globalData.url + '/servlet/getEquipment',
      data: {
        id: that.data.dongshu[e.detail.value].id
      },
      method: "GET",
      success: function (res) {
        that.setData({
          equipment: res.data.obj,
        })
        if(res.data.obj.length>0){
          console.log("=====第一个设备==="+that.data.equipment[0].id)
        that.setData({
          mac:that.data.equipment[0].id
        })
          
        }

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
  //选中开始时间激发
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  //选中设备触发
  // bindPickerEqChange:function(e){
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   console.log('picker发送选择改变，携带值为', this.data.eqName[e.detail.value].id)
  //   this.setData({
  //     eqIndex: e.detail.value,
  //     eqId: this.data.eqName[e.detail.value].id
  //   })
  // },
  //选中类型触发
  bindPickerChangeType: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value == 0) {
      this.setData({
        index_type: e.detail.value,
        typeId: this.data.type[e.detail.value].id,
        isHidden: true
      })
    } else {
      this.setData({
        index_type: e.detail.value,
        typeId: this.data.type[e.detail.value].id,
        isHidden: false
      })
    }

    // this.setData({
    //   index_type: e.detail.value,
    //   typeId: this.data.type[e.detail.value].id,
    //   isHidden: false
    // })
    var that = this;
    //向后台请求小区名称数据

    wx.request({
      url: app.globalData.url + '/servlet/xiaoqu',
      data: {},
      method: "GET",
      success: function(res) {
        that.setData({
          xiaoqu: res.data.obj
        })

      }

    })
    // //通过类型的id,请求后台查询类型数据
    // wx.request({
    //   url: app.globalData.url + '/servlet/getData',
    //   data: {
    //     type: that.data.type[e.detail.value].id,
    //     userName: wx.getStorageSync('userName'),
    //     password: wx.getStorageSync("password")
    //   },
    //   method: "get",
    //   success: function(res) {
    //     if (that.data.type[e.detail.value].id == 0) {
    //       that.setData({
    //         bindName: "全部",
    //         isHidden: true
    //       })
    //     } else if (that.data.type[e.detail.value].id == 1) {
    //       that.setData({
    //         bindName: "设备"
    //       })
    //     } else {
    //       that.setData({
    //         bindName: "城市"
    //       })
    //     }
    //     that.setData({
    //       isHidden: false
    //     })
    //     that.setData({
    //       eqName: that.data.eqName.concat(res.data.obj),
    //       eqId: res.data.obj!=null?res.data.obj[0].id:""
    //     });
    //     console.log("=========")
    //   }
    // })
  },
  chooseImage: function() { // 选择图片
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
  previewImage: function() { // 预览图集

    wx.previewImage({
      urls: that.data.images

    });

  },
  submit: function() { // 提交图片，事先遍历图集数组
    var that = this;
    var fileId1 = that.data.fileId;
    var mac = that.data.mac;


    wx.request({
      url: app.globalData.url + '/servlet/addData',
      data: {
        fileId: that.data.fileId,
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        mac: that.data.mac,
        typeId: that.data.typeId

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

  }
})
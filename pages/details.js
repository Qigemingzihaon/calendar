// pages/details.js
var util = require('../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logid: '',
    uid: '',
    headimg: '',
    imgurl: [],
    peopnum: 0,
    createtime: '',
    nickname: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.6;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
      }
    })

    // console.log(options)
    let id = options.id;
    var that = this;
    util.httpRequest('/aromainfo/getposterbyid', { "logid":id}, 'POST',
      function (res) {
        let logid = res.data.logid;
        let uid = res.data.uid;
        let headimg = res.data.headimg;
        let imgurl = res.data.imgurl;
        let peopnum = res.data. peopnum;
        let createtime = res.data.createtime;
        let nickname = res.data.nickname;
        that.setData({
          logid: logid,
          uid: uid,
          headimg: headimg,
          imgurl: [imgurl],
          peopnum: peopnum,
          createtime: createtime,
          nickname: nickname,
        });
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let logid = that.data.logid;
    return {
      title: '我的专属酒话，JIU是这么拽，你也试试',
      // desc: '自定义分享描述',
      path: '/pages/share?logid=' + logid,
      imageUrl: that.data.imgurl[0],
    }
  }, 

  to_viewer: function(){
    wx.navigateTo({
      url: '/pages/viewer?id=' + this.data.logid
    })
  },
  savePhotos(upUrl){
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: upUrl,
      success(res) {
        // that.savesever(upurl)
      },
      fail(res) {
        console.log(res.errMsg)
        // that.modelshow(res.errMsg)
        if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny' ||
          res.errMsg === 'saveImageToPhotosAlbum:fail:auth denied') {
          //重新授权
          wx.showModal({
            title: '请求授权保存海报',
            content: '需要获取您的相册访问权限，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000,
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success(settingdata) {
                    // console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      that.savePhotos(upUrl)
                      // console.log('获取权限成功，再次点击图片保存到相册')
                    } else {
                      // console.log('获取权限失败')
                    }
                  },
                })
              }
            },
          })
        } else if (res.errMsg != 'saveImageToPhotosAlbum:fail cancel') {
          // that.modelshow('请重试')
        }
      },
    })
  },
  save_it: function() {
    let that = this
    wx.getImageInfo({
      src: that.data.imgurl[0],
      success: function (sres) {
        // console.log(sres.path);
        that.savePhotos(sres.path)
        // wx.saveImageToPhotosAlbum({
        //   filePath: sres.path,
        //   success(res) {
        //     util.toast('保存成功')
        //   },
        //   fail(res) {
        //     // console.log(res)
        //     if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
        //       //重新授权
        //       wx.showModal({
        //         title: '请求授权保存海报',
        //         content: '需要获取您的相册访问权限，请确认授权',
        //         success: function (res) {
        //           if (res.cancel) {
        //             wx.showToast({
        //               title: '拒绝授权',
        //               icon: 'none',
        //               duration: 1000
        //             })
        //           } else if (res.confirm) {
        //             wx.openSetting({
        //               success(settingdata) {
        //                 // console.log(settingdata)
        //                 if (settingdata.authSetting["scope.writePhotosAlbum"]) {
        //                   that.save_it();
        //                   // console.log("获取权限成功，再次点击图片保存到相册")
        //                 } else {
        //                   // console.log("获取权限失败")
        //                 }
        //               }
        //             })
        //           }
        //         }
        //       })

        //     } else if (res.errMsg != 'saveImageToPhotosAlbum:fail cancel') {
        //       util.toast('请重试')
        //     }
        //   },
        // })
      },

    })
    
  },
  onImageLoad: function (e) {
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    this.setData({
      postImageHeight: imgHeight
    })
  },
})
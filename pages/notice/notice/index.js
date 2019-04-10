// pages/notice/notice/index.js
var util = require('../../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    savepost:false,
    rule:false,
  },
  /**
   * 保存海报或跳过跳转
   */
  skip_coll(){
    // console.log('跳转')
    if (this.data.jumpToShare){
      wx.redirectTo({
        url: '/pages/share?logid='+this.data.logid+'&visittype='+this.data.visittype,
      })
    }
    else if (app.globalData.user.sessionkey){
      wx.reLaunch ({
        url: '/pages/main',
      });
    }else{
      wx.redirectTo ({
        url: '/pages/chs_calandar',
      });
    }
  },
  /**
   * 
   */
  escrulecoll(){
    this.setData({
      rule:false,
    })
  },
  savepostcoll(){
    let that = this;
    wx.showLoading({
      title: '领取中',
    })
    util.httpRequest('/aromainfo/saveactivity', {}, 'POST', function (res){
      // console.log(res)
      if(res.status==1){
        that.setData({
          savepost:true,
        })
      }else{
        util.toast(res.message, true,'none')
      }
      wx.hideLoading();
    })
  },
  lookcoll(){
    this.setData({
      rule:true,
    })
  },
  getWHcoll(){
    let that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          'windowHeight':res.windowHeight
        })
        // console.log(res.model)
        // console.log(res.pixelRatio)
        // console.log(res.windowWidth)
        // console.log(res.windowHeight)
        // console.log(res.language)
        // console.log(res.version)
        // console.log(res.platform)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWHcoll()

    if (undefined != options['logid']) {
      this.setData({
        logid: options['logid'],
        visittype: options['visittype'],
        jumpToShare: true,
      })
    }
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

  }
})
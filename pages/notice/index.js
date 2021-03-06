// pages/notice/index.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
  },
  noticecoll(){
    if (this.data.jumpToShare){
      wx.redirectTo({
        url:'/pages/notice/notice/index?logid='+this.data.logid+'&visittype='+this.data.visittype,
      })
    }else{
      wx.redirectTo({
        url:'/pages/notice/notice/index',
      })
    }
  },
  /**
   * 获取公告信息
   */
  getnoticecoll(){

  },
  getWHcoll(){
    let that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          // 'windowHeight':res.windowHeight + 'px',
          'windowHeight':res.windowHeight,
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
    this.getnoticecoll()
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
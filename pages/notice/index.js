// pages/notice/index.js
var util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
      wx.redirectTo ({
        url: '/pages/main',
      });
    }else{
      wx.redirectTo ({
        url: '/pages/chs_calandar',
      });
    }
  },
  savepostcoll(){
    console.log('保存海报')
    let that = this;
    that.skip_coll()
  },
  skipcoll(){
    console.log('跳过')
    this.skip_coll()
  },
  /**
   * 获取公告信息
   */
  getnoticecoll(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
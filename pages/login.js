// pages/login.js
var util = require('../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true, //加载loading
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
     * 获取用户是否授权用户信息
     */
  userInfoinit() {
    // console.log(this.data.canIUse,app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
      util.logincoll(this, app, this.skipcoll)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        // console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        util.logincoll(this, app, this.skipcoll)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
          util.logincoll(this, app, this.skipcoll)
        },
      })
    }
  },
  /**
   * 用户点击按钮授权
   */
  getUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.scope_userInfo = 1
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
      util.logincoll(this, app, this.skipcoll)
    } else {
      util.toast('请授权', true, 'none')
    }
  },
  /**
   * 拉取到用户信息后跳转
   */
  skipcoll() {
    if (app.globalData.user.sessionkey) {
      wx.reLaunch({
        url: '/pages/main',
      });
    } else {
      wx.redirectTo({
        url: '/pages/chs_calandar',
      });
    }
  },
  /*
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (undefined != options['logid']) {
      this.setData({
        logid: options['logid'],
        visittype: options['visittype']
      })
    }

    this.userInfoinit()
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    let time = setInterval(() => {
      // console.log(app.globalData.scope_userInfo)
      if (app.globalData.scope_userInfo >= 1) {
        if (app.globalData.scope_userInfo == 2) {
          that.setData({
            loading: false,
          })
          wx.hideLoading()
        } else {
          //
          // that.setData({ expand: app.globalData.btn_expand })
        }
        clearInterval(time)
        // that.setData({
        //   loading: false,
        // })
        this.getUserLocation()
        // wx.hideLoading()
      }
    }, 10)
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
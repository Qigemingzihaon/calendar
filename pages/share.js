// pages/share.js
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
    // console.log(JSON.stringify(options))
    // this.setData({ imgurl : [ app.globalData.choose_tp.imgurl ] })
    let logid = ''
    if(undefined != options['logid']){
      logid = options['logid'];
      if(undefined != options['visittype']){
        app.globalData.visittype = options['visittype']
      }
    }else{
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      logid = decodeURIComponent(options.scene)
      app.globalData.visittype = 3
    }

    if (undefined == app.globalData.token ||
      null == app.globalData.token ||
      undefined == app.globalData.userInfo) {

      wx.redirectTo({
        url: '/pages/accredit?logid='+logid+'&visittype='+app.globalData.visittype,
      })
    }else{
      // console.log('logid:' + logid);
      let visittype = app.globalData.visittype;
      // console.log('visittype:' + visittype);
      var that = this;
      util.httpRequest('/aromainfo/getposterbyid', { "logid": logid, "visittype": visittype }, 'POST',
        function (res) {
          if (res.status==1){
            that.setData({
              logid: res.data.logid,
              uid: res.data.uid,
              headimg: res.data.headimg,
              imgurl: [res.data.imgurl],
              peopnum: res.data.peopnum,
              createtime: res.data.createtime,
              nickname: res.data.nickname,
            });
          }else{
            util.toast('内容不存在哦！',true,'none')
          }
          
        }
      )
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

  previewImage: function (e) {
    var that = this;
    wx.previewImage({
      current: this.data.imgurl, // 当前显示图片的http链接   
      urls: this.data.imgurl // 需要预览的图片http链接列表   
    })
  },

  to_index: function () {
    wx.navigateTo({
      url: '/pages/main',
    })
  },

  onShareAppMessage: function () {
    let that = this;
    let logid = that.data.logid;
    return {
      title: '我的专属酒话，JIU是这么拽，你也试试',
      // desc: '自定义分享描述',
      path: '/pages/share?logid=' + logid ,
      imageUrl: that.data.imgurl[0],
    }
  }, 

})
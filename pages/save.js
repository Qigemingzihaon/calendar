// pages/save.js
var util = require('../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgalist: [''],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.5;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
      }
    })

    this.setData({ imgalist: [app.globalData.my_post.imgurl]})

  },
  previewImage: function (e) {
    var that = this;
    wx.previewImage({
      current: app.globalData.my_post.imgurl, // 当前显示图片的http链接   
      urls: app.globalData.my_post.imgurl // 需要预览的图片http链接列表   
    })
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
      current: this.data.imgalist, // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    })
  },

  to_index:function(){
    wx.navigateTo({
      url: '/pages/main',
    })
  },
  
  onShareAppMessage: function () {
    let that = this;
    // let rnd = Math.random()*1000000;
    // let rnd = (new Date()).getTime();
    // console.log('rnd:' + rnd);
    let logid = app.globalData.my_post.logid;
    // console.log('logid:' + logid);

    //todo 是否调用统计分享接口？
    return {
      title: '我的专属酒话，JIU是这么拽，你也试试',
      path: '/pages/share?logid=' + logid, //+'&randnum='+rnd,
      imageUrl: app.globalData.my_post.imgurl
    }
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
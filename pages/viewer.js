// pages/viewer.js
var util = require('../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_list:[],
    logid:'',
    searchPageNum: 1,
    callbackcount: 20,
    searchLoading: true,
    searchLoadingComplete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          logid: options['id'],
      });
      this.get_info();
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



  //获取列表数据
  get_info: function () {
    var that = this;
    var page = that.data.searchPageNum;
    var num = that.data.callbackcount;
    var logid = that.data.logid;
    that.setData({
      searchLoadingComplete: true,
    });
    util.httpRequest('/aromainfo/getvisitlistbylogid', {
      'page': page, 'size': num, 'logid': logid, 'sort': '1'}, 'POST',
      function (res) {
        // console.log('第' + page+'页');
        // console.log(res);
        // console.log('长度：' + res.data.length);
        if (res.status==1){
          if (undefined == res.data.length || res.data.length < num){
            that.setData({
              data_list: that.data.data_list.concat(res.data),
              searchLoadingComplete: true,
              searchLoading:false,
              count: res.count
            });
          }else{
            that.setData({
              data_list: that.data.data_list.concat(res.data),
              searchLoadingComplete: false,
              count: res.count
            });
          }
        }else{
          util.toast('稍后再试',true,'none')
        }
      }
    )
  },

//滚动到底部触发事件  
  searchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
      });
      that.get_info();
    }
  },
  onPageScroll:function(e){
    // console.log(e);//{scrollTop:99}
  },
  onReachBottom() {
    let that = this;
    // console.log(that.data.searchLoading && !that.data.searchLoadingComplete,that.data.searchLoading)

    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
      });
      that.get_info();
    }else if(that.data.onload){
      util.toast('已经到底了哦',true,'none')
      // console.log('站务')
    }
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '我的专属酒话，JIU是这么拽，你也试试',
      // desc: '自定义分享描述',
      path: '/pages/accredit',
    }
  }, 
})
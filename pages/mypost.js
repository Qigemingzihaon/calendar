// pages/mypost.js
var util = require('../utils/util.js');
var app = getApp();
let col1H = 0;
let col2H = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    p_list:[],
    floorstatus:false,
    topNum: 0,
    page: 1,
    pagesize: 10,
    onload: false,
    loaded: false,
    hiddenmodalput:true,
    items: {
      name: 1, value: '是否不再提醒',checked:false,
    },
    index:null,
    request:true,
  },
  radiocoll(){
    this.setData({
      'items.checked':!this.data.items.checked
    })
  },
  cancelM:function(e){
    this.setData({
      hiddenmodalput: true,
      'items.checked':false,
    })
  },
  confirmM: function (e) {
    this.setData({
      hiddenmodalput: true,
    })
    this.delete_coll()
  },
  delete_coll(){
    let that = this;
    let p_list = [...this.data.p_list];
    let logid = p_list.splice(that.data.index,1)[0].logid;
    if(!that.data.request){
      return
    }
    util.httpRequest('/aromainfo/deletelog', {
      'logid': logid
    }, 'POST',
      function (res) {
        if(res.status==1){
          that.setData({
            p_list:p_list,
          })
        }else{
          util.toast('稍后再试',true,'none')
        }
        that.setData({
          request:true,
        })
      }
    )
  },
  /**
   * 删除海报
   */
  deletecoll(e){
    let index = e.currentTarget.dataset.index||e.target.dataset.index;
    if(this.data.items.checked){
      this.setData({
        index:index
      })
      this.delete_coll()
    }else{
      this.setData({
        hiddenmodalput: false,
        index:index
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log("用户信息");
    // var avatarUrl = app.globalData.userInfo.avatarUrl;
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl
      // avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLnsUmGP9kZwNsaIwrPqlgLQ9lwq67zDBzrQnygQRnXib6LpHG1jh8hMhMhoGhUnPzty7VnKjHkI1A/132'
    });
    this.get_info();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.verifycoll()
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
    var page = that.data.page;
    var num = that.data.pagesize;
     that.setData({
       onload:true,
     });
    util.httpRequest('/aromainfo/getposterlist', {
      'page': page, 'size': num, 'uid': '','myposter': '1','sort':'1'
    }, 'POST',
      function (res) {
        // console.log(res.data.length,undefined != res.data.length,undefined == res.data.length || res.data.length < num)
        if(res.status==1 && undefined != res.data.length){
          that.setData({
            p_list: that.data.p_list.concat(res.data),
            onload: false,
            loaded: undefined == res.data.length || res.data.length == num
          });
        }else if(res.status==1&&undefined == res.data.length){
          util.toast('没有海报',true,'none')
        }else{
          util.toast('稍后再试',true,'none')
        }
        wx.hideLoading();
      }
    )
  },

  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    // console.log(!that.data.onload && that.data.loaded)
    if (!that.data.onload && that.data.loaded) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把searchPageNum+1
        onload:true
      });
      wx.showLoading({
        title: '加载中',
      })
      that.get_info();
    }
  },

//滚动事件
  scrolltoupper: function(e){
    // console.log(e);
    if (e.detail.scrollTop > 150) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  // 置顶
  goTop: function(){
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      topNum: this.data.topNum = 0
    });
  },

  show_detail: function(e){
    // console.log(e)
    wx.navigateTo({
      url: '/pages/details?id='+e.currentTarget.dataset.id,
    })
  },
  onPageScroll:function(e){
    // console.log(e);//{scrollTop:99}
    if (e.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  onReachBottom() {
    let that = this;
    // console.log(!that.data.onload && that.data.loaded)
    if (!that.data.onload && that.data.loaded) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把searchPageNum+1
        onload:true
      });
      wx.showLoading({
        title: '加载中',
      })
      that.get_info();
    }else if(!that.data.onload){
      // console.log('站务')
      util.toast('已经到底了哦',true,'none')
    }
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '我的专属酒话，JIU是这么拽，你也试试',
      // desc: '自定义分享描述',
      path: '/pages/accredit',
    }
  }, 
})
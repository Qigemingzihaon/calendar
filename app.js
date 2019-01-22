//app.js
var util = require('/utils/util.js')
App({
  /**
   * 更新版本
   */
  applyUpdate(){
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate)
        if(res.hasUpdate){
          wx.showModal({
            title: '提示!',
            content: '发现新版本，请注意更新提示。'
          })
        }
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否马上重启小程序？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '提示!',
          content: '新的版本下载失败,请重启后再试。'
        })
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示!',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 验证权限
   */
  verifycoll(){
    if (undefined == this.globalData.token ||
      null == this.globalData.token ||
      undefined == this.globalData.userInfo||!wx.getStorageSync('token')) {
      wx.redirectTo({
        url: '/pages/accredit',
      })
    }
  },
  onLaunch: function() {
    this.applyUpdate()
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // console.log(logs)
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          this.globalData.scope_userInfo = 1;
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang:'zh_CN',
            success: (res) => {
              // console.log(res)
              // console.log(this)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
          })
        }else{
          this.globalData.scope_userInfo = 2;
        }
      },
    })
  },

  onShow: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    
    // console.log("onShow:" + options);
    var a = JSON.stringify(options);
    // console.log("a:"+a);
    if (options.shareTicket == undefined){
      // 私聊
      this.globalData.visittype = 2;
    } else {
      // 群聊
      this.globalData.visittype = 1;
    }
    // console.log(this.globalData.visittype);
  },

  globalData: {
    scope_userInfo: null,//是否可以获取到用户信息1可以2不可以
    userInfo: null,
    token: null,
    // post: [],
    keyword: { 'keyword': '', 'id': 0 }, //当前关键词
    name: '', //用户姓名
    choose_wine: [], //选中的酒话
    choose_tp: [], //选中的模版
    need_reload: false, //是否需要重新生成海报，从编辑页面跳回时需设置为true
    weather:[], //天气数据
    my_post:[],
    btn_expand:false,
    curt_QR_code: '/images/poster_4.jpg', //默认的二维码图片，记得替换！
    visittype:0,
    family:false,
  },
})

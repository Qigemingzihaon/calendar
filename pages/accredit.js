// pages/accredit .js
const app = getApp()
var util = require('../utils/util.js')
var QQMapWX = require('../utils/qqmap-wx-jssdk.min.js')
var qqmapsdk
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true, //加载loading
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    style:'',
    windowWidth:0,
    windowHeight:0,
    jumpToShare: false,
  },
  getWH(){
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          style:'width:'+res.windowWidth+'px;height:'+res.windowHeight+'px;',
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      },
    })
  },
  getWeather: function() {
    let that = this
    //获取天气
    let dt = this.data.city == '' ? {} : { city: this.data.city }
    util.httpRequest('/aromainfo/weather', dt, 'POST', function(res) {
      //console.log(res)
      if(res.status==1){
        app.globalData.weather = res.data
      }
    })
  },
  getUserLocation: function() {
    let vm = this
    wx.getSetting({
      success: (res) => {
        // console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (
          res.authSetting['scope.userLocation'] != undefined &&
          res.authSetting['scope.userLocation'] != true
        ) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置以获取天气数据，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000,
                })
                vm.getWeather()
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting['scope.userLocation'] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000,
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000,
                      })
                      vm.getWeather()
                    }
                  },
                })
              }
            },
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation()
        } else {
          //调用wx.getLocation的API
          vm.getLocation()
        }
      },
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        vm.getLocal(latitude, longitude)
      },
      fail: function(res) {
        vm.getWeather()
        // console.log('fail' + JSON.stringify(res))
      },
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let vm = this
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      success: function(res) {
        // console.log(JSON.stringify(res))
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude,
        })
      },
      fail: function(res) {
        // vm.getWeather();
        // console.log(res)
      },
      complete: function(res) {
        // console.log(res);
        vm.getWeather()
      },
    })
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
      util.toast('请授权', true,'none')
    }
  },
  /**
   * 拉取到用户信息后跳转
   */
  skipcoll(){
    // console.log('跳转')
    if (app.globalData.report&&app.globalData.todaynum<1){
      if (this.data.jumpToShare){
        wx.redirectTo({
          url: '/pages/notice/index?logid='+this.data.logid+'&visittype='+this.data.visittype,
        })
      }else{
        wx.redirectTo({
          url: '/pages/notice/index',
        })
      }
    }else{
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.loadFontFace({
    //   family: 'FZShuSong-Z01S',
    //   source: 'url("https://gatewayfile.oss-cn-shenzhen.aliyuncs.com/aroma/font/FZSSJW--GB1-0.ttf")',
    //   // source: 'url("https://leaguer-1256376813.cos.ap-chengdu.myqcloud.com/f862 3ead47634224875b0b42e733cb07.ttf")',
    //   success: function(res) {
    //     // console.log(res) //  loaded
    //   },
    //   fail: function(res) {
    //     // console.log(res) //  error
    //   },
    //   complete: function(res) {
    //     // console.log(res);
    //   }
    // });
    if (undefined != options['logid']) {
      this.setData({
        logid: options['logid'],
        visittype: options['visittype'],
        jumpToShare: true,
      })
    }
    this.getWH()
    qqmapsdk = new QQMapWX({
      key: 'KYEBZ-MPR35-LGSIC-Q3TI4-XD677-BZFKP',
    })
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
        if(!app.globalData.weather.city){
          this.getUserLocation()
        }
        // wx.hideLoading()
      }
    }, 10)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

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

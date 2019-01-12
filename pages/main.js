// pages/main.js
var util = require('../utils/util.js')
var tpl = require('../utils/tpl.js')
var QQMapWX = require('../utils/qqmap-wx-jssdk.min.js')
var base64src = require('../utils/base64src.js')
var qqmapsdk
const fsm = wx.getFileSystemManager();
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    img_src: '',
    expand: false,
    plan: 0,
    planshow: false,
    windowWidth: 0,
    windowHeight: 0,
    canvasshow: false,
    canvasstyle: 'width: 750px;height: 1334px;',
    templatestyle: [
      {
        name: 'temid1',
        style: {
          background_image: {
            w: 750,
            h: 703,
            s_x: 0,
            s_y: 0,
            url: 'http://baike.baidu.com/cms/rc/240x112dierzhou.jpg',
          },
          keyword: '',
          weather: '',
        },
      },
    ],
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getimage: false,
    poster: false,
    postImageHeight: '1334rpx',
    overtime:false,
    gettime:false,
  },
  /**
   * init
   */
  initcoll(){
    let Accelerometer = 0;
    wx.onAccelerometerChange(function (res) {
      // console.log(res.x)
      // console.log(res.y)
      // console.log(res.z)
      if (res.x > .7 && res.y > .7) {
        // console.log('摇一摇')
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.67;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
      }
    })
    qqmapsdk = new QQMapWX({
      key: 'KYEBZ-MPR35-LGSIC-Q3TI4-XD677-BZFKP',
    })
    util.getWHcoll(this)
    
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '我的专属酒话，JIU是这么拽，你也试试',
      // desc: '自定义分享描述',
      path: '/pages/accredit',
    }
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(app.globalData.family){

    }else{
      wx.loadFontFace({
        family: 'FZShuSong-Z01S',
        source: 'url("https://gatewayfile.oss-cn-shenzhen.aliyuncs.com/aroma/font/FZSSJW--GB1-0.ttf")',
        success: function(res) {
          // console.log(res) //  loaded
          app.globalData.family = true;
        },
        fail: function(res) {
          // console.log(res) //  error
        },
        complete: function(res) {
          // console.log(res);
        }
      });
    }
    // this.userInfoinit()
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    this.initcoll()
    let time = setInterval(() => {
      // console.log(app.globalData.scope_userInfo)
      if(app.globalData.scope_userInfo>=1){
        if(app.globalData.scope_userInfo==2){
          wx.redirectTo({
            // url: '/pages/chs_calandar',
            url: '/pages/accredit',
          })
        }else{
          that.setData({ expand: app.globalData.btn_expand})
        }
        clearInterval(time)
        that.setData({
          loading:false
        })
        wx.hideLoading();
      }
    }, 10)
    // console.log(wx.getStorageSync('myposter'))
    this.setData({
      // img_src: wx.getStorageSync('myCanvas'),
      img_src: wx.getStorageSync('myposter'),
    })
  },
  loadingcoll() {
    this.setData({
      // img_src: '../images/Recovery.gif',
      img_src: '../images/GIF.gif',
      getimage: false,
      overtime:true,
      poster: false,
      plan: 0,
    })
    clearInterval(this.data.time)
    let [that,overtime] = [this,0]
    let time = setInterval(() => {
      overtime++;
      let a = that.data.getimage //图片加载
      let b = that.data.poster //海报绘制完成
      // console.log(a, this.data.poster)
      if (that.data.plan <= 98) {
        if (that.data.plan < 40) {
          that.setData({
            plan: that.data.plan + 1,
          })
        }
        if (that.data.plan < 68 && a) {
          overtime=0;
          this.setData({
            img_src: '../images/GIF.gif',
            plan: that.data.plan + 1,
          })
        }
        if (b) {
          overtime=0;
          this.setData({
            img_src: '../images/GIF.gif',
            plan: that.data.plan + 1,
          })
        }
      }
      if (that.data.plan > 98 && (a && b)) {
        clearInterval(time)
        //显示海报
        this.setData({
          img_src: wx.getStorageSync('myCanvas'),
          plan: 0,
          planshow: false,
        })
      }
      if(overtime>6000&&(!a||!b)){
        clearInterval(time);
        util.toast('超时请重试', false,'none')
        this.setData({
          overtime:false,
        });
      }
    }, 10)
    that.setData({
      time: time,
      planshow: true,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // console.log(wx.canIUse('loadFontFace'))
    let time = setInterval(() => {
      let token = wx.getStorageSync('token')
      if(!this.data.loading&&app.globalData.scope_userInfo==1&&token){
        clearInterval(time)
        // console.log(wx.getStorageSync('token'),!wx.getStorageSync('myposter'),0 == app.globalData.weather.length)
        // if(!wx.getStorageSync('myCanvas')){
        if(!wx.getStorageSync('myposter')){
          //后端获取海报图片
          this.getpostercoll()
          //前端绘制海报图片
          // this.chg_tpl()
        }
        else if (app.globalData.need_reload) {
          //上传自定义文本获取海报图片
          this.getpostercoll(true)
          //前端绘制海报图片
          // this.loadingcoll()
          // this.getimagecoll()
        }
      }
    },10)
  },
  /**
   * 获取后端海报
   */
  getpostercoll(B){
    let that = this;
    if(that.data.gettime){
      return
    }
    setTimeout(() => {
      that.setData({
        gettime:false,
      })
    }, 2000);
    that.loadingnewcoll()
    that.setData({
      gettime:true,
    })
    let data = {};
    if(B){
      data.jhword = app.globalData.choose_wine.wordbody;
      data.nickname = app.globalData.name;
      data.temid = app.globalData.choose_tp.temid;
      data.wine = app.globalData.keyword.keyword;
      data.number = app.globalData.number;
    }
    if(app.globalData.weather.city){
      data.city = app.globalData.weather.city;
    }
    util.httpRequest('/aromainfo/generate', data, 'POST', function (qrres){
      // console.log(qrres)
      if(qrres.status==1){
        base64src.base64src(qrres.data.url,function(fpath){
          // console.log(fpath)
          app.globalData.choose_tp.temid = qrres.data.temid;
          app.globalData.choose_wine.wineid = qrres.data.keywordid;
          app.globalData.keyword.id = qrres.data.wineid;
          // wx.setStorageSync('myposter', qrres.data)
          wx.setStorageSync('myposter', fpath)
          that.setData({
            poster: true,
          })
          // 'function' == typeof callback && callback()
        },function(e){
          // console.log(e,'失败')
          util.toast('请重试', false,'none');
          that.setData({
            overtime:false,
          })
          // 'function' == typeof callback && callback()
        })
      }else{
        util.toast('请重试', false,'none');
        that.setData({
          overtime:false,
        })
      }
    })
  },
  /**
   * 获取后端海报图片loading
   */
  loadingnewcoll(){
    this.setData({
      img_src: '../images/GIF.gif',
      getimage: true,
      overtime:true,
      poster: false,
      plan: 0,
    })
    clearInterval(this.data.time)
    let [that,overtime] = [this,0]
    let time = setInterval(() => {
      overtime++;
      let a = that.data.getimage //图片加载
      let b = that.data.poster //海报绘制完成
      // console.log(a, this.data.poster)
      if (that.data.plan <= 98) {
        if(that.data.plan == 40){
          this.setData({
            getimage:true
          })
        }
        if(that.data.plan<68){
          this.setData({
            plan: that.data.plan + 1,
          })
        }
        if (that.data.plan < 68 && a) {
          overtime=0;
          this.setData({
            img_src: '../images/GIF.gif',
            plan: that.data.plan + 1,
          })
        }
        if (b) {
          overtime=0;
          this.setData({
            img_src: '../images/GIF.gif',
            plan: that.data.plan + 1,
          })
        }
      }
      
      if (that.data.plan > 98 && (a && b)) {
        clearInterval(time)
        // var array = wx.base64ToArrayBuffer(wx.getStorageSync('myposter')); 
        // var base64 = wx.arrayBufferToBase64(array); 
        //显示海报
        this.setData({
          // img_src: "data:image/png;base64," + base64,
          img_src: wx.getStorageSync('myposter'),
          plan: 0,
          planshow: false,
        })
      }
      if(overtime>500&&(!a||!b)){
        clearInterval(time);
        util.toast('超时请重试', false,'none')
        this.setData({
          overtime:false,
        });
      }
    }, 40)
    that.setData({
      time: time,
      planshow: true,
    })
  },
  /**
   * 点击查看大图
   */
  previewImage(e) {
    var that = this;
    if(!that.data.planshow){
      // console.log(that.data.img_src)
      wx.previewImage({
        current: that.data.img_src, // 当前显示图片的http链接   
        urls: [that.data.img_src] // 需要预览的图片http链接列表   
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.time)
  },

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
   * 展开/收起按钮
   */
  expand: function() {
    if(this.data.planshow){
      return
    }
    app.globalData.btn_expand = !this.data.expand
    this.setData({ expand: !this.data.expand })
  },
  getimagecoll() {
    let that = this
    this.getRQcode(function(res){
      let imgobj = {
        img_back: app.globalData.choose_tp.imgrand, //backgroundurl, //
        // QR_codeurl: app.globalData.curt_QR_code,
        logotext: util.getLogoTextImgUrl(),
        img_logo: util.getLogoImgUrl(),
        img_avatar: app.globalData.userInfo.avatarUrl,
      }
      let imgs_n = 0
      for (const key in imgobj) {
        if (imgobj.hasOwnProperty(key)) {
          if (app.globalData[key] && !([key] == 'img_back' || [key] == 'QR_codeurl')) {
            imgs_n = imgs_n + 1
          } else {
            wx.getImageInfo({
              src: imgobj[key],
              success(res) {
                app.globalData[key] = res.path
                if (++imgs_n == 4) {
                  util.canvascoll(that, app.globalData)
                  that.setData({
                    getimage: true,
                  })
                }
              },
              fail() {
                // console.log("getImageInfo failed!")
                app.globalData[key] = '../images/tx.jpg';
                // that.getimagecoll()
                if (++imgs_n == 4) {
                  util.canvascoll(that, app.globalData)
                  that.setData({
                    getimage: true,
                  })
                }
              }
            })
          }
        }
      }
    })
    
  },
  /**
   * 获取二维码
   */
  getRQcode(callback){
    let qrdata = {
      page:'/pages/share',
      width:150,
    }
    // console.log('start request qrcode....')
    util.httpRequest('/aromainfo/getrqcode', qrdata, 'POST', function (qrres){
      // console.log(qrres)
      try{
        let resDatas = JSON.parse(qrres.data)
        // console.log('sss')
        app.globalData.curt_QR_code = ''
        'function' == typeof callback && callback()
      }catch(ex){
        base64src.base64src(qrres.data,function(fpath){
          // console.log(fpath)
          app.globalData.curt_QR_code = fpath
          'function' == typeof callback && callback()
        },function(e){
          // console.log(e)
          app.globalData.curt_QR_code = ''
          'function' == typeof callback && callback()
        })
      }
    })
  },
  /**
   * 更换一个模版
   */
  chg_tpl: function() {
    if(this.data.planshow){
      return
    }
    let that = this
    // console.log(that.data.overtime&&that.data.planshow)
    if(that.data.overtime&&that.data.planshow){
      return
    }
    //后端获取海报图片
    this.getpostercoll()
    return
    this.loadingcoll()
    //先随机获取一个模版
    util.httpRequest(
      '/aromainfo/gettemplaterand',
      { size: 1 },
      'POST',
      function(res) {
        // that.getRQcode()
        app.globalData.choose_tp = res.data[0]
        //下载海报图
        that.chg_tpl_stpe2(true)
      }
    )
  },
  chg_tpl_stpe2(b){
    let that = this;
    //检查是否编辑过，没编辑过的，随机获取酒话和关键词
    if (app.globalData.choose_wine.length == 0||b) {
      util.httpRequest('/aromainfo/getkeywordandwine', {}, 'POST', function (
        res
      ) {
        if(res.status == 1){
          app.globalData.choose_wine = res.data.wine[0]
          app.globalData.keyword = res.data.keyword
          that.getimagecoll()
        }else{
          // that.chg_tpl_stpe2()
        }
        // console.log(res)
      })
    } else {
      that.getimagecoll()
    }
  },

  /**
   * 跳到编辑模版
   */
  edit_tpl: function() {
    if(this.data.planshow){
      return
    }
    //调用统计接口
    util.httpRequest('/aromainfo/useedit', {}, 'POST', function() {
      wx.navigateTo({
        url: '/pages/edit',
      })
    })
  },

  to_my: function() {
    if(this.data.planshow){
      return
    }
    wx.navigateTo({
      url: '/pages/mypost',
    })
  },

  modelshow(data, time = 30000) {
    wx.showToast({
      title: data,
      icon: 'none',
      duration: time,
    })
  },
  savePhotos(upUrl,upurl){
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: upUrl,
      success(res) {
        that.savesever(upurl)
      },
      fail(res) {
        console.log(res.errMsg)
        // that.modelshow(res.errMsg)
        if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny' ||
          res.errMsg === 'saveImageToPhotosAlbum:fail:auth denied') {
          //重新授权
          wx.showModal({
            title: '请求授权保存海报',
            content: '需要获取您的相册访问权限，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000,
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success(settingdata) {
                    // console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      that.savePhotos(upUrl,upurl)
                      // console.log('获取权限成功，再次点击图片保存到相册')
                    } else {
                      // console.log('获取权限失败')
                    }
                  },
                })
              }
            },
          })
        } else if (res.errMsg != 'saveImageToPhotosAlbum:fail cancel') {
          // that.modelshow('请重试')
        }
      },
    })
  },
  savesever(upUrl){
    util.httpRequest('/aromainfo/save',
      {
        imgurl: upUrl,
        wineid: app.globalData.choose_wine.wineid,
        wordid:
          app.globalData.keyword.id > 0
            ? app.globalData.keyword.id
            : '',
        temid: app.globalData.choose_tp.temid,
      },
      'POST',
      function(res) {
        if (res.status == 1) {
          app.globalData.my_post = res.data
          //调用统计接口
          util.httpRequest(
            '/aromainfo/usesave',
            { sendid: res.data.logid },
            'POST',
            function() {}
          )
          wx.hideLoading();
          wx.navigateTo({
            url: '/pages/save',
          })
        } else {
          wx.hideLoading();
          util.toast('提交海报失败:' + res.message, true,'none')
        }
      })
  },
  to_save: function() {
    if(this.data.planshow){
      return
    }
    let that = this
    wx.showLoading({
      title: '保存中…',
    })
    //提交海报图片到服务器
    util.uploadImage(
      that.data.img_src,
      function(res) {
        // console.log(res)
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data)
          let upUrl = data.data[0]
          wx.getImageInfo({
            src: upUrl,
            success(res) {
              // console.log(res.width)
              // console.log(res.path)
              that.savePhotos(res.path,upUrl)
            }
          })
        } else {
          wx.hideLoading();
          util.toast('海报上传失败:' + res.errMsg, true,'none')
        }
      },
      function(res) {
        wx.hideLoading();
        util.toast('海报上传失败，请重试！', true,'none')
      }
    )
 
  },

  getWeather: function() {
    return
    let that = this
    //获取天气
    let dt = this.data.city == '' ? {} : { city: this.data.city }
    util.httpRequest('/aromainfo/weather', dt, 'POST', function(res) {
      //console.log(res)
      app.globalData.weather = res.data
      if (app.globalData.need_reload) {
        that.loadingcoll()
        that.getimagecoll()
        app.globalData.need_reload = false
      } else { //if (!wx.getStorageSync('myCanvas')) {
        that.chg_tpl()
      }
    })
  },
})

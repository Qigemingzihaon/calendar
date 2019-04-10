// pages/chs_calandar.js
var util = require ('../utils/util.js');
const app = getApp ();
Page ({
  /**
   * 页面的初始数据
   */
  data: {
    selected_id: -1,
    selected_name: '',
    xz: [
      {
        name: '白羊座',
        date: '3.21-4.19',
        pic: '/images/constellation1.png',
        selected: 0,
      },
      {
        name: '金牛座',
        date: '4.20-5.20',
        pic: '/images/constellation2.png',
        selected: 0,
      },
      {
        name: '双子座',
        date: '5.21-6.21',
        pic: '/images/constellation3.png',
        selected: 0,
      },
      {
        name: '巨蟹座',
        date: '6.22-7.22',
        pic: '/images/constellation4.png',
        selected: 0,
      },
      {
        name: '狮子座',
        date: '7.23-8.22',
        pic: '/images/constellation5.png',
        selected: 0,
      },
      {
        name: '处女座',
        date: '8.23-9.22',
        pic: '/images/constellation6.png',
        selected: 0,
      },
      {
        name: '天枰座',
        date: '9.23-10.23',
        pic: '/images/constellation7.png',
        selected: 0,
      },
      {
        name: '天蝎座',
        date: '10.24-11.22',
        pic: '/images/constellation8.png',
        selected: 0,
      },
      {
        name: '射手座',
        date: '11.23-12.21',
        pic: '/images/constellation9.png',
        selected: 0,
      },
      {
        name: '摩羯座',
        date: '12.22-1.19',
        pic: '/images/constellation10.png',
        selected: 0,
      },
      {
        name: '水瓶座',
        date: '1.20-2.18',
        pic: '/images/constellation11.png',
        selected: 0,
      },
      {
        name: '双鱼座',
        date: '2.19-3.20',
        pic: '/images/constellation12.png',
        selected: 0,
      },
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse ('button.open-type.getUserInfo'),
  },
  userInfoinit () {
    // console.log(this.data.canIUse,app.globalData.userInfo)
    if (app.globalData.userInfo) {
        this.setData ({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
        });
        util.logincoll(this, app,this.submit);
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log(res)
        this.setData ({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
        util.logincoll(this, app,this.submit);
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo ({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData ({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
          util.logincoll(this,app, this.submit);
        },
      });
    }
  },

  // logincoll () {
  //   var _this = this;
  //   // 登录
  //   wx.login ({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       if (res.code) {
  //         util.httpRequest (
  //           '/aromainfo/login',
  //           {code: res.code},
  //           'POST',
  //           function (re) {
  //             if (re) {
  //               if (re.status == 1) {
  //                 app.globalData.token = re.data.token;
  //                 try {
  //                   wx.setStorageSync ('token', re.data.token);
  //                   if (re.data.report) {
  //                     let data = {
  //                       usersex: app.globalData.userInfo.gender,
  //                       country: app.globalData.userInfo.country,
  //                       headimg: app.globalData.userInfo.avatarUrl,
  //                       city: app.globalData.userInfo.city,
  //                       nickname: app.globalData.userInfo.nickName,
  //                     };
  //                     _this.pushuser (data);
  //                   } else {
  //                     _this.submit ();
  //                   }
  //                 } catch (e) {
  //                   wx.showToast ({
  //                     title: '请重试',
  //                     icon: 'none',
  //                     duration: 1000,
  //                     mask: true,
  //                   });
  //                 }
  //               }
  //             } else {
  //               util.toast ('请重试！');
  //             }
  //           }
  //         );
  //       } else {
  //         util.toast ('请重试！');
  //         console.log ('登录失败: ' + res.errMsg);
  //       }
  //     },
  //   });
  // },
  // pushuser (data) {
  //   let _this = this;
  //   util.httpRequest ('/aromainfo/pushuser', data, 'POST', function (re) {
  //     console.log (re);
  //     if (re) {
  //       if (re.status == 1) {
  //         _this.submit ();
  //       }
  //     } else {
  //       util.toast ('请重试',false);
  //     }
  //   });
  // },
  getUserInfo: function (e) {
    // console.log (e);
    if (e.detail.userInfo) {
      app.globalData.scope_userInfo=1;
      app.globalData.userInfo = e.detail.userInfo;
      this.setData ({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      });

      util.logincoll(this,app, this.submit);
      // this.submit()
    } else {
      util.toast ('请授权',false);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.userInfoinit ();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},


  selectone: function (event) {
    // console.log (event);
    if (this.data.selected_id != -1) {
      var item = 'xz[' + this.data.selected_id + '].selected';
      this.setData ({
        [item]: 0,
      });
    }

    this.data.selected_name = event.currentTarget.dataset.name;
    this.data.selected_id = event.currentTarget.dataset.id;

    var item = 'xz[' + this.data.selected_id + '].selected';
    this.setData ({
      [item]: 1,
    });
  },

  submit: function (e) {
    // console.log(e)
    if (this.data.selected_id == -1) {
      util.toast ('请选择您的星座！', true,'none');
      return;
    }

    wx.setStorageSync ('xz_id', this.data.selected_id);
    wx.setStorageSync ('xz_name', this.data.selected_name);
    // wx.redirectTo ({
    //   url: '/pages/main',
    // });
    util.httpRequest (
      '/aromainfo/setupconstellation',
      {token: app.globalData.token, constellationname: this.data.selected_name},
      'POST',
      function (res) {
        // console.log (res);
        if (res.status == 1) {
          wx.reLaunch ({
            url: '/pages/main',
          });
        } else {
          util.toast (res.message, true);
        }
      }
    );
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
});

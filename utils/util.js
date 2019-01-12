const requestUrl = 'https://lzljhyrl.lzlj.com/aroma/';//正式
// const requestUrl = 'https://www.jollykeys.cn/aroma/'; //测试
const uploadUrl = 'https://lzljhyrl.lzlj.com/aroma/oss/uploadfile';//正式
// const uploadUrl = 'https://www.jollykeys.cn/aroma/oss/uploadfile';//测试
// const uploadUrl = 'http://www.jollykeys.cn/gate/oss/uploadfile'
const logoUrl =
  'https://leaguer-1256376813.cos.ap-chengdu.myqcloud.com/f58e4ae2aec54b39b27d561419b5890e.png'
const logourl2 = 'https://leaguer-1256376813.cos.ap-chengdu.myqcloud.com/56b083db16494002b9591647a14daa4d.png'
const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function httpRequest(url, data, method, callBack) {
  var _self = this
  let header = { 'content-type': 'application/json' }
  wx.getStorageSync('token')? (header.token = wx.getStorageSync('token')): true
  wx.request({
    url: requestUrl + url,
    data: data,
    header: header,
    method: method,
    success: function(res) {
      callBack(res.data, null) // 成功后回调方法
    },
    fail: function(erro) {
      callBack([], erro)
      // console.log(erro)
    },
  })
}

function uploadImage(filepath, succ, failed) {
  wx.compressImage({
    src: filepath, // 图片路径
    quality: 80, // 压缩质量
    success(res) {
      // console.log(res)
      wx.uploadFile({
        url: uploadUrl,
        filePath: res.tempFilePath,
        name: 'file',
        formData: {},
        success(res) {
          'function' == typeof succ && succ(res)
          // do something
        },
        fail(res) {
          'function' == typeof failed && failed(res)
        },
      })
      // do something
    },
    fail(res) {
      'function' == typeof failed && failed(res)
    },
  })
}

function toast(title, is_err,icon='',duration=3000) {
  let img = is_err ? '/images/close.png' : ''
  if(icon!=''){
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration,
      mask: true,
    })
  }else{
    wx.showToast({
      title: title,
      icon: icon,
      image: img,
      duration: duration,
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
}

function logincoll(_this, app, callback) {
  // var _this = this;
  // 登录
  wx.login({
    success: (res) => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (res.code) {
        httpRequest('/aromainfo/login', { code: res.code }, 'POST', function(
          re
        ) {
          if (!re) {
            util.toast('登录失败，请重试！')
            return
          }
          if (re.status == 1) {
            // console.log(re.data)
            wx.setStorageSync ('token', re.data.token);
            app.globalData.token = re.data.token
            app.globalData.user = re.data.user
            // console.log(app.globalData.user)
            try {
              wx.setStorageSync('token', re.data.token)
              if (re.data.report) {
                let data = {
                  usersex: app.globalData.userInfo.gender,
                  country: app.globalData.userInfo.country,
                  headimg: app.globalData.userInfo.avatarUrl,
                  city: app.globalData.userInfo.city,
                  nickname: app.globalData.userInfo.nickName,
                }
                pushuser(data, _this, callback)
              } else {
                'function' == typeof callback && callback()
                // _this.submit();
              }
            } catch (e) {
              util.toast('请重试！')
              // wx.showToast({
              //   title: '请重试',
              //   icon: 'none',
              //   duration: 1000,
              //   mask: true,
              // });
            }
          }
        })
      } else {
        util.toast('请重试！')
        // console.log('登录失败: ' + res.errMsg)
      }
    },
  })
}
function pushuser(data, _this, callback) {
  // let _this = this;
  httpRequest('/aromainfo/pushuser', data, 'POST', function(re) {
    // console.log(re)
    if (re && re.status == 1) {
      // wx.setStorageSync('user', re.data)
      'function' == typeof callback && callback(re.data)
      // _this.submit();
    } else {
      util.toast('请重试', false)
    }
  })
}

function getUrlImage(url, callback) {
  if (url == '') url = logoUrl
  wx.getImageInfo({
    src: url, //服务器返回的图片地址
    success: function(res) {
      'function' == typeof callback && callback(res.path)
    },
    fail: function(res) {
      //失败回调
      'function' == typeof callback && callback(url)
    },
  })
}

/**
   * 画出背景图
   */
function canvascoll(that, globalData) {
  wx.setStorageSync('globalData', globalData)
  // globalData = wx.getStorageSync('globalData')
  // console.log(globalData)
  // console.log(globalData.choose_tp.temid)
  //判断that中的模版类型，调用不同的模版绘制方法
  //如果能抽象出模版绘制的模式，还可以直接把模版绘制参数放到模版中，用接口调用获取，这样可以在不更新小程序的情况下增加更多的模版类型。
  switch (globalData.choose_tp.temid) {
    case 1:
    case '1':
      canvas_tp1(that, globalData)
      break
    case 2:
    case '2':
      canvas_tp2(that, globalData)
      break
    case 3:
    case '3':
      canvas_tp3(that, globalData)
      break
    case 4:
    case '4':
    default:
      canvas_tp4(that, globalData)
      break
  }
}

function canvas_tp3(that, globalData) { /////////////////////////////
  // let style = that.data.templatestyle[0].style
  let carvasw = that.data.windowWidth / 750 * 600
  // let rpx = that.data.windowWidth / 750
  let rpx = 1
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  context.setFillStyle('#fff')
  context.font = 'lighter 10px FZShuSong-Z01S'
  context.fillRect(0, 0, 750, 1334)
  //画背景图
  // getUrlImage(globalData.choose_tp.backgroundurl,function(resPath){
  context.drawImage(
    globalData.img_back,
    // '/images/poster_4.jpg',
    0,
    0,
    750,
    703,
    0,
    0,
    750 * rpx,
    703 * rpx
  )
  context.stroke()
  // })

  //画天气
  setTimeout(() => {
    let [temp, weather, datestring, lunarcalendar] = [
      globalData.weather.temp1 + '~' + globalData.weather.temp2,
      globalData.weather.weather,
      globalData.weather.datestring,
      globalData.weather.lunarcalendar,
    ]
    context.textBaseline = 'middle'
    context.font = '10px FZShuSong-Z01S'
    context.setFontSize(48 * rpx)
    context.textAlign = 'left';
    context.setFillStyle(globalData.choose_tp.textonecolour)
    context.fillText(temp, 56 * rpx, (24 + 753) * rpx)
    context.stroke()
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.setFontSize(28 * rpx)
    context.textAlign = 'left';
    context.fillText(weather, 56 * rpx, (14 + 815) * rpx)
    context.fillText(datestring, 56 * rpx, (14 + 854) * rpx)
    context.fillText(lunarcalendar, 56 * rpx, (14 + 894) * rpx)
    context.stroke()
  }, 100)
  //画说的话
  setTimeout(() => {
    let [name,text_1] = [globalData.name == '' ? globalData.userInfo.nickName : globalData.name,'Jiu是这么拽'];
    let [name_x,text1_x]=[50*rpx,(50+(name.length+1)*24)*rpx]
    let text_2 = globalData.choose_wine.wordlist
    // console.log(text_1, text_2)
    context.textAlign = 'left';
    context.font = 'lighter 10px FZShuSong-Z01S'
    //画名字
    context.setFillStyle('#727171')
    context.setFontSize(24 * rpx)
    context.fillText(name, name_x, (1073 + 60) * rpx)   
    //画就是 
    context.setFillStyle(globalData.choose_tp.texttwocolour)
    context.setFontSize(24 * rpx)
    context.fillText(text_1, text1_x, (1073 + 60) * rpx)
    for(let i = 0;i<text_2.length&&i<3;i++){
      let x = 50 * rpx;
      let y = (1109+60) * rpx + 36 * i * rpx
      context.fillText(text_2[i], x, y)
    }
    // context.fillText(text_2, 50 * rpx, (1109 + 12) * rpx)
    // context.fillText(text_2, 50 * rpx, (1145 + 12) * rpx)
  }, 300)
  //画随机文字
  setTimeout(() => {
    let textArr = globalData.keyword.keyword.split('') //'经典生活'.split('')
    context.font = '10px FZShuSong-Z01S'
    context.setFillStyle(globalData.choose_tp.titlecolour)
    context.setFontSize(70 * rpx)
    let x, y
    for (let i = 0; i < textArr.length; i++) {
      y = (748 + 70 / 2) * rpx + 70 * rpx * i
      x = 70 * rpx
      context.fillText(textArr[i], 621 * rpx, y)
    }
    context.stroke()
  }, 500)
  //画小字
  setTimeout(() => {
    context.fillStyle = globalData.choose_tp.titlecolour;
    context.font = 'lighter 10px FZShuSong-Z01S';
    // let textArr1 = globalData.keyword.wordremarks.split('');
    let textArr1 = globalData.keyword.remarklist;
    for (let i = 0; i < textArr1.length&&i<3; i++){
      let x = 566 *rpx - i*rpx* 38;
      let y_text = textArr1[i].split('');
      for(let i_y = 0; i_y<y_text.length;i_y++){
        let y = (748 + 14) * rpx + 30 * rpx * i_y;
        context.textAlign = 'center';
        context.font = '10px FZShuSong-Z01S';
        if (y_text[i_y] == '，'||y_text[i_y] == '、'||y_text[i_y] == '。') {
          y = y - 10 * rpx
        };
        context.setFontSize(30 * rpx);
        context.fillText(y_text[i_y], x, y);
        context.stroke();
      }
    }
    // for (let i = 0; i < textArr1.length&&i<36; i++) {
    //   let y = (748 + 14) * rpx + 30 * rpx * (i % 12);
    //   let x = 566 * rpx;
    //   if (i >= 12) {
    //     x = 528 * rpx;
    //   }
    //   if(i>=24){
    //     x = 498 * rpx;
    //   }
    //   context.textAlign = 'center';
    //   context.font = '10px FZShuSong-Z01S';
    //   if (textArr1[i] == '，') {
    //     y = y - 10 * rpx
    //   };
    //   context.setFontSize(30 * rpx);
    //   context.fillText(textArr1[i], x, y);
    //   context.stroke();
    // }
  }, 700)
  //画提示文字
  setTimeout(() => {
    let text_t = '扫码生成我的酒话'
    context.font = 'lighter ' + 16 * rpx + 'px FZShuSong-Z01S'
    context.setFontSize(20 * rpx)
    context.textAlign = 'left';
    context.setFillStyle(globalData.choose_tp.texttwocolour)
    context.fillText(text_t, 573 * rpx, (10 + 1284) * rpx)
  }, 900)
  //画头像图
  // getUrlImage(globalData.userInfo.avatarUrl, function (resPath) {
  setTimeout(() => {
    let url_p = globalData.img_avatar //'/images/poster_4.jpg'
    // context.clearRect(50 * rpx, 965 * rpx, 90 * rpx, 90 * rpx)
    // //开始路径画圆,剪切处理
    context.save()
    context.strokeStyle='rgba(0,0,0,0)';
    context.beginPath()
    context.arc(95 * rpx, 1046 * rpx, 45 * rpx, 0, Math.PI * 2, false)
    context.stroke()
    context.clip() //剪切路径
    context.drawImage(url_p, 50 * rpx, (989+12) * rpx, 90 * rpx, 90 * rpx)
    //恢复状态
    context.stroke()
    context.restore()
  }, 1100)
  // })

  //画logo
  // getUrlImage(logoUrl, function (resPath) {
  setTimeout(() => {
    context.drawImage(
      globalData.img_logo,
      48 * rpx,
      1250 * rpx,
      234 * rpx,
      48 * rpx
    )
  }, 1300)
  // })

  //todo 画二维码
  setTimeout(() => {
    context.drawImage(
      globalData.curt_QR_code, //'/images/poster_4.jpg',
      578 * rpx,
      1120 * rpx,
      150 * rpx,
      150 * rpx
    )
    // console.log('绘制最后')
    // context.draw(false, () => {
    //   console.log('draw callback')
    //   setTimeout(()=>{
    //     canvasToTempFilePath(that)
    //   },500)
    // })
  }, 1500)
  setTimeout(() => {
    context.draw(false, () => {
      // console.log('draw callback')
      setTimeout(()=>{
        canvasToTempFilePath(that)
      },500)
    })   
  }, 2000)
}

/**
   * 画出背景图
   */
function canvas_tp4(that, globalData) {
  let carvasw = that.data.windowWidth / 750 * 600
    // let rpx = that.data.windowWidth / 750
  let rpx = 1
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  // let text_2 = globalData.choose_wine.wordbody
  let text_2 = globalData.choose_wine.wordlist

  context.setFillStyle('#f5f2e9')
  context.fillRect(0, 0, 750, 1334)
  //画背景图
  // getUrlImage(globalData.choose_tp.backgroundurl, function (resPath) {
  context.drawImage(
    globalData.img_back,
    35,
    35,
    680,
    760,
    33 * rpx,
    35 * rpx,
    681 * rpx,
    761 * rpx
  )
  // })

  //画logo
  // getUrlImage(logoUrl, function (resPath) {
  setTimeout(() => {
    context.drawImage(
      globalData.img_logo,
      67 * rpx,
      58 * rpx,
      234 * rpx,
      48 * rpx
    )
  }, 200)
  // })
  context.textBaseline = 'middle'
  context.font = 'lighter 10px FZShuSong-Z01S'
  context.fillStyle = 'rgb(201,160,99)'

  //画随机文字
  setTimeout(() => {
    context.save()
    context.textBaseline = 'middle'
    let textArr = globalData.keyword.keyword.split('')
    for (let i = 0; i < textArr.length; i++) {
      let y = 113 * rpx + 74 * rpx * i
      let x = 616 * rpx
      context.textAlign = 'left';
      context.font = '10px FZShuSong-Z01S'
      context.setFillStyle(globalData.choose_tp.titlecolour)
      context.setFontSize(70 * rpx)
      context.fillText(textArr[i], x, y)
    }
    context.restore()
  }, 400)
  //画小字
  setTimeout(() => {
    // let textArr1 = globalData.keyword.wordremarks.split('')
    context.save()
    let textArr1 = globalData.keyword.remarklist;
    for (let i = 0; i < textArr1.length&&i<3; i++){
      let x = 564 *rpx - i*rpx* 42;
      let y_text = textArr1[i].split('');
      for(let i_y = 0; i_y<y_text.length;i_y++){
        let y = 90 * rpx + 30 * rpx * i_y
        context.textAlign = 'center';
        context.font = '10px FZShuSong-Z01S';
        if (y_text[i_y] == '，'||y_text[i_y] == '、'||y_text[i_y] == '。') {
          y = y - 10 * rpx
        };
        context.setFillStyle(globalData.choose_tp.titlecolour)
        context.setFontSize(30 * rpx);
        context.fillText(y_text[i_y], x, y);
        context.stroke();
      }
    }
    // for (let i = 0; i < textArr1.length&&i<52; i++) {
    //   let y = 90 * rpx + 30 * rpx * (i % 13)
    //   let x = 564 * rpx
    //   if (i >= 13) {
    //     x = 526 * rpx
    //   }
    //   if (i >= 26) {
    //     x = 488 * rpx
    //   }
    //   if (i >= 39) {
    //     x = 450 * rpx
    //   }
    //   context.font = '10px FZShuSong-Z01S'
    //   if (textArr1[i] == '，') {
    //     y = y - 10 * rpx
    //     x = x + 10 * rpx
    //   }
    //   context.setFontSize(30 * rpx)
    //   context.textAlign = 'left';
    //   context.fillText(textArr1[i], x, y)
    // }
    context.restore()
  }, 600)
  context.stroke()
  //画天气
  setTimeout(() => {
    let weather = globalData.weather
    context.save()
    context.setFillStyle('rgba(178,130,70,1)')
    context.fillRect(72 * rpx, 702 * rpx, 250 * rpx, 301 * rpx)
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.setFontSize(24 * rpx)
    context.textAlign = 'center'
    context.setFillStyle(globalData.choose_tp.textonecolour)
    context.fillText(weather.datestring, 198 * rpx, 737 * rpx)
    context.fillText(weather.lunarcalendar, 198 * rpx, 770 * rpx)
    context.beginPath()
    context.strokeStyle = globalData.choose_tp.textonecolour
    context.moveTo(115 * rpx, 792 * rpx)
    context.lineTo(279 * rpx, 792 * rpx)
    context.stroke()
    context.setFontSize(76 * rpx)
    context.setFillStyle(globalData.choose_tp.textonecolour)
    context.fillText(weather.day, 195 * rpx, 850 * rpx)
    context.beginPath()
    context.strokeStyle = globalData.choose_tp.textonecolour
    context.moveTo(115 * rpx, 910 * rpx)
    context.lineTo(279 * rpx, 910 * rpx)
    context.stroke()
    var txt1 = weather.temp1 + '~' + weather.temp2
    context.setFontSize(24 * rpx)
    context.setFillStyle(globalData.choose_tp.textonecolour)
    context.fillText(txt1, 198 * rpx, 936 * rpx)
    context.fillText(weather.weather, 198 * rpx, 970 * rpx)
    context.restore()
  }, 800)
  //画头像图
  // getUrlImage(globalData.userInfo.avatarUrl, function (resPath) {
  setTimeout(() => {
    // console.log('画头像图')
      let url_p = globalData.img_avatar //'/images/poster_4.jpg'
      // //开始路径画圆,剪切处理
      context.save()
      context.strokeStyle='rgba(0,0,0,0)';
      context.beginPath()
      if(text_2.length>1){
        context.arc(115 * rpx, 1095 * rpx, 45 * rpx, 0, Math.PI * 4, false)
      }else{
        context.arc(115 * rpx, 1170 * rpx, 45 * rpx, 0, Math.PI * 4, false)
      }
      context.stroke()
      context.clip() //剪切路径
      if(text_2.length>1){
        context.drawImage(url_p, 70 * rpx, 1050 * rpx, 90 * rpx, 90 * rpx)
      }else{
        context.drawImage(url_p, 70 * rpx, 1125 * rpx, 90 * rpx, 90 * rpx)
      }
      //恢复状态
      context.restore()
  }, 1000)
  // })
  //画logo文字
  // getUrlImage(logoUrl, function (resPath) {
  setTimeout(() => {
    context.save()
    context.drawImage(
      globalData.logotext,
      420 * rpx,
      854 * rpx,
      293 * rpx,
      73 * rpx
    )
    context.restore()
  }, 1200)
  // })
  // context.stroke()
  //画说的话
  setTimeout(() => {
    context.save()
    let [name,text_1] = [globalData.name == '' ? globalData.userInfo.nickName : globalData.name,'Jiu是这么拽'];
    let [name_x,text1_x]=[70*rpx,(70+(name.length+1)*28)*rpx]
    let text_2 = globalData.choose_wine.wordlist
    context.textAlign = 'left'
    context.font = 'lighter 10px FZShuSong-Z01S'
    // console.log(text_1, text_2)
    if(text_2.length>1){
      context.setFontSize(28 * rpx)
      context.fillStyle = '#727171' //'rgb(201,160,99)
      context.fillText(name, name_x, 1210 * rpx)
      context.setFontSize(28 * rpx)
      context.fillStyle = globalData.choose_tp.texttwocolour //'rgb(201,160,99)
      context.fillText(text_1, text1_x, 1210 * rpx)
      context.fillText(text_2[0], 70 * rpx, 1247 * rpx)
      context.fillText(text_2[1], 70 * rpx, 1284 * rpx)
    }else{
      context.setFontSize(28 * rpx)
      context.fillStyle = '#727171' //'rgb(201,160,99)
      context.fillText(name, name_x, 1238 * rpx)
      context.setFontSize(28 * rpx)
      context.fillStyle = globalData.choose_tp.texttwocolour //'rgb(201,160,99)
      context.fillText(text_1, text1_x, 1238 * rpx)
      context.fillText(text_2[0], 70 * rpx, 1275 * rpx)
    }
    context.restore()
  }, 1400)
  //画二维码
  setTimeout(() => {
    context.save()
    context.drawImage(
      globalData.curt_QR_code, //'/images/poster_4.jpg',
      566 * rpx,
      1111 * rpx,
      150 * rpx,
      150 * rpx
    )
    context.restore()
  }, 1600)
  //画提示文字
  setTimeout(() => {
    context.save()
    context.textAlign = 'center'
    let text_t = '扫码生成我的酒话'
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.setFontSize(18 * rpx)
    context.fillText(text_t, 640 * rpx, 1279 * rpx)
    context.restore()
    // console.log('绘制最后')

    // context.draw(false, () => {
    //   console.log('draw callback');
    //   setTimeout(()=>{
    //     canvasToTempFilePath(that)
    //   },500)
    // })
  }, 1800)
  setTimeout(() => {
    context.draw(false, () => {
      // console.log('draw callback');
      setTimeout(()=>{
        canvasToTempFilePath(that)
      },500)
    })
  }, 2000)
}
/**
   * 画出背景图
   */
function canvas_tp1(that, globalData) {
  let carvasw = that.data.windowWidth / 750 * 600
    // let rpx = that.data.windowWidth / 750
  let rpx = 1
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  context.setFillStyle('#f5f2e9')
  context.fillRect(0, 0, 750, 1334)
  //画背景图
  context.drawImage(
    globalData.img_back, //'/images/poster_4.jpg',
    0,0,750,960,
    0,0,750 * rpx,960 * rpx
  )

  //画logo

  context.save()
  context.drawImage(globalData.img_logo,
      32 * rpx,24 * rpx,234 * rpx,48 * rpx)
  context.restore()
  // }, 100)
  context.textBaseline = 'middle'
  context.font = 'lighter 10px FZShuSong-Z01S'
  context.fillStyle = 'rgb(201,160,99)'

  context.stroke()
  //画天气
  setTimeout(() => {
    let weather = globalData.weather
    context.save()
    context.setFillStyle('rgba(178,130,70,1)')
    context.fillRect(49 * rpx, 644 * rpx, 261 * rpx, 315 * rpx)
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.setFontSize(22 * rpx)
    context.fillStyle = globalData.choose_tp.textonecolour
    context.textAlign = 'center'
    context.fillText(weather.datestring, 179 * rpx, 682 * rpx)
    context.fillText(weather.lunarcalendar, 179 * rpx, 705 * rpx)
    context.beginPath()
    context.moveTo(80 * rpx, 740 * rpx)
    context.lineTo(279 * rpx, 740 * rpx)
    context.strokeStyle = globalData.choose_tp.textonecolour
    context.stroke()
    context.setFontSize(76 * rpx)
    context.fillText(weather.day, 179 * rpx, 795 * rpx)
    context.beginPath()
    context.moveTo(80 * rpx, 840 * rpx)
    context.lineTo(279 * rpx, 840 * rpx)
    context.strokeStyle = globalData.choose_tp.textonecolour
    context.stroke()
    var txt1 = weather.temp1 + '~' + weather.temp2
    context.setFontSize(22 * rpx)
    context.fillText(txt1, 179 * rpx, 878 * rpx)
    context.fillText(weather.weather, 179 * rpx, 906 * rpx)
    context.restore()
  }, 300)
  //画随机文字
  setTimeout(() => {
    context.save()
    context.textBaseline = 'middle'
    context.fillStyle = globalData.choose_tp.titlecolour
    context.textAlign = 'left'
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.setFontSize(41 * rpx)
    context.fillText(globalData.keyword.keyword, 50 * rpx, 1013 * rpx)
    context.restore()
  }, 600)
  //画小字
  setTimeout(() => {
    let textArr1 = globalData.keyword.wordremarks.split('')
    context.save()
    for(let i=0;i<globalData.keyword.remarklist.length;i++){
      let y = 1059 * rpx + 25 * rpx*i;
      let x = 50 * rpx;
      context.font = '10px FZShuSong-Z01S'
      context.fillStyle = globalData.choose_tp.titlecolour
      context.setFontSize(21 * rpx)
      context.fillText(globalData.keyword.remarklist[i], x, y)
    }
    context.restore()
  }, 800)

  //画头像图
  // getUrlImage(globalData.userInfo.avatarUrl, function (resPath) {
  setTimeout(() => {
    let url_p = globalData.img_avatar //'/images/poster_4.jpg'
    // //开始路径画圆,剪切处理
    context.save()
    context.strokeStyle='rgba(0,0,0,0)';
    context.beginPath()
    context.arc(88 * rpx, 1268 * rpx, 40 * rpx, 0, Math.PI * 2, true)
    context.stroke()
    context.clip() //剪切路径
    context.drawImage(url_p, 48 * rpx, 1228 * rpx, 80 * rpx, 80 * rpx)
    //恢复状态
    context.restore()
  }, 1000)
  // })
  //画说的话
  setTimeout(() => {
    context.save()
    let [name,text_1] = [globalData.name == '' ? globalData.userInfo.nickName : globalData.name,'Jiu是这么拽'];
    let [name_x,text1_x]=[142*rpx,(142+(name.length+1)*20)*rpx]
    let text_2 = globalData.choose_wine.wordlist
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.textAlign = 'left'
    if(text_2.length>1){
      context.setFillStyle('#727171')
      context.setFontSize(20 * rpx)
      context.fillText(name, name_x, 1240 * rpx)
      context.setFillStyle(globalData.choose_tp.texttwocolour)
      context.setFontSize(20 * rpx)
      context.fillText(text_1, text1_x, 1240 * rpx)
      for(let i=0;i<text_2.length&&i<2;i++){
        let x = name_x;
        let y = 1268 * rpx + i*28*rpx;
        context.fillText(text_2[i], x, y)
        // context.fillText(text_2, 142 * rpx, 1268 * rpx)
        // context.fillText(text_2, 142 * rpx, 1296 * rpx)
      }
    }else{
      context.setFillStyle('#727171')
      context.setFontSize(20 * rpx)
      context.fillText(name, name_x, 1252 * rpx)
      context.setFillStyle(globalData.choose_tp.texttwocolour)
      context.setFontSize(20 * rpx)
      context.fillText(text_1, text1_x, 1252 * rpx)
      context.fillText(text_2[0], name_x, 1287 * rpx)
    }
    context.restore()
  }, 1200)
  //画二维码
  setTimeout(() => {
    context.save()
    context.drawImage(
      globalData.curt_QR_code, //'/images/poster_4.jpg',
      570 * rpx,
      1143 * rpx,
      150 * rpx,
      150 * rpx
    )
    context.restore()
  }, 1400)
  //画提示文字
  setTimeout(() => {
    context.save()
    let text_t = '扫码生成我的酒话'
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.textAlign = 'center'
    context.setFontSize(18 * rpx)
    context.fillStyle = globalData.choose_tp.texttwocolour
    context.fillText(text_t, 645 * rpx, 1310 * rpx)
    context.restore()
    // console.log('绘制最后')

    // context.draw(false, () => {
    //   console.log('draw callback');
    //   setTimeout(()=>{
    //     canvasToTempFilePath(that)
    //   },500)
    // })
  }, 1600)
  setTimeout(() => {
    context.draw(false, () => {
      // console.log('draw callback');
      setTimeout(()=>{
        canvasToTempFilePath(that)
      },500)
    })
  }, 2000)
}
function canvas_tp2(that, globalData) {
  let carvasw = that.data.windowWidth / 750 * 600
    // let rpx = that.data.windowWidth / 750
  let rpx = 1
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  context.setFillStyle('#ffffff')
  context.textBaseline = 'middle'
  context.font = 'lighter 10px FZShuSong-Z01S'
  context.fillRect(0, 0, 750, 1334)
  //画背景图
  // getUrlImage(globalData.choose_tp.backgroundurl, function (resPath) {
  context.drawImage(
    globalData.img_back, //'/images/poster_4.jpg',
    0,
    0,
    750,
    960,
    0,
    0,
    750 * rpx,
    960 * rpx
  )
  // })
  //画logo
  // getUrlImage(logoUrl, function (resPath) {
  setTimeout(() => {
    context.save()
    context.drawImage(
      globalData.img_logo, 
      32 * rpx,
      24 * rpx,
      234 * rpx,
      48 * rpx
    )
    context.restore()
  }, 100)
  // })
  context.setFillStyle('rgba(178,130,70,1)')
  context.fillRect(0, 960 * rpx, 750 * rpx, 104 * rpx)
  context.beginPath()
  context.lineWidth = 1
  context.strokeStyle=globalData.choose_tp.titlecolour;
  context.moveTo(441 * rpx, 978 * rpx) 
  context.lineTo(441 * rpx, 1049 * rpx)
  context.moveTo(449 * rpx, 978 * rpx)
  context.lineTo(449 * rpx, 1049 * rpx)
  context.stroke()
  //画随机文字
  setTimeout(() => {
    context.save()
    context.textBaseline = 'middle'
    context.fillStyle = globalData.choose_tp.titlecolour
    context.textAlign = 'center'
    context.setFontSize(60 * rpx)
    context.fillText(globalData.keyword.keyword, 603 * rpx, 1015 * rpx)
    context.restore()
  }, 300)
  //画小字
  setTimeout(() => {
    // let textArr1 = ['sdw十多万','是的AAS打算打算 ','阿萨德齐旺达所的','sd a'];
    let textArr1 = globalData.keyword.remarklist;
    context.save()
    context.textAlign = 'left';
    if(textArr1.length>2){
      for (let i = 0; i < textArr1.length&&i<3; i++) {
        let y = 990 * rpx + i * 24 *rpx
        let x = 33 * rpx
        context.font = '10px FZShuSong-Z01S'
        context.setFontSize(21 * rpx)
        context.fillStyle = globalData.choose_tp.titlecolour
        context.fillText(textArr1[i], x, y)
      }
    }else{
      for (let i = 0; i < textArr1.length&&i<2; i++) {
        let y = 996 * rpx
        let x = 33 * rpx
        if (i >= 1) {
          y = 1029 * rpx
        }
        context.font = '10px FZShuSong-Z01S'
        context.setFontSize(21 * rpx)
        context.fillStyle = globalData.choose_tp.titlecolour
        context.fillText(textArr1[i], x, y)
      }
    }
    
    context.restore()
  }, 500)
  //画头像图
  // getUrlImage(globalData.userInfo.avatarUrl, function (resPath) {
  setTimeout(() => {
    let url_p = globalData.img_avatar //'/images/poster_4.jpg'
    // //开始路径画圆,剪切处理
    context.save()
    context.strokeStyle='rgba(0,0,0,0)';
    context.beginPath()
    context.arc(74 * rpx, 1185 * rpx, 40 * rpx, 0, Math.PI * 2, true)
    context.stroke()
    context.clip() //剪切路径
    context.drawImage(url_p, 34 * rpx, 1145 * rpx, 80 * rpx, 80 * rpx)
    //恢复状态
    context.restore()
  }, 700)
  // })
  //画说的话
  setTimeout(() => {
    context.save()
    let [name,text_1] = [globalData.name == '' ? globalData.userInfo.nickName : globalData.name,'Jiu是这么拽'];
    let [name_x,text1_x]=[127*rpx,(127+(name.length+1)*21)*rpx]
    let text_2 = globalData.choose_wine.wordlist
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.textAlign = 'left'
    context.setFontSize(21 * rpx)
    if(text_2.length>1){
      context.setFillStyle('#727171')
      context.setFontSize(21 * rpx)
      context.fillText(name, name_x, 1155 * rpx)
      context.setFillStyle(globalData.choose_tp.texttwocolour)
      context.fillText(text_1, text1_x, 1155 * rpx)
      for(let i = 0;i<text_2.length&i<2;i++){
        let x= 127 * rpx;
        let y = 1155 * rpx + 29 * rpx *(i + 1)
        context.fillText(text_2[i], x, y)
      }
      // context.fillText(text_1, 127 * rpx, 1155 * rpx)
      // context.fillText(text_2, 127 * rpx, 1184 * rpx)
      // context.fillText(text_3, 127 * rpx, 1216 * rpx)
    }else{
      context.setFillStyle('#727171')
      context.setFontSize(21 * rpx)
      context.fillText(name, name_x, 1170 * rpx)
      context.setFillStyle(globalData.choose_tp.texttwocolour)
      context.fillText(text_1, text1_x, 1170 * rpx)
      context.fillText(text_2[0], 127 * rpx, 1199 * rpx)
    }
    context.stroke()
    context.restore()
  }, 900)
  context.fillStyle = 'rgb(201,160,99)'

  //画天气
  setTimeout(() => {
    let weather = globalData.weather
    context.save()
    context.fillStyle = globalData.choose_tp.textonecolour
    context.strokeStyle = 'rgba(178,130,70,1)'
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.beginPath()
    context.lineWidth = 1
    context.strokeRect(33 * rpx, 1237 * rpx, 475 * rpx, 80 * rpx)
    context.moveTo(126 * rpx, 1237 * rpx)
    context.lineTo(126 * rpx, 1318 * rpx)
    context.moveTo(334 * rpx, 1237 * rpx)
    context.lineTo(334 * rpx, 1318 * rpx)
    context.stroke()
    context.textAlign = 'center'
    context.setFontSize(65 * rpx)
    let text_s = weather.day.split('')
    if (text_s.length > 1) {
      context.fillText(text_s[0], 60 * rpx, 1280 * rpx)
      context.fillText(text_s[1], 90 * rpx, 1280 * rpx)
    } else {
      context.fillText(text_s[0], 79.5 * rpx, 1280 * rpx)
    }
    context.setFontSize(20 * rpx)
    context.fillText(weather.datestring, 230 * rpx, 1260 * rpx)
    context.setFontSize(21 * rpx)
    context.fillText(weather.lunarcalendar, 230 * rpx, 1292 * rpx)
    var txt1 = weather.temp1 + '~' + weather.temp2
    context.setFontSize(21 * rpx)
    context.fillText(txt1, 419 * rpx, 1260 * rpx)
    context.fillText(weather.weather, 419 * rpx, 1292 * rpx)
    context.restore()
  }, 1100)
  //画二维码
  setTimeout(() => {
    context.save()
    context.drawImage(
      globalData.curt_QR_code, // '/images/poster_4.jpg',
      571 * rpx,
      1137 * rpx,
      150 * rpx,
      150 * rpx
    )
    context.restore()
  }, 1300)
  //画提示文字
  setTimeout(() => {
    context.save()
    let text_t = '扫码生成我的酒话'
    context.font = 'lighter 10px FZShuSong-Z01S'
    context.textAlign = 'center'
    context.fillStyle = globalData.choose_tp.texttwocolour
    context.setFontSize(17 * rpx)
    context.fillText(text_t, 645 * rpx, 1309 * rpx)
    context.restore()
    // console.log('绘制最后')
    // context.draw(false, () => {
    //   setTimeout(()=>{
    //     canvasToTempFilePath(that)
    //   },500)
    // })
  }, 1500)
  setTimeout(() => {
    context.draw(false, () => {
      setTimeout(()=>{
        canvasToTempFilePath(that)
      },500)
    })
  }, 2000)
}

function canvasToTempFilePath(that) {
  // 
  setTimeout(() => {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      quality: 0.8,
      width:750,
      height:1334,
      fileType: 'jpg',
      success(res) {
        wx.setStorageSync('myCanvas', res.tempFilePath)
        if(that.data.overtime){
          that.setData({ img_src: res.tempFilePath, poster: true })
        }else{

        }
        // wx.redirectTo({
        //   url: '/pages/main',
        // })
      },
    })
  }, 1000);
}

function getWHcoll(that) {
  // let that = this
  wx.getSystemInfo({
    success: function(res) {
      that.setData({
        windowWidth: res.windowWidth,
        windowHeight: res.windowHeight,
        canvasstyle: 'width: ' + 750 + 'rpx;height: ' + 1334 + 'rpx;',
      })
    },
  })
}

function getLogoTextImgUrl(){
  return logourl2
}

function getLogoImgUrl(){
  return logoUrl
}

function drawCanvasFromTemp(canvasId,that,tmpFile){
  const ctx = wx.createCanvasContext(canvasId, that);
  if(tempFile){
    ctx.drawImage(tmpFile, 0, 0)
    ctx.draw()
  }
  return ctx;
}

function canvasToTemp(canvasId,resolve)
{
  wx.canvasToTempFilePath({
    canvasId: canvasId,
    quality: 0.8,
    fileType: 'jpg',
    success(res) {
      resolve(res)
    },
  })
}

module.exports = {
  formatTime: formatTime,
  httpRequest: httpRequest,
  toast: toast,
  canvascoll: canvascoll,
  getWHcoll: getWHcoll,
  logincoll: logincoll,
  uploadImage: uploadImage,
  getUrlImage: getUrlImage,
  getLogoTextImgUrl: getLogoTextImgUrl,
  getLogoImgUrl: getLogoImgUrl,
}

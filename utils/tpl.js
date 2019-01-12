/**
   * 画出背景图
   */
function canvascoll(that, globalData) {
  wx.setStorageSync('globalData', globalData)
  // globalData = wx.getStorageSync('globalData')
  console.log(globalData)
  console.log(globalData.choose_tp.temid)
  that.setData({
    onDrawingStep: false
  })
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

function tp1_steps(step,that, globalData){
  let carvasw = that.data.windowWidth / 750 * 600
  // let rpx = that.data.windowWidth / 750
  let rpx = 0.5
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  let weather = globalData.weather

  switch(step){
    case 1 :
      let backcolour = globalData.choose_tp.backcolour ? globalData.choose_tp.backcolour : '#f5f2e9'
      console.log("backcolor:"+backcolour)
      context.setFillStyle(backcolour) //换模版颜色
      context.fillRect(0, 0, 750, 1334)
      context.restore()
      //画背景图
      context.drawImage(
        globalData.img_back, //'/images/poster_4.jpg',
        0, 0, 750, 960,
        0, 0, 750 * rpx, 960 * rpx
      )
      context.drawImage(globalData.img_logo,
        32 * rpx, 24 * rpx, 234 * rpx, 48 * rpx)
      context.restore()
      break
    case 2:
      console.log('画天气')
      context.textBaseline = 'middle'
      context.fillStyle = '#d7a769' //'rgba(178,130,70,0.8)' //'#d7a769'
      context.fillRect(49 * rpx, 644 * rpx, 261 * rpx, 315 * rpx)
      context.rect(54 * rpx, 649 * rpx, 251 * rpx, 305 * rpx)
      context.strokeStyle = '#865f39'
      context.stroke()
      context.beginPath()
      context.moveTo(100 * rpx, 741 * rpx)
      context.lineTo(259 * rpx, 741 * rpx)
      context.moveTo(100 * rpx, 860 * rpx)
      context.lineTo(259 * rpx, 860 * rpx)
      context.strokeStyle = '#865f39' //'rgba(255,255,255,1)'
      context.stroke()
      break
    case 3:
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(22 * rpx)
      context.fillStyle = '#40220f'
      context.textAlign = 'center'
      context.save()
      context.fillText(weather.datestring, 179 * rpx, 682 * rpx)
      break
    case 4:
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(22 * rpx)
      context.fillStyle = '#40220f'
      context.textAlign = 'center'
      context.save()
      context.fillText(weather.lunarcalendar, 179 * rpx, 709 * rpx)
      break
    case 5:
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(100 * rpx)
      context.fillStyle = '#40220f'
      context.textAlign = 'center'
      context.save()
      context.fillText(weather.day, 179 * rpx, 802 * rpx)
      break
    case 6:
      var txt1 = weather.temp1 + '~' + weather.temp2
      context.setFontSize(25 * rpx)
      context.fillText(txt1, 179 * rpx, 889 * rpx)
      context.setFontSize(22 * rpx)
      context.fillText(weather.weather, 179 * rpx, 916 * rpx)
      context.restore()
      console.log('天气画好了...')
      break
    case 7:
      console.log('画随机文字')
      context.textBaseline = 'middle'
      context.fillStyle = globalData.choose_tp.titlecolour //'rgb(201,160,99)'
      context.textAlign = 'left'
      context.font = 'bolder 10px FZShuSong-Z01S'
      context.setFontSize(50 * rpx)
      context.save()
      let keywordArr = globalData.keyword.keyword.split('')
      let keyword = ''
      for (let i = 0; i < 4; i++) {
        if (undefined == keywordArr[i]) break
        keyword += keywordArr[i] + ' '
      }
      context.fillText(keyword, 50 * rpx, 1023 * rpx)
      break
    case 8:
      console.log('画小字')
      context.fillStyle = globalData.choose_tp.textonecolour
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(26 * rpx)
      context.save()
      let textArr1 = globalData.keyword.wordremarks.substring(0,13).split('')
      for (let i = 0; i < textArr1.length; i++) {
        let y = 1074 * rpx
        let x = 50 * rpx + 28 * rpx * (i % 13)
        if (i >= 13) {
          y = 1108 * rpx
        }
        context.fillText(textArr1[i], x, y)
      }
      context.restore()
      break
    case 9:
      context.fillStyle = globalData.choose_tp.textonecolour
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(26 * rpx)
      context.save()
      let txt = globalData.keyword.wordremarks.substring(13)
      let textArr2 = txt.split('')
      for (let i = 0; i < textArr2.length; i++) {
        let y = 1108 * rpx
        let x = 50 * rpx + 28 * rpx * (i % 13)
        context.fillText(textArr2[i], x, y)
      }
      context.restore()
      break
    case 10:
      console.log('画头像图')
      let url_p = globalData.img_avatar //'/images/poster_4.jpg'
      // //开始路径画圆,剪切处理
      context.save()
      context.beginPath()
      context.arc(88 * rpx, 1268 * rpx, 40 * rpx, 0, Math.PI * 2, true)
      context.stroke()
      context.clip() //剪切路径
      context.drawImage(url_p, 48 * rpx, 1228 * rpx, 80 * rpx, 80 * rpx)
      //恢复状态
      context.restore()
      console.log('画二维码')
      context.drawImage(
        globalData.curt_QR_code, //'/images/poster_4.jpg',
        570 * rpx,
        1143 * rpx,
        150 * rpx,
        150 * rpx
      )
      break
    case 11:
      console.log('画说的话')
      context.textAlign = 'left'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(26 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      context.save()
      let text_1 =
        globalData.name == '' ? globalData.userInfo.nickName : globalData.name
      text_1 += ' Jiu是这么拽'
      if(globalData.choose_wine.wordbody.length>15){
        context.fillText(text_1, 142 * rpx, 1242 * rpx)
      }else{
        context.fillText(text_1, 142 * rpx, 1252 * rpx)
      }
      break
    case 12:
      console.log('画说的话1')
      context.textAlign = 'left'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(26 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      context.save()
      let text_2 = globalData.choose_wine.wordbody.substring(0, 15)
      if(globalData.choose_wine.wordbody.length>15){
        context.fillText(text_2, 142 * rpx, 1277 * rpx)
      }else{
        context.fillText(text_2, 142 * rpx, 1287 * rpx)
      }
      context.restore()
      break
    case 13:
      console.log('画说的话2')
      let text_3 = globalData.choose_wine.wordbody.substring(15)
      console.log("text3:"+text_3)
      context.textAlign = 'left'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(26 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      context.save()
      context.fillText(text_3, 142 * rpx, 1312 * rpx)
      context.restore()
      break
    case 14:
      console.log('画提示文字')
      context.save()
      let text_t = '扫码生成我的酒话'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.textAlign = 'center'
      context.setFontSize(18 * rpx)
      context.fillText(text_t, 645 * rpx, 1310 * rpx)
      context.restore()
      context.draw(true, () => {
        canvasToTempFilePath(that)
      })
      return
  }
  // setTimeout(()=>{
    context.draw(true, function () {
      that.setData({
        onDrawingStep: false
      })
    })
  // },100)
}
function canvas_tp1(that, globalData) {
  let step = 0;
  let canvas_tpl_intel = setInterval(function(){
    if(true == that.data.onDrawingStep) return;
    console.log('kaish')
    that.setData({ onDrawingStep: true})
    tp1_steps(++step, that, globalData)
    if(step>=14)
      clearInterval(canvas_tpl_intel)
  },10)
}
function tp2_steps(step,that, globalData){
  let carvasw = that.data.windowWidth / 750 * 600
  // let rpx = that.data.windowWidth / 750
  let rpx = 0.5
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  let weather = globalData.weather

  switch(step){
    case 1 :
      let backcolour = globalData.choose_tp.backcolour ? globalData.choose_tp.backcolour : '#f5f2e9'
      console.log("backcolor:"+backcolour)
      context.setFillStyle(backcolour) //换模版颜色
      context.fillRect(0, 0, 750, 1334)
      context.restore()
      //画背景图
      context.drawImage(
        globalData.img_back, //'/images/poster_4.jpg',
        0, 0, 750, 960,
        0, 0, 750 * rpx, 960 * rpx
      )
      context.drawImage(globalData.img_logo,
        32 * rpx, 24 * rpx, 234 * rpx, 48 * rpx)
      context.setFillStyle('rgba(178,130,70,0.8)')
      context.fillRect(0, 960 * rpx, 750 * rpx, 104 * rpx)
      context.restore()
      break
    case 2:
      console.log('画天气')
      context.save()
      context.fillStyle = 'rgb(178,130,70)'
      context.strokeStyle = 'rgba(178,130,70,1)'
      context.beginPath()
      context.lineWidth = 1
      context.strokeRect(33 * rpx, 1237 * rpx, 475 * rpx, 80 * rpx)
      context.moveTo(126 * rpx, 1237 * rpx)
      context.lineTo(126 * rpx, 1318 * rpx)
      context.moveTo(334 * rpx, 1237 * rpx)
      context.lineTo(334 * rpx, 1318 * rpx)
      context.stroke()
      break
    case 3:
      context.textBaseline = 'middle'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.fillStyle = 'rgb(178,130,70)'
      context.textAlign = 'center'
      context.save()
      context.setFontSize(65 * rpx)
      let text_s = weather.day.split('')
      if (text_s.length > 1) {
        context.fillText(text_s[0], 65 * rpx, 1280 * rpx)
        context.fillText(text_s[1], 95 * rpx, 1280 * rpx)
      } else {
        context.fillText(text_s[0], 79.5 * rpx, 1280 * rpx)
      }
      break
    case 4:
      context.textBaseline = 'middle'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.fillStyle = 'rgb(178,130,70)'
      context.textAlign = 'center'
      context.save()
      context.setFontSize(20 * rpx)
      context.fillText(weather.datestring, 230 * rpx, 1260 * rpx)
      break
    case 5:
      context.textBaseline = 'middle'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.fillStyle = 'rgb(178,130,70)'
      context.textAlign = 'center'
      context.save()
      context.setFontSize(21 * rpx)
      context.fillText(weather.lunarcalendar, 230 * rpx, 1292 * rpx)
      break
    case 6:
      context.textBaseline = 'middle'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.fillStyle = 'rgb(178,130,70)'
      context.textAlign = 'center'
      var txt1 = weather.temp1 + '~' + weather.temp2
      context.setFontSize(21 * rpx)
      context.fillText(txt1, 419 * rpx, 1260 * rpx)
      context.restore()
      break
    case 7:
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.fillStyle = 'rgb(178,130,70)'
      context.textAlign = 'center'
      context.setFontSize(21 * rpx)
      context.fillText(weather.weather, 419 * rpx, 1292 * rpx)
      context.restore()
      console.log('天气画好了...')
      break
    case 8:
      console.log('画随机文字')
      context.save()
      context.textBaseline = 'middle'
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(41 * rpx)
      context.fillText(globalData.keyword.keyword, 603 * rpx, 1010 * rpx)
      context.restore()
      break
    case 9:
      console.log('画小字')
      let textArr1 = globalData.keyword.wordremarks.split('')
      context.save()
      context.fillStyle = 'rgb(255,255,255)'
      context.textAlign = 'left'
      for (let i = 0; i < textArr1.length; i++) {
        let y = 996 * rpx
        let x = 33 * rpx + 25 * rpx * (i % 13)
        if (i >= 13) {
          y = 1029 * rpx
        }
        context.font = '10px FZShuSong-Z01S'
        context.setFontSize(21 * rpx)
        context.fillText(textArr1[i], x, y)
      }
      context.restore()
      break
    case 10:
      console.log('画头像图')
      let url_p = globalData.img_avatar //'/images/poster_4.jpg'
      // //开始路径画圆,剪切处理
      context.save()
      context.beginPath()
      context.arc(74 * rpx, 1185 * rpx, 40 * rpx, 0, Math.PI * 2, true)
      context.stroke()
      context.clip() //剪切路径
      context.drawImage(url_p, 34 * rpx, 1145 * rpx, 80 * rpx, 80 * rpx)
      //恢复状态
      context.restore()
      console.log('画二维码')
      context.save()
      context.drawImage(
        globalData.curt_QR_code, // '/images/poster_4.jpg',
        571 * rpx,
        1137 * rpx,
        150 * rpx,
        150 * rpx
      )
      context.restore()
      break
    case 11:
      console.log('画说的话')
      context.save()
      context.fillStyle = 'rgb(201,160,99)'
      context.textAlign = 'left'
      let text_1 =
        globalData.name == '' ? globalData.userInfo.nickName : globalData.name
      text_1 += ' Jiu是这么拽'
      console.log(globalData.choose_wine.wordbody)
      let text_2 = globalData.choose_wine.wordbody.substring(0, 18)
      let text_3 = globalData.choose_wine.wordbody.substring(19)
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(21 * rpx)
      if(globalData.choose_wine.wordbody.length>=19){
        context.fillText(text_1, 127 * rpx, 1155 * rpx)
        context.fillText(text_2, 127 * rpx, 1184 * rpx)
        context.fillText(text_3, 127 * rpx, 1216 * rpx)
      }else{
        context.fillText(text_1, 127 * rpx, 1171 * rpx)
        context.fillText(text_2, 127 * rpx, 1200 * rpx)
      }
      context.stroke()
      context.restore()
      break
    case 12:
      console.log('画提示文字')
      context.save()
      let text_t = '扫码生成我的酒话'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.textAlign = 'center'
      context.setFontSize(17 * rpx)
      context.fillText(text_t, 645 * rpx, 1309 * rpx)
      context.restore()
      context.draw(true, () => {
        setTimeout(()=>{
          canvasToTempFilePath(that)
        },500)
      })
      return
  }
  // setTimeout(()=>{
    context.draw(true, function () {
      that.setData({
        onDrawingStep: false
      })
    })
  // },100)
}
function canvas_tp2(that, globalData) {
  let step = 0;
  let canvas_tpl_intel = setInterval(function(){
    if(true == that.data.onDrawingStep) return;
    console.log('kaish')
    that.setData({ onDrawingStep: true})
    tp2_steps(++step, that, globalData)

    if(step>=12)
      clearInterval(canvas_tpl_intel)
  },10)
}
function tp3_steps(step,that, globalData){
  let carvasw = that.data.windowWidth / 750 * 600
  // let rpx = that.data.windowWidth / 750
  let rpx = 0.5
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  let [temp, weather, datestring, lunarcalendar] = [
    globalData.weather.temp1 + '~' + globalData.weather.temp2,
    globalData.weather.weather,
    globalData.weather.datestring,
    globalData.weather.lunarcalendar,
  ]

  switch(step){
    case 1 :
      let backcolour = globalData.choose_tp.backcolour ? globalData.choose_tp.backcolour : '#f5f2e9'
      console.log("backcolor:"+backcolour)
      context.setFillStyle(backcolour) //换模版颜色
      context.fillRect(0, 0, 750, 1334)
      context.restore()
      //画背景图
      context.drawImage(
        globalData.img_back,
        0,0,750,703,
        0,0,750 * rpx,703 * rpx)
      context.stroke()
      context.restore()
      break
    case 2:
      console.log('画天气')
      context.textBaseline = 'middle'
      context.font = '10px FZShuSong-Z01S'
      context.setFontSize(48 * rpx)
      context.setFillStyle(globalData.choose_tp.titlecolour)
      context.fillText(temp, 56 * rpx, (24 + 753) * rpx)
      context.stroke()
      break
    case 3:
      context.textBaseline = 'middle'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFillStyle(globalData.choose_tp.titlecolour)
      context.setFontSize(28 * rpx)
      context.fillText(weather, 56 * rpx, (14 + 815) * rpx)
      context.fillText(datestring, 56 * rpx, (14 + 854) * rpx)
      context.fillText(lunarcalendar, 56 * rpx, (14 + 894) * rpx)
      context.stroke()
      break
    case 4:
      console.log('画随机文字')
      context.textBaseline = 'middle'
      context.fillStyle = globalData.choose_tp.titlecolour //'rgb(201,160,99)'
      let textArr = globalData.keyword.keyword.split('') //'经典生活'.split('')
      context.font = '10px FZShuSong-Z01S'
      context.setFontSize(74 * rpx)
      let x, y
      for (let i = 0; i < textArr.length; i++) {
        y = (748 + 74 / 2) * rpx + 74 * rpx * i
        x = 74 * rpx
        context.fillText(textArr[i], 621 * rpx, y)
      }
      context.stroke()
      break
    case 5:
      console.log('画小字')
      context.fillStyle = globalData.choose_tp.textonecolour
      context.font = 'lighter 10px FZShuSong-Z01S'
      let textArr1 = globalData.keyword.wordremarks.split('')
      for (let i = 0; i < textArr1.length; i++) {
        let y = (748 + 14) * rpx + 28 * rpx * (i % 13)
        let x = 566 * rpx
        if (i >= 13) {
          x = 528 * rpx
        }
        context.font = '10px FZShuSong-Z01S'
        if (textArr1[i] == '，') {
          y = y - 6 * rpx
          x = x + 6 * rpx
        }
        context.setFontSize(24 * rpx)
        context.fillText(textArr1[i], x, y)
        context.stroke()
      }
      break
    case 6:
      console.log('画头像图')
      let url_p = globalData.img_avatar //'/images/poster_4.jpg'
      // //开始路径画圆,剪切处理
      context.save()
      context.beginPath()
      context.arc(95 * rpx, 1010 * rpx, 45 * rpx, 0, Math.PI * 2, false)
      context.stroke()
      context.clip() //剪切路径
      context.drawImage(url_p, 50 * rpx, 965 * rpx, 90 * rpx, 90 * rpx)
      //恢复状态
      context.stroke()
      context.restore()
      console.log('画二维码')
      context.drawImage(
        globalData.curt_QR_code, //'/images/poster_4.jpg',
        578 * rpx,
        1120 * rpx,
        150 * rpx,
        150 * rpx
      )
      context.drawImage(
        globalData.img_logo,
        48 * rpx,
        1194 * rpx,
        234 * rpx,
        48 * rpx
      )
      break
    case 7:
      console.log('画说的话')
      context.textAlign = 'left'
      let text_1 =
      globalData.name == '' ? globalData.userInfo.nickName : globalData.name
      text_1 += ' Jiu是这么拽'
      let text_2 = globalData.choose_wine.wordbody
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFillStyle(globalData.choose_tp.textonecolour)
      context.setFontSize(24 * rpx)
      context.fillText(text_1, 50 * rpx, (1073 + 12) * rpx)
      // context.fillText(text_2, 50 * rpx, (1109 + 12) * rpx)
      break
    case 8:
      context.textAlign = 'left'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(26 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      context.save()
      let text_2_1 = globalData.choose_wine.wordbody.substring(0, 15)
      context.fillText(text_2_1, 50 * rpx, (1109 + 12) * rpx)
      context.restore()
      break
    case 9:
      let text_3_1 = globalData.choose_wine.wordbody.substring(16)
      if(text_3_1=='') break
      context.textAlign = 'left'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(26 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      context.save()
      context.fillText(text_3_1, 50 * rpx, (1135 + 12) * rpx)
      context.restore()
      break
    case 10:
      console.log('画提示文字')
      context.save()
      let text_t = '扫码生成我的酒话'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.textAlign = 'center'
      context.setFontSize(18 * rpx)
      context.fillText(text_t, 645 * rpx, 1310 * rpx)
      context.restore()
      context.draw(true, () => {
        setTimeout(()=>{
          canvasToTempFilePath(that)
        },500)
      })
      return
  }
  // setTimeout(()=>{
    context.draw(true, function () {
      that.setData({
        onDrawingStep: false
      })
    })
  // },100)
}


function canvas_tp3(that, globalData) {
  let step = 0;
  let canvas_tpl_intel = setInterval(function(){
    if(true == that.data.onDrawingStep) return;
    that.setData({ onDrawingStep: true})
    tp3_steps(++step, that, globalData)
    if(step>=10)
      clearInterval(canvas_tpl_intel)
  },10)
}
function tp4_steps(step,that, globalData){
  let carvasw = that.data.windowWidth / 750 * 600
  // let rpx = that.data.windowWidth / 750
  let rpx = 0.5
  var context = wx.createCanvasContext('myCanvas', that) //1.创建carvas实例对象，方便后续使用。
  let weather = globalData.weather
  let text_2 = globalData.choose_wine.wordbody

  switch(step){
    case 1 :
      let backcolour = globalData.choose_tp.backcolour ? globalData.choose_tp.backcolour : '#f5f2e9'
      console.log("backcolor:"+backcolour)
      context.setFillStyle(backcolour) //换模版颜色
      context.fillRect(0, 0, 750, 1334)
      context.restore()
      //画背景图
      context.drawImage(
        globalData.img_back, //'/images/poster_4.jpg',
        0, 0, 750, 761,
        33 * rpx, 35 * rpx, 681 * rpx, 761 * rpx
      )
      context.drawImage(globalData.img_logo,67 * rpx,58 * rpx,234 * rpx,48 * rpx)
      context.restore()
      break
    case 2:
      console.log('画天气')
      context.textBaseline = 'middle'
      context.setFillStyle('rgba(178,130,70,1)')
      context.fillRect(72 * rpx, 702 * rpx, 250 * rpx, 301 * rpx)
      context.strokeStyle = 'rgba(255,255,255,1)'
      context.stroke()
      context.beginPath()
      context.moveTo(115 * rpx, 792 * rpx)
      context.lineTo(279 * rpx, 792 * rpx)
      context.moveTo(115 * rpx, 910 * rpx)
      context.lineTo(279 * rpx, 910 * rpx)
      context.strokeStyle = 'rgba(255,255,255,1)' //'rgba(255,255,255,1)'
      context.stroke()
      break
    case 3:
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(24 * rpx)
      context.textAlign = 'center'
      // context.fillStyle = globalData.choose_tp.texttwocolour
      context.fillStyle = '#fff'
      context.save()
      context.fillText(weather.datestring, 198 * rpx, 737 * rpx)
      context.restore()
      break
    case 4:
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(24 * rpx)
      context.textAlign = 'center'
      context.fillStyle = 'rgb(255,255,255)'
      // context.fillStyle = globalData.choose_tp.texttwocolour
      context.fillStyle = '#fff'
      context.save()
      context.fillText(weather.lunarcalendar, 198 * rpx, 770 * rpx)
      context.restore()
      break
    case 5:
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(76 * rpx)
      context.fillStyle = 'rgb(255,255,255)'
      // context.fillStyle = globalData.choose_tp.texttwocolour
      context.fillStyle = '#fff'
      context.textAlign = 'center'
      context.save()
      context.fillText(weather.day, 195 * rpx, 850 * rpx)
      context.restore()
      break
    case 6:
      var txt1 = weather.temp1 + '~' + weather.temp2
      context.setFontSize(24 * rpx)
      context.fillText(txt1, 198 * rpx, 936 * rpx)
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.fillStyle = '#fff'
      context.setFontSize(24 * rpx)
      context.fillText(weather.weather, 198 * rpx, 970 * rpx)
      context.restore()
      console.log('天气画好了...')
      break
    case 7:
      console.log('画随机文字')
      context.save()
      context.textBaseline = 'middle'
      let textArr = globalData.keyword.keyword.split('')
      for (let i = 0; i < textArr.length; i++) {
        let y = 113 * rpx + 74 * rpx * i
        let x = 616 * rpx
        context.font = '10px FZShuSong-Z01S'
        context.fillStyle = globalData.choose_tp.titlecolour
        context.setFontSize(74 * rpx)
        context.fillText(textArr[i], x, y)
      }
      context.restore()
      break
    case 8:
      console.log('画小字')
      let textArr1 = globalData.keyword.wordremarks.split('')
      context.save()
      for (let i = 0; i < textArr1.length; i++) {
        let y = 90 * rpx + 28 * rpx * (i % 13)
        let x = 564 * rpx
        if (i >= 13) {
          x = 526 * rpx
        }
        context.font = '10px FZShuSong-Z01S'
        context.fillStyle = globalData.choose_tp.titlecolour
        if (textArr1[i] == '，') {
          y = y - 6 * rpx
          x = x + 6 * rpx
        }
        context.setFontSize(24 * rpx)
        context.fillText(textArr1[i], x, y)
      }
      context.restore()
      break
    case 9:
      console.log('画头像图')
      let url_p = globalData.img_avatar //'/images/poster_4.jpg'
      // //开始路径画圆,剪切处理
      context.save()
      context.beginPath()
      if(text_2.length>15){
        context.arc(115 * rpx, 1095 * rpx, 45 * rpx, 0, Math.PI * 4, false)
      }else{
        context.arc(115 * rpx, 1170 * rpx, 45 * rpx, 0, Math.PI * 4, false)
      }
      context.stroke()
      context.clip() //剪切路径
      if(text_2.length>15){
        context.drawImage(url_p, 70 * rpx, 1050 * rpx, 90 * rpx, 90 * rpx)
      }else{
        context.drawImage(url_p, 70 * rpx, 1125 * rpx, 90 * rpx, 90 * rpx)
      }
      //恢复状态
      context.restore()
      context.save()
      context.drawImage(
        globalData.logotext,
        420 * rpx,
        854 * rpx,
        293 * rpx,
        73 * rpx
      )
      context.restore()
      console.log('画二维码')
      context.save()
      context.drawImage(
        globalData.curt_QR_code, //'/images/poster_4.jpg',
        566 * rpx,
        1111 * rpx,
        150 * rpx,
        150 * rpx
      )
      context.restore()
      break
    case 10:
      console.log('画说的话')
      context.save()
      context.textAlign = 'left'
      context.fillStyle = 'rgb(201,160,99)'
      let text_1 =
        globalData.name == '' ? globalData.userInfo.nickName : globalData.name
        text_1 += ' Jiu是这么拽'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(28 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      if(text_2.length>15){
        context.fillText(text_1, 70 * rpx, 1210 * rpx)
      }else{
        context.fillText(text_1, 70 * rpx, 1247 * rpx)
      }
      context.restore()
      break
    case 11:
      context.textAlign = 'left'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(28 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      context.save()
      let text_2_S = globalData.choose_wine.wordbody.substring(0, 15)
      if(text_2.length>15){
        context.fillText(text_2_S, 70 * rpx, 1252 * rpx)
      }else{
        context.fillText(text_2_S, 70 * rpx, 1280 * rpx)
      }
      context.restore()
      break
    case 12:
      let text_3 = globalData.choose_wine.wordbody.substring(16)
      if(text_3=='') break
      context.textAlign = 'left'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.setFontSize(28 * rpx)
      context.fillStyle = globalData.choose_tp.textonecolour //'rgb(201,160,99)
      context.save()
      if(text_2.length>15){
        context.fillText(text_3, 70 * rpx, 1294 * rpx)
      }else{
        context.fillText(text_3, 70 * rpx, 1322 * rpx)
      }
      context.restore()
      break
    case 13:
      console.log('画提示文字')
      context.save()
      let text_t = '扫码生成我的酒话'
      context.font = 'lighter 10px FZShuSong-Z01S'
      context.textAlign = 'center'
      context.setFontSize(18 * rpx)
      context.fillText(text_t, 640 * rpx, 1279 * rpx)
      context.restore()
      context.draw(true, () => {
        setTimeout(()=>{
          canvasToTempFilePath(that)
        },500)
      })
      return
  }
  // setTimeout(()=>{
    context.draw(true, function () {
      that.setData({
        onDrawingStep: false
      })
    })
  // },100)
}


function canvas_tp4(that, globalData) {
  let step = 0;
  let canvas_tpl_intel = setInterval(function(){
    if(true == that.data.onDrawingStep) return;
    console.log('kaish')
    that.setData({ onDrawingStep: true})
    tp4_steps(++step, that, globalData)

    if(step>=13)
      clearInterval(canvas_tpl_intel)
  },10)
}

function canvasToTempFilePath(that) {
  wx.canvasToTempFilePath({
    canvasId: 'myCanvas',
    quality: 0.8,
    fileType: 'jpg',
    success(res) {
      console.log(res)
      wx.setStorageSync('myCanvas', res.tempFilePath)
      that.setData({ img_src: res.tempFilePath, poster: true })
      // wx.redirectTo({
      //   url: '/pages/main',
      // })
    },
    fail(res) {
      console.log('canvasToTemp fail:')
      console.log(res)
    }
  })
}

function drawCanvasFromTemp(canvasId, that, tmpFile) {
  const ctx = wx.createCanvasContext(canvasId, that);
  if (undefined != tmpFile && '' != tmpFile) {
    console.log("draw tmpFile:"+tmpFile)
    ctx.drawImage(tmpFile, 0, 0)
    ctx.draw()
  }
  return ctx;
}

function canvasToTemp(canvasId, resolve) {
  wx.canvasToTempFilePath({
    canvasId: canvasId,
    quality: 1,
    fileType: 'jpg',
    success(res) {
      resolve(res)
    },
    fail(res){
      console.log('canvasToTemp fail:')
      console.log(res)
    }
  })
}

module.exports = {
  canvascoll: canvascoll,
}
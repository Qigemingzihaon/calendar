// pages/edit.js
var util = require('../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    can_change_post_img:false, //是否可更换海报图片 备用
    keyword:{'keyword':'淡薄','id':0},
    name: '淡薄',
    wine : [],
    choose_wine:[],
    tp_list:[],
    choose_tp_index:-1,
    choose_tp:[],
    on_edit_keyword: false,
    on_edit_name: false,
    page: 1,
    pagesize: 5,
    onload: false,
    loaded: false,
    tampimg_list:[],
    checkedimgid:0,
    checkedimgindex:0,
    tampimgpage:1,
    tampimgpagesize:10,
    tampimgonload: false,
    tampimgloaded: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var name = app.globalData.userInfo.nickName;
    this.setData({
      name:name
    });
    this.get_info();
    this.gettamp_list();
    this.gettampimg_list();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log('s')
    // this.canvascoll()
  },

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
  onShareAppMessage: function() {},

  // change_keywold: function() {
  //   util.httpRequest('/aromainfo/getkeywordandwine', {}, 'POST', function(res) {
  //     let keyw = res.data.keyword
  //   })
  // },
// 获取关键词和酒话信息
  get_info:function() {
    var that = this;
    util.httpRequest('/aromainfo/getkeywordandwine',{},'POST',
      function(res){
        if(res.status==1){
          let keyword = res.data.keyword;
          let wine = res.data.wine;
          if (undefined != wine[0])
            wine[0]['selected'] = 1;
          that.setData({
            keyword: keyword,
            wine: wine,
            choose_wine: res.data.wine[0],
          });
        }else{
          util.toast('连接失败',true,'none')
        }
      }
    )
  },

//获取关键字信息
  change_keywold: function () {
    var that = this;
    util.httpRequest('/aromainfo/getkeyword',{}, 'POST',
      function (res) {
        if(res.status==1){
          that.setData({
            keyword: res.data.keyword
          });
        }else{
          util.toast('连接失败',true,'none')
        }
        // console.log(res);
        
      }
    )
  },

  //获取酒话信息
  change_wine: function () {
    var that = this;
    util.httpRequest('/aromainfo/getwine', {}, 'POST',
      function (res) {
        if(undefined != res.data.wine[0])
          res.data.wine[0]['selected']=1;
        // console.log(res);
        that.setData({
          wine: res.data.wine,
          choose_wine: res.data.wine[0],
        });
      }
    )
  },

  select_wine: function (c){
    // console.log(c)
    let wineid=c.currentTarget.dataset.id;
    let wine = this.data.wine;
    let j = 0;
    for(let i=0;i<wine.length;i++){
      if(wineid == wine[i].wineid){
        j = i;
        wine[i]['selected'] = true;
      }else{
        wine[i]['selected'] = false;
      }
    }
    this.setData({
      choose_wine: wine[j],
      wine:wine,
    })
  },
  // 获取模板图片信息
  gettampimg_list: function () {
    var that = this;
    let data = {
      temid:1,
      page: this.data.tampimgpage,
      size: this.data.tampimgpagesize
    }
    if(that.data.choose_tp.temid){
      data.temid=that.data.choose_tp.temid
    }
    util.httpRequest('/aromainfo/gettopimgbytemid', data, 'POST',
      function (res) {
        if(res.status==1){
          let imglist = res.data;
          if(imglist.length){
            imglist.forEach((ele,i) => {
              ele.selected=false;
              ele.number=ele.number+(that.data.tampimgpage-1)*that.data.tampimgpagesize
            });
            that.setData({
              tampimg_list: that.data.tampimg_list.concat(imglist),
              tampimgonload: false,
              tampimgloaded: undefined == imglist.length || imglist.length < that.data.pagesize,
              checkedimgid:1,
              checkedimgindex: 0,
            });
          }else{
            that.setData({
              tampimg_list: that.data.tampimg_list.concat(imglist),
              tampimgonload: false,
              tampimgloaded: undefined == imglist.length || imglist.length < that.data.pagesize,
              checkedimgid:1,
              checkedimgindex: 0,
            });
            util.toast('暂无图片',true,'none')
          }
          if (that.data.checkedimgindex ==0){
            let item = 'tampimg_list[0].selected'
            that.setData({
              [item]: true,
            })
          }
        }else{
          util.toast('网络连接失败，请稍后再试',true,'none')
        }
      }
    )
  },
// 获取模板信息
  gettamp_list: function () {
    var that = this;
    util.httpRequest('/aromainfo/gettemplatelist', {page: this.data.page, size: this.data.pagesize}, 'POST',
      function (res) {
        if(res.status==1){
          let tp_list = res.data;
          if(tp_list.length){
            tp_list.forEach((ele,i) => {
              ele.selected=false;
            });
            that.setData({
              tp_list: that.data.tp_list.concat(tp_list),
              onload: false,
              loaded: undefined == tp_list.length || tp_list.length < that.data.pagesize,
              choose_tp_index: 0,
              choose_tp: tp_list[0]
            });
          }else{
            that.setData({
              tp_list: that.data.tp_list.concat(tp_list),
              onload: false,
              loaded: undefined == tp_list.length || tp_list.length < that.data.pagesize,
              choose_tp_index: 0,
              choose_tp: tp_list[0]
            });
            util.toast('暂无图片',true,'none')
          }
          if (that.data.choose_tp_index ==0){
            // console.log('ssss')
            let item = 'tp_list[0].selected'
            that.setData({
              [item]: true,
            })
          }
        }else{
          util.toast('网络连接失败，请稍后再试',true,'none')
        }

      }
    )
  },

  edit_keyword:function(){
    this.setData({'on_edit_keyword':!this.data.on_edit_keyword})
  },

  down_edit_keywrod : function(c){
    let that = this;
    if(c.detail.value.trim()==''){
      util.toast('请输入关键词！',true)
      that.setData({ keyword: { keyword: c.detail.value, id: 0, wordremarks:'' } })
      return
    }
    util.httpRequest('/aromainfo/getkeyword', { keyword: c.detail.value}, 'POST',
      function (res) {
        if(res.status==1){
          let keyword = res.data.keyword;
          keyword.keyword = c.detail.value;
          that.setData({
            keyword: keyword,
            on_edit_keyword: false
          })
        }else if(res.status==2){
          that.setData({ keyword: { keyword: '', id: 0, wordremarks:'' } })
          util.toast(res.message,true,'none')
        }else{
          util.toast('稍后再试',true,'none')
        }
        // console.log(res)
      }
    )
  },

  edit_name: function () {
    this.setData({ 'on_edit_name': !this.data.on_edit_name })
  },
  down_edit_name: function (c) {
    let that = this;
    if (c.detail.value.trim() == '') {
      util.toast('请输入姓名！', true)
      this.setData({ name: c.detail.value})
      return
    }
    util.httpRequest('/aromainfo/sensitive', { keyword: c.detail.value}, 'POST',
      function (res) {
        // console.log(res)
        if(res.status==1){
          that.setData({ name: c.detail.value, on_edit_name: false })
        }else if(res.status==2){
          that.setData({ name: ''})
          util.toast('不可输入敏感词！', true,'none')
        }else{
          util.toast('请稍后再试', true,'none')
        }
      }
    )
  },

  load_tamp: function () {
    let that = this;
    // console.log('111')
    if (!that.data.onload && !that.data.loaded) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把searchPageNum+1
        onload: true
      });
      that.gettamp_list();
    }
  },
  load_tampimg: function () {
    let that = this;
    // console.log('111')
    if (!that.data.tampimgonload && !that.data.tampimgloaded) {
      that.setData({
        tampimgpage: that.data.tampimgpage + 1,  //每次触发上拉事件，把searchPageNum+1
        tampimgonload: true
      });
      that.gettampimg_list();
    }
  },
  selectone: function (event) {
    // console.log(event)
    let idx = event.currentTarget.dataset.index
    let choose_tp_index = this.data.choose_tp_index
    if (this.data.choose_tp_index!=-1){
      let item = 'tp_list[' + this.data.choose_tp_index + '].selected'
      this.setData({
        [item]: false,
      })
    }

    let nitem = 'tp_list[' + idx + '].selected'
    let tp = this.data.tp_list[idx]
    this.setData({
      [nitem]: true,
      choose_tp_index: idx,
      choose_tp: tp,

    });
    if(choose_tp_index!=idx){
      this.setData({
        tampimg_list:[],
        checkedimgindex: 0,
        checkedimgid: 1,
        tampimgpage:1,
      })
      this.gettampimg_list();
    }
  },
  selectoneimg: function (event) {
    // console.log(event)
    let idx = event.currentTarget.dataset.index
    if (this.data.checkedimgindex!=-1){
      let item = 'tampimg_list[' + this.data.checkedimgindex + '].selected'
      this.setData({
        [item]: false,
      })
    }
    let nitem = 'tampimg_list[' + idx + '].selected'
    let tp = this.data.tampimg_list[idx].number
    this.setData({
      [nitem]: true,
      checkedimgindex: idx,
      checkedimgid: tp
    });
  },
  submit: function () {
    // util.canvascoll(this)
    if (this.data.keyword.keyword.trim() == '') {
      util.toast('请输入关键词！', true)
      return
    }

    if (this.data.name.trim() == '') {
      util.toast('请输入姓名！', true)
      return
    }

    if (this.data.choose_tp_index == -1 || this.data.choose_tp == []) {
      util.toast('请选择模版！', true)
      return
    }
    // console.log("start save to global...")
    // console.log(this.data)
    app.globalData.keyword = this.data.keyword;
    app.globalData.name = this.data.name;
    app.globalData.choose_wine = this.data.choose_wine;
    app.globalData.choose_tp = this.data.choose_tp;
    app.globalData.number = this.data.checkedimgid;
    app.globalData.need_reload = true;
    let wordbody = this.data.choose_wine.wordbody;
    app.globalData.choose_wine.wordlist = [wordbody.substring(0,15),wordbody.substring(15,30),wordbody.substring(30,45)];
    app.globalData.choose_wine.wordlist.forEach((element,index) => {
      if(element==''){
        app.globalData.choose_wine.wordlist.splice(index)
      }
    });
    wx.navigateTo({
      url: '/pages/main',
    })
    // util.getUrlImage(this.data.choose_tp.backgroundurl,function(resPath){
    //   app.globalData.img_back = resPath;
    //   util.getUrlImage(app.globalData.userInfo.avatarUrl,function(resPP){
    //     app.globalData.img_avatar = resPP
    //     if (!app.globalData.img_logo) {
    //       util.getUrlImage('', function (resPPP) {
    //         app.globalData.img_logo = resPPP
    //         wx.navigateTo({
    //           url: '/pages/main',
    //         })
    //       })
    //     }else{
    //       wx.navigateTo({
    //         url: '/pages/main',
    //       })
    //     }
    //   })
    // })
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

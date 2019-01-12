const fsm = wx.getFileSystemManager();
let n = 0;
let FILE_BASE_NAME = 'tmp_base64src';
function base64src(base64data, resolve, reject) {
  const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
  if (!format) {
    // reject('');
  }
  const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME+wx.getStorageSync('FILE_BASE_NAME')}.${format}`;
  const filePathl = `${wx.env.USER_DATA_PATH}/`;
  const files = `${FILE_BASE_NAME+wx.getStorageSync('FILE_BASE_NAME')}.${format}`;
  const buffer = wx.base64ToArrayBuffer(bodyData);
  fsm.writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success(e) {
      // console.log(e,filePath)
      wx.setStorageSync('FILE_BASE_NAME',wx.getStorageSync('FILE_BASE_NAME')?parseInt(wx.getStorageSync('FILE_BASE_NAME')) +1:1)
      resolve(filePath);
    },
    fail(e) {
      // console.log(e)
      reject(e);
    },
  });
  fsm.readdir({
    dirPath:wx.env.USER_DATA_PATH,
    success(res) {
      // console.log(res)
      if(res.files.length>2){
        for(let i = 0;i<res.files.length;i++){
            // console.log(res.files[i],res.files[i]!="miniprogramLog"&&res.files[i]!=files)
          if(res.files[i]!="miniprogramLog"&&res.files[i]!=files){
            fsm.unlink({
              filePath:filePathl+res.files[i],
              success(e){
                // console.log(e)
              },
              fail(r){
                // console.log(r)
              }
            })
          }
        }
      }
    },
    fail(e) {
      // console.log(e)
    },
  })

}
module.exports = {
  base64src: base64src
}
// export default base64src

var Person=require('../../models/person'),
    List=require('../../models/list')

var renderInfo=require('../../tools').renderInfo


/*list聊天记录实例
{
  type:0,//信息类型 0为文本 1为图片 2为语音 3为视频
  openid:'od04Tv0cqVPPLDnDYP6Wx3vhH0Mc',//用户openid
  fileName:'voice.mp3',//非文本类型时的文件名
  message:'有人打我',//文本类型时的文本内容
  time:1484288636144,//发消息时的UTC时间
  msgid:6374973069743538395//本条信息的微信messageid
}
*/
module.exports=function(app){
  //保存微信端用户发送的信息，每次调用push请求体到messages字段
  app.post('/saveMessage',(req,res,next)=>{
    var message=renderInfo(req.body)
    var listUpdatePush=List.prototype.updatePush,
        listSearchObj={
          openid:message.openid,
          $or:[{listStatus:0},{listStatus:5},{listStatus:6}]
        },
        listUpdateObj={messages:message}

    listUpdatePush(listSearchObj,listUpdateObj,(err,result)=>{
      if(err){
        console.error(err)
      }
      if(result.nModified){
        res.json({
          success:1,
          msg:'message保存成功'
        })
      }else{
        res.json({
          success:0,
          msg:'message保存失败'
        })
      }
    })
  })
}

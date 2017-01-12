var Person=require('../../models/person'),
    List=require('../../models/list')

var sendPost=require('../../models/tools').sendPost

/* 根据传参的字段创建订单对象并将创建的对象转发到微信服务器 */
function createListAndShare(res,schema){
  var newList=new List(schema)

  newList.save((list)=>{
    if(list){
      sendPost(list)//将创建的订单转发到微信服务器
      res.json({
        success:1,
        msg:'创建订单成功'
      })
    }
  })
}

/* 将openid对应的Person的用户状态变为1（已发起订单） */
function changeUserStatusToBusy(openid){
  var updatePerson=Person.prototype.update,
      searchObj={
        openid
      },
      updateObj={
        userStatus:1
      }

  updatePerson(searchObj,updateObj,(err,result)=>{
    if(err){
      console.error(err)
    }

    if(result.nModified){
      console.log('用户状态更改成功')
    }else{
      console.log('用户状态更改失败')
    }
  })
}

module.exports=function(app){
  //创建普通订单
  app.post('/createNormalList',(req,res,next)=>{
    var findOnePerson=Person.prototype.findOne
    var filter=req.body,
        wxName=filter.wxName,
        openid=filter.openid,
        startTime=Date.now()
    var schema={
          wxName,
          openid,
          startTime,
          listStatus:0,
          listType:1//普通订单类型
        }

    /* 创建订单，更改用户person对象用户状态 */
    createListAndShare(res,schema)
    changeUserStatusToBusy(openid)
  })

  //创建紧急订单
  app.post('/createEmergencyList',(req,res,next)=>{
    var findOnePerson=Person.prototype.findOne
    var filter=req.body,
        wxName=filter.wxName,
        openid=filter.openid,
        startTime=Date.now()
    var schema={
          wxName,
          openid,
          startTime,
          listStatus:0,
          listType:0//紧急订单类型
        }

    createListAndShare(res,schema)
    changeUserStatusToBusy(openid)
  })
}

/*
 * 用于操作数据库以及向客户端返回结果的共用操作模块
*/

var Person=require('../person'),
    List=require('../list')

var tools={
  resUpdate (req,res,model,searchObj,updateObj,successMsg,errorMsg){
  //在执行完update操作后返回操作是否成功的boolean
  //isUpdate (model,searchObj,updateObj){
    var update=model.prototype.update

    update(searchObj,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){//异步因此最后return的是null
        res.json({
          success:1,
          msg:successMsg
        })
      }else{
        res.json({
          success:0,
          msg:errorMsg
        })
      }
    })
  },
  changePoliceStatus (res,policeName,policeStatusNumber,listTimeType,isTransmit){
    if(!arguments[4]){
      var isTransmit=false
    }

    var listUpdate=List.prototype.update,
        personUpdate=Person.prototype.update

    var filter

    var updateObj={[listTimeType]:Date.now()}

    if(listTimeType==='confirmTime'){//已接单接口调用时将listStatus设置为5
      filter={listStatus:1,policeName}
      updateObj.listStatus=5
    }

    if(listTimeType==='arriveTime'){//已到达接口调用时将listStatus设置为6
      filter={listStatus:5,policeName}
      updateObj.listStatus=6
    }

    if(listTimeType==='solvedTime'){//已解决接口调用时将listStatus设置为2
      filter={listStatus:6,policeName}
      updateObj.listStatus=2
    }

/*    if(isTransmit){
      tools.transmit(filter)//转发数据
    }*/

    listUpdate(filter,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){
        personUpdate({name:policeName},{status:policeStatusNumber},(err,result)=>{
          if(err){
            console.error(err)
          }

          if(result.nModified){

          /*  if(isTransmit){
              console.log(filter)
              tools.transmit(filter)//转发数据
            }
*/
            res.json({
              success:1,
              msg:`订单时间字段 ${listTimeType} 设置成功,民警当前status值为：${policeStatusNumber}`
            })
          }else{
            res.json({
              success:0,
              msg:`订单时间字段 ${listTimeType} 设置成功,民警状态修改失败，当前传参status值与当前民警状态值相同`
            })
          }
        })
      }else{//未匹配订单
        res.json({
          success:0,
          msg:'未匹配到符合条件的订单'
        })
      }
    })
  },
  sendPost (infoObj){
    var requestify=require('requestify')

    requestify.post('http://115.159.202.104:8989/feedback', infoObj)
    .then(function(response) {
        response.getBody();
    });
  },
  /*调用该方法后根据参数对象在list集合中搜索list对象，抽出所需字段推到微信服务器*/
  transmit (filter){
    var findOne=List.prototype.findOne
    var listStatus=filter.listStatus,
        policeName=filter.policeName

    findOne({listStatus,policeName},(err,list)=>{
      if(err){
        console.error(err)
      }

      if(list){
        tools.sendPost({
          openid:list.openid,
          listStatus:list.listStatus,
          id:list._id,
          caseInfo:list.caseInfo
        })
      }
    })
  },
  ignoreTransmit(_id){//忽略订单的时候使用的转发方法
    var findOne=List.prototype.findOne

    findOne({_id},(err,list)=>{
      if(err){
        console.error(err)
      }

      if(list){
        tools.sendPost({
          openid:list.openid,
          listStatus:list.listStatus,
          id:list._id,
          caseInfo:list.caseInfo
        })
      }
    })
  }
}

module.exports=tools

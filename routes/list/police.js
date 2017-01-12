var Person=require('../../models/person'),
    List=require('../../models/list')

var tools=require('../../models/tools')

module.exports=function(app){

    /*
     * 更改民警状态
    */

    //获取分配给自己（该民警）的任务
    app.post('/getMission',(req,res,next)=>{
      var findOne=List.prototype.findOne
      var searchObj={
        policeName:req.body.policeName,
        //listStatus:1
        $or:[{listStatus:1},{listStatus:5},{listStatus:6}]
      }

      findOne(searchObj,(err,list)=>{
        if(err){
          console.error(err)
        }

        if(list){
          delete list.paperOne
          delete list.paperTwo
          res.json({
            success:1,
            list
          })
        }else{
          res.json({
            success:0,
            msg:'当前民警未分配任务'
          })
        }
      })
    })

    app.post('/confirmMission',(req,res,next)=>{
      tools.changePoliceStatus(res,req.body.policeName,2,'confirmTime')
    })

    app.post('/policeArrive',(req,res,next)=>{
      tools.changePoliceStatus(res,req.body.policeName,3,'arriveTime')
    })

    app.post('/policeSolved',(req,res,next)=>{
      /* 更改对应订单的服务用户userStatus为0 */
      var policeName=req.body.policeName
      var personUpdate=Person.prototype.update,
          listFindOne=List.prototype.findOne,
          listSearchObj={listStatus:6,policeName}

      listFindOne(listSearchObj,(err,list)=>{
        if(err){
          console.error(err)
        }
        if(list){
          var openid=list.openid,
              personSearchObj={openid},
              personUpdateObj={userStatus:0}
          personUpdate(personSearchObj,personUpdateObj,(err,result)=>{
            if(err){
              console.error(err)
            }
            if(!result.nModified){
              console.log('民警结束订单时更改userStatus成功')
            }else{
              console.error('民警结束订单时更改userStatus失败')
            }
          })
        }else{
          console.error('未找到匹配的订单以供修改userStatus')
        }
      })

      /* 向微信服务转发状态 */
      tools.changePoliceStatus(res,policeName,0,'solvedTime',true,req.body.policeComment)
    })

    //根据民警用户名返回所有的已完成订单(listStatus=2 || 3)
    app.post('/getPoliceHistory',(req,res,next)=>{
      var find=List.prototype.find
      var filter=req.body,
          searchObj={
            policeName:filter.policeName,
            $or:[{listStatus:2},{listStatus:3}]
          }

      find(searchObj,(err,lists)=>{
        if(err){
          console.error(err)
        }

        if(lists.length){
          res.json({
            success:1,
            lists
          })
        }else{
          res.json({
            success:1,
            msg:'暂时没有历史订单'
          })
        }
      })
    })
}

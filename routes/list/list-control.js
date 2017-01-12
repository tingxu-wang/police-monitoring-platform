var Person=require('../../models/person'),
    List=require('../../models/list')

var tools=require('../../models/tools')

module.exports=function(app){
  /* web端设置心跳抓取listStatus=0的list对象数组 */
  app.post('/getWantedList',(req,res,next)=>{
    var find=List.prototype.find

    find({listStatus:0},(err,lists)=>{
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
          success:0,
          msg:'暂时没有未处理的订单'
        })
      }
    })
  })

  /* web端设置心跳抓取status=0的person对象数组(抓取空闲的民警) */
  app.post('/getfreePolice',(req,res,next)=>{
    var find=Person.prototype.find

    find({status:0,type:1},(err,persons)=>{
      if(err){
        console.error(err)
      }

      if(persons.length){
        res.json({
          success:1,
          persons:persons
        })
      }else{
        res.json({
          success:0,
          msg:'目前没有空闲的民警'
        })
      }
    })
  })

  /* web端忽略未处理的订单 */
  app.post('/ignoreList',(req,res,next)=>{
    var update=List.prototype.update,
        _id=req.body._id
    var searchObj={
          _id
        },
        updateObj={
          listStatus:4,
          endTime:Date.now()
        }
    var success='案件忽略成功',
        error='案件失败'

    update(searchObj,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){
        tools.ignoreTransmit(_id)//向微信服务转发状态
        res.json({
          success:1,
          msg:success
        })
      }else{
        res.json({
          success:0,
          msg:error
        })
      }
    })
  })

  /* web端委派未处理的订单 */
  app.post('/delegate',(req,res,next)=>{
    var filter=req.body
    var listUpdate=List.prototype.update,
        personUpdate=Person.prototype.update

    var searchObj={_id:filter._id},
        updateObj={listStatus:1,sendTime:Date.now(),policeName:filter.policeName}

    listUpdate(searchObj,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){//订单状态修改成功
        personUpdate({name:filter.policeName,type:1},{status:1},(err,result)=>{
          if(err){
            console.error(err)
          }

          if(result.nModified){
            tools.transmit(updateObj)//向微信服务转发状态

            res.json({
              success:1,
              msg:'民警状态及案件状态修改成功'
            })
          }else{
            res.json({
              success:0,
              msg:'民警状态修改失败'
            })
          }
        })
      }else{
        res.json({
          success:0,
          msg:'未匹配到符合该_id值的list对象或该list对象listStatus已经为1'
        })
      }
    })
  })

  /* web端获取所有历史订单 */
  app.post('/getHistoryLists',(req,res,next)=>{
    var find=List.prototype.find

    find({listStatus:{$gte:2,$lte:4}},(err,lists)=>{
      if(lists){
        res.json({
          success:1,
          lists
        })
      }else{
        res.json({
          success:0,
          info:'目前没有已完成的订单'
        })
      }
    })
  })

  /* web端获取正在进行的案件（listStatus为5 6的订单） */
  app.post('/getUnfinishLists',(req,res,next)=>{
    var find=List.prototype.find,
        searchObj={$or:[{listStatus:5},{listStatus:6}]}

    find(searchObj,(err,lists)=>{
      if(err){
        console.error(err)
      }

      if(lists){
        res.json({
          success:1,
          lists
        })
      }else{
        res.json({
          success:0,
          msg:'未找到正在进行的订单'
        })
      }
    })
  })
}

var Person=require('../../models/person'),
    List=require('../../models/list')

module.exports=function(app){
  //创建文档保存paperOne数据并记录startTime
  app.post('/paperOne',(req,res,next)=>{
    var listFindOneAndUpdate=List.prototype.findOneAndUpdate,
        personUpdate=Person.prototype.update
    var paper=req.body
    var listSearchObj={
          _id:paper.sojumpparm//根据订单id得到订单对象
        },
        listUpdateObj={//转存问卷中的关键信息
          caseInfo:paper.q5,
          userName:paper.q1,
          phoneNum:paper.q3,
          idCard:paper.q2,
          caseType:paper.q4
        }
    var personSearchObj={},
        personUpdateObj={//将问卷中的用户姓名更新到对应的person对象中
          name:paper.q1
        }

    listFindOneAndUpdate(listSearchObj,listUpdateObj,(err,list)=>{
      if(err){
        console.error(err)
      }

      if(list){
        personSearchObj.openid=list.openid//填充person检索项
        personUpdate(personSearchObj,personUpdateObj,(err,result)=>{//更新用户对象
          if(err){
            console.error(err)
          }

          if(result.nModified){
            res.json({
              success:1,
              msg:'订单信息更新，用户对象name字段更新'
            })
          }else{
            res.json({
              success:0,
              msg:'订单信息更新成功，用户对象name字段更新失败'
            })
          }
        })
      }else{
        res.json({
          success:0,
          msg:'保存问卷信息失败，未找到匹配的list对象'
        })
      }
    })
  })

  app.post('/paperTwo',(req,res,next)=>{
    var update=List.prototype.update
    var paper=req.body/*,
        schema={
          paperTwo:paper,
          endTime:Date.now()
        }*/
    var listId=paper.sojumpparm//从反馈表单对象中取出的list对象id

    var searchObj={_id:listId,listStatus:2},
        //userComment=(paper.q4 || ''),
        updateObj={
          listStatus:3,
          caseResult:paper.q3,
          policeAttitude:paper.q2,
          userComment:[paper.q4 || ''],
          policeSpeed:paper.q1,
          paperTwo:paper,
          endTime:Date.now()
        }

    update(searchObj,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){
        res.json({
          success:1,
          msg:'订单评价成功'
        })
      }else{
        res.json({
          success:0,
          msg:'该订单已评价'
        })
      }
    })
  })
}

var Person=require('../models/person'),
    List=require('../models/list')

var tools=require('../tools'),
    renderInfo=tools.renderInfo

module.exports=function(app){
  app.post('/save',(req,res,next)=>{
    var person={
      type:req.body.type,
      location:req.body.location,
      name:req.body.name
    }

    var newPerson=new Person(person)

    newPerson.findOne({name:person.name},(err,person)=>{
      if(person){
        res.json({
          success:0,
          msg:'用户已存在'
        })
      }else{
        newPerson.save((err,person)=>{
          if(err){
            console.error(err)
          }
          res.json({
            success:1,
            msg:'用户信息保存成功'
          })
        })
      }
    })
  })

  app.post('/findOne',(req,res,next)=>{
    //var infoObj=req.body
    var filter=renderInfo(req.body)
    var findOne=Person.prototype.findOne


    findOne(filter,(err,person)=>{
      if(err){
        console.error(err)
      }

      if(person){
        res.json({
          success:1,
          person:person
        })
      }else{
        res.json({
          success:0,
          msg:'未找到匹配项'
        })
      }
    })
  })

  app.post('/find',(req,res,next)=>{
    //var filter=req.body
    var filter=renderInfo(req.body)
    var find=Person.prototype.find

    find(filter,(err,persons)=>{
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
          msg:'未找到匹配项'
        })
      }
    })
  })

  app.post('/upsertUpdate',(req,res,next)=>{
    var upsertUpdate=Person.prototype.upsertUpdate
    var filter=req.body,
        name=filter.name

    var updateObj=Object.assign({},filter)
    delete updateObj.name

    upsertUpdate({name},updateObj,(err, result)=>{
      if(err){
        console.error(err)
      }

      if(result.upserted){
        res.json({
          success:1,
          msg:'成功创建成员'
        })
      }else{
        if(result.nModified){
          res.json({
            success:1,
            msg:'成功覆盖字段'
          })
        }else{
          res.json({
            success:0,
            msg:'未成功覆盖字段'
          })
        }
      }
    })
  })

  app.post('/update',(req,res,next)=>{
    var filter=req.body,
        name=filter.name

    var updateObj=Object.assign({},filter)
    delete updateObj.name

    var searchObj={name}

    var success='成功覆盖字段',
        error='未成功覆盖字段'

    //tools.resUpdate(req,res,Person,searchObj,updateObj,success,error)
    var update=Person.prototype.update

    update(searchObj,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){
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
}

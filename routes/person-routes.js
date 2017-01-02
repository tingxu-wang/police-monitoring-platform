var Person=require('../models/person'),
    List=require('../models/list')

module.exports=function(app){
  app.get('/save',(req,res,next)=>{
    var person={
      type:req.query.type,
      location:req.query.location,
      name:req.query.name
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

  app.get('/findOne',(req,res,next)=>{
    var filter=req.query
    var findOne=Person.prototype.findOne

    if(Object.getOwnPropertyNames(filter).length!==1){
      res.json({
        success:0,
        msg:'单个查找仅支持单个字段'
      })
    }else{
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
            msg:'该用户不存在'
          })
        }
      })
    }
  })

  app.get('/find',(req,res,next)=>{
    var filter=req.query
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

  app.get('/upsertUpdate',(req,res,next)=>{
    var upsertUpdate=Person.prototype.upsertUpdate
    var filter=req.query,
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

  app.get('/update',(req,res,next)=>{
    var filter=req.query,
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

      if(result.nModified){//异步因此最后return的是null
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

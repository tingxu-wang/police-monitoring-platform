var express = require('express');
var router = express.Router();

//数据集合
var Person=require('../models/person'),
    List=require('../models/list')

var getpath=require('../path_index')

var tools=require('../models/tools')//向客户端返回json的工具模块

/* GET home page. */


module.exports = function (app){
  app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    next()
  })

  app.get('/', (req, res, next)=>{//根目录加载ejs模板
    res.render('index',{title:'test'})
  });

  app.get('/test',(req,res,next)=>{
    res.render(getpath.src+'test.html')
  })


//--------

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

    tools.resUpdate(req,res,Person,searchObj,updateObj,success,error)
  })

  /*
   * 更改民警状态(status) 同时修改person中的status以及history中的对应时间
  */

/*  app.get('/changeStatus',(req,res,next)=>{//通用方法,不提交时间
    var filter=req.query,
        searchObj={name:filter.name},
        updateObj={status:filter.status}

    var success='修改民警状态 成功',
        error='修改民警状态 失败'

    // if(tools.isUpdate(Person,searchObj,updateObj)){
    //   tools.resSuc(res,success)
    // }else{
    //   tools.resErr(res,error)
    // }
    //tools.resUpdate(req,res,Person,searchObj,updateObj,success,error)

  })*/

  app.get('/callout',(req,res,next)=>{//出警
    var filter=req.query,
        searchObj={name:filter.name},
        updateObj={status:1}

    var success='修改民警状态：出警 成功',
        error='修改民警状态：出警 失败'


  })

  app.get('/send',(req,res,next)=>{//委派
    var filter=req.query,
        searchObj={name:filter.name},
        updateObj={status:2}

    var success='修改民警状态：委派 成功',
        error='修改民警状态：委派 失败'


  })

  app.get('/arrive',(req,res,next)=>{//民警到达
    var filter=req.query,
        searchObj={name:filter.name},
        updateObj={status:3}

    var success='修改民警状态：到达 成功',
        error='修改民警状态：到达 失败'


  })

  app.get('/solve',(req,res,next)=>{
    var filter=req.query,
        searchObj={name:filter.name},
        updateObj={status:4}

    var success='修改民警状态：已解决 成功',
        error='修改民警状态：已解决 失败'


  })
}

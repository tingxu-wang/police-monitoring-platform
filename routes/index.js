var express = require('express');
var router = express.Router();

var Person=require('../models/person.js')

var getpath=require('../path_index')

/* GET home page. */


module.exports = function (app){
  app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    next()
  })

  app.get('/', (req, res, next)=>{//根目录加载ejs模板
    res.render('index',{title:'test'})
  });
/*
  app.get('/tool',(req,res,next)=>{//开发时用到的工具页面
    res.render(getpath.src+'tool.html')
  })*/

  app.get('/test',(req,res,next)=>{
    res.render(getpath.src+'test.html')
  })

  app.post('/save',(req,res,next)=>{
    var person={
      type:req.body.type,
      location:req.body.location,
      name:req.body.name
    }

    var newPerson=new Person(person)

    newPerson.findOne((err,person)=>{
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

  app.post('/update',(req,res,next)=>{


    var person={
      name:req.body.name
    }
    var updateObj=req.body.updateObj

    var newPerson=new Person(person)
    newPerson.update(person,updateObj,(err, result)=>{
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

  app.post('/findOne',(req,res,next)=>{
    var filter=req.body
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

  app.post('/find',(req,res,next)=>{
    var filter=req.body
    var find=Person.prototype.find

    find(filter,(err,persons)=>{
      if(err){
        console.error(err)
      }

      if(persons){
        res.json({
          success:1,
          persons:persons
        })
      }
    })
  })
}

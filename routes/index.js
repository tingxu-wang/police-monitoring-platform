var express = require('express');
var router = express.Router();

var Person=require('../models/person.js')

/* GET home page. */


module.exports = function (app){
  app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    next()
  })

  app.get('/', (req, res, next)=>{
    res.render('/views/index');
  });

  app.post('/save',(req,res,next)=>{
    var person={
      type:req.body.type,
      locationStr:req.body.locationStr,
      name:req.body.name
    }

    var newPerson=new Person(person)

    newPerson.save((err,person)=>{
      if(err){
        console.error(err)
      }
      res.json({
        success:1,
        info:'用户信息保存成功'
      })
    })
  })

  app.post('/update',(req,res,next)=>{
    var person={
      name:req.body.name,
      updateObj:req.body.updateObj//获取请求方传过来的修改参数修改对应的文档对象
    }
    var newPerson=new Person(person)
    newPerson.update(()=>{
      res.json({
        success:1,
        info:'update成功'
      })
    })
  })

  app.post('/getOne',(req,res,next)=>{
    var person={
      name:req.body.name
    }
    var newPerson=new Person(person)

    newPerson.getOne((err,person)=>{
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
          info:'该用户不存在'
        })
      }
    })
  })
}

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

    newPerson.get(req.body.name,(err,person)=>{
      if(person){
        res.json({
          status:0,
          info:'该用户已经存在'
        })
      }else{
        newPerson.save((err,person)=>{
          if(err){
            console.error(err)
          }
          res.json({
            status:1,
            info:'用户信息保存成功'
          })
        })
      }
    })
  })
}

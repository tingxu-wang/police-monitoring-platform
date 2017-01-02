/* 开发环境使用的路由 */

var Person=require('../models/person'),
    List=require('../models/list')

module.exports=function (app){
  app.get('/demo/:filename',(req,res,next)=>{
    res.render(`demo/${req.params.filename}`,{title:'demo'})
  })

/*  app.get('/testfindOneUpdate',(req,res,next)=>{
    var findOneAndUpdate=Person.prototype.findOneAndUpdate

    findOneAndUpdate({name:'minjing1'},{type:1},(err,person)=>{
      console.log(person)
    })
  })*/
}

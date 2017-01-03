/* 开发环境使用的路由 */

var Person=require('../models/person'),
    List=require('../models/list')

module.exports=function (app){
  app.get('/demo/:filename',(req,res,next)=>{
    res.render(`demo/${req.params.filename}`,{title:'demo'})
  })

  app.post('/postTest',(req,res,next)=>{
    var filter=req.body

    var keys=Object.getOwnPropertyNames(filter)

    console.log(keys)
    res.json({})
  })
}

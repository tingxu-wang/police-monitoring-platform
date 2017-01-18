/* 开发环境使用的路由 */

var Person=require('../models/person'),
    List=require('../models/list')

var renderInfo=require('../tools').renderInfo

module.exports=function (app){
  app.get('/demo/:filename',(req,res,next)=>{
    res.render(`demo/${req.params.filename}`,{title:'demo',position:''})
  })

  app.post('/postTest',(req,res,next)=>{
    var infoObj=req.body

    var keys=Object.getOwnPropertyNames(infoObj)
    var filter={}

    for(var i=0;i<keys.length;i++){
      var property=keys[i]

      filter[property]=infoObj[property]
    }

    res.json({
      info:filter
    })
  })

  app.post('/destory',(req,res,next)=>{
    var personRemove=Person.prototype.remove,
        listRemove=List.prototype.remove,
        searchObj=renderInfo(req.body)

    personRemove(searchObj.person)
    listRemove(searchObj.list)
  })
}

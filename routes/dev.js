/* 开发环境使用的路由 */

module.exports=function (app){
  app.get('/demo/:filename',(req,res,next)=>{
    res.render(`demo/${req.params.filename}`,{title:'demo'})
  })
}

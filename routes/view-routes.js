
module.exports=function(app){
  /* 视图渲染 */
  app.get('/',(req,res,next)=>{
    res.render('index',{title:'登录',position:'login'})
  })

  app.get('/views/delegate',(req,res,next)=>{
    res.render('delegate',{title:'未审核案件',position:'delegate'})
  })

  app.get('/views/history',(req,res,next)=>{
    res.render('history',{title:'历史案件',position:'history'})
  })

  app.get('/views/watch',(req,res,next)=>{
    res.render('watch',{title:'实时监控',position:'watch'})
  })

  app.get('/views/detail',(req,res,next)=>{
    res.render('detail',{title:'案件详情',position:'detail',policeName:req.query.policeName,id:req.query.id})
  })

  app.get('/views/historyFilter',(req,res,next)=>{
    res.render('historyFilter',{title:'民警历史案件',position:'historyFilter'})
  })

  /* 私信页面 */
  app.get('/views/chat',(req,res,next)=>{
    res.render('chat',{title:'留言查看',position:'chat',id:req.query.id})
  })
}

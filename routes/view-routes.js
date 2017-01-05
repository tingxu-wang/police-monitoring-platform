
module.exports=function(app){
  //视图渲染：
/*  app.get('/views/:filename', (req, res, next)=>{//根目录加载ejs模板
    //res.render('index',{title:'test'})
    res.render(`${req.params.filename}`,{title:'views'})
  });*/
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
}

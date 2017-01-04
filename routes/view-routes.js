
module.exports=function(app){
  //视图渲染：
/*  app.get('/views/:filename', (req, res, next)=>{//根目录加载ejs模板
    //res.render('index',{title:'test'})
    res.render(`${req.params.filename}`,{title:'views'})
  });*/
  app.get('/',(req,res,next)=>{
    res.render('index',{title:'登录'})
  })

  app.get('/views/delegate',(req,res,next)=>{
    res.render('delegate',{title:'未审核案件'})
  })
}

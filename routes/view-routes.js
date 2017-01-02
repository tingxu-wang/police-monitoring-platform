module.exports=function(app){
  //视图渲染：
  app.get('/views/:filename', (req, res, next)=>{//根目录加载ejs模板
    //res.render('index',{title:'test'})
    res.render(`${req.params.filename}.ejs`,{title:'views'})
  });
}

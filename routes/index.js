/*var express = require('express');
var router = express.Router();
*/

var getpath=require('../path_index')

var listRoutes=require('./list-routes'),//list路由模块
    personRoutes=require('./person-routes'),//person路由模块
    devRoutes=require('./dev-routes'),//开发路由模块
    viewRoutes=require('./view-routes')//视图路由模块

module.exports = function (app){
  //CORS头设置
  app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.header("Content-Type", "application/json; charset=utf-8")
    next()
  })

  /* 路由模块加载 */
  listRoutes(app)
  personRoutes(app)
  devRoutes(app)
  viewRoutes(app)
}

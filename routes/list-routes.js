var Person=require('../models/person'),
    List=require('../models/list')

var tools=require('../models/tools')

module.exports=function(app){
  /* 创建订单路由 */
  require('./list/createList')(app)

  /* 问卷星表单接口 */
  require('./list/forms')(app)

  /* 安卓端民警活动相关接口 */
  require('./list/police')(app)

  /* web端订单相关操作接口 */
  require('./list/list-control')(app)
}

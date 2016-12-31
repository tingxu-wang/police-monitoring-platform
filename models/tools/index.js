/*
 * 用于操作数据库以及向客户端返回结果的共用操作模块
*/

var tools={
  //在执行完update操作后返回操作是否成功的boolean
  //isUpdate (req,res,model,searchObj,updateObj,successMsg,errorMsg){
  isUpdate (model,searchObj,updateObj){
    var update=model.prototype.update,
        bool=null

    update(searchObj,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){//异步因此最后return的是null
        bool=true
        console.log(bool)
      }else{
        bool=false
        console.log(bool)
      }
    })

    return bool
  },
  resSuc (res,msg){
    res.json({
      success:1,
      msg
    })
  },
  resErr (res,msg){
    res.json({
      success:0,
      msg
    })
  }
}

module.exports=tools

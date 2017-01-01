/*
 * 用于操作数据库以及向客户端返回结果的共用操作模块
*/

var tools={
  resUpdate (req,res,model,searchObj,updateObj,successMsg,errorMsg){
  //在执行完update操作后返回操作是否成功的boolean
  //isUpdate (model,searchObj,updateObj){
    var update=model.prototype.update

    update(searchObj,updateObj,(err,result)=>{
      if(err){
        console.error(err)
      }

      if(result.nModified){//异步因此最后return的是null
        res.json({
          success:1,
          msg:successMsg
        })
      }else{
        res.json({
          success:0,
          msg:errorMsg
        })
      }
    })
  },
  policeChangeStatus (res,Person,List,searchObj,updateObj,successMsg,errorMsg){

  }
}

module.exports=tools

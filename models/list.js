var mongoose=require('mongoose')

//var db=mongoose.connect('mongodb://localhost/control')//使用control集合
/* 第一个链接的db用connect 第二个用createConnection */
var db=mongoose.createConnection('mongodb://127.0.0.1/control')

var Common=require('./common')

var schema={
  policeName:String,//民警姓名
  caseInfo:String,//案件描述
  userName:String,//市民姓名
  id:Number,//订单id

  /* 时间单位为毫秒 */
  sendTime:Number,//委派时间
  calloutTime:Number,//出警时间
  arriveTime:Number,//到达时间
  solveTime:Number,//解决时间

  test:String//问卷星整个存的test字段
}

var listSchema=new mongoose.Schema(schema,{
  collection:'list'
})

var ListModel=mongoose.model('list',listSchema)

var common=new Common(ListModel)

function List(list){
  this.policeName=list.policeName
  this.caseInfo=list.caseInfo
  this.userName=list.userName
  this.id=list.id
  this.sendTime=list.sendTime
  this.calloutTime=list.calloutTime
  this.arriveTime=list.arriveTime
  this.solveTime=list.solveTime

  this.test=list.test
}

module.exports=List

List.prototype={
  save (callback){
    var list={
      policeName:this.policeName,
      caseInfo:this.caseInfo,
      userName:this.userName,
      id:this.id,
      sendTime:this.sendTime,
      calloutTime:this.calloutTime,
      arriveTime:this.arriveTime,
      solveTime:this.solveTime

      ,test:this.test
    }
    var listModel=new ListModel(list)

    var promise=listModel.save()
    promise.then((err,list)=>{
      if(err){
        return callback(err)
      }
      callback(null,list)
    })
  },
  findOne:common.findOne.bind(common),
  find:common.find.bind(common),
  upsertUpdate:common.upsertUpdate.bind(common),
  update:common.update.bind(common)
}

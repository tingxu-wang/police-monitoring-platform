var mongoose=require('mongoose')

//var db=mongoose.connect('mongodb://localhost/control')//使用control集合
/* 第一个链接的db用connect 第二个用createConnection */
var db=mongoose.createConnection('mongodb://127.0.0.1/control')

var Common=require('./common')

var schema={
  policeName:String,//民警姓名
  listStatus:Number,//订单状态 0为未接单 1为已分派民警 2为已完成 3已评价 4为已忽略
  id:Number,//订单id（案件编号）

  /* 从问卷中抽出的转存信息 */
  caseInfo:String,//案件描述
  userName:String,//市民姓名
  openid:String,//市民微信openid
  phoneNum:String,//市民电话号码
  idCard:String,//市民身份证号
  area:String,//市民所在区域


  /* 时间单位为毫秒，记录操作的当前时间 */
  startTime:Number,//订单发起时间（用户提交paperOne的时间）
  sendTime:Number,//委派给民警的时间
  //calloutTime:Number,//民警接单的时间
  confirmTime:Number,//民警确认的时间
  arriveTime:Number,//民警到达案发地的时间
  solveTime:Number,//民警解决该案件的时间

  paperOne:Object,//问卷1
  paperTwo:Object//问卷2
}

var listSchema=new mongoose.Schema(schema,{
  collection:'list'
})

var ListModel=mongoose.model('list',listSchema)

var common=new Common(ListModel)

function List(list){
  this.policeName=list.policeName
  this.listStatus=list.listStatus
  this.id=list.id

  this.caseInfo=list.caseInfo
  this.userName=list.userName
  this.openid=list.openid
  this.phoneNum=list.phoneNum
  this.idCard=list.idCard
  this.area=list.area

  this.startTime=list.startTime
  this.sendTime=list.sendTime
  this.confirmTime=list.confirmTime
  this.arriveTime=list.arriveTime
  this.solveTime=list.solveTime

  this.paperOne=list.paperOne
  this.paperTwo=list.paperTwo
}

module.exports=List

List.prototype={
  save (callback){
    var list={
      policeName:this.policeName,
      listStatus:this.listStatus,
      id:this.id,

      caseInfo:this.caseInfo,
      userName:this.userName,
      openid:this.openid,
      phoneNum:this.phoneNum,
      idCard:this.idCard,
      area:this.area,

      startTime:this.startTime,
      sendTime:this.sendTime,
      confirmTime:this.confirmTime,
      arriveTime:this.arriveTime,
      solveTime:this.solveTime,

      paperOne:this.paperOne,
      paperTwo:this.paperTwo
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
  update:common.update.bind(common),
  findOneAndUpdate:common.findOneAndUpdate.bind(common)
}

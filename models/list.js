var mongoose=require('mongoose')

var autoIncrement=require('mongoose-auto-increment')//_id自增模块

//var db=mongoose.connect('mongodb://localhost/control')//使用control集合
/* 第一个链接的db用connect 第二个用createConnection */
var db=mongoose.createConnection('mongodb://127.0.0.1/control')

autoIncrement.initialize(db)

var Common=require('./common')

var schema={
  policeName:String,//民警姓名
  listStatus:Number,//订单状态 0为未接单 1为已分派民警 2为已完成 3已评价 4为已忽略
  //5为在路上（接单但未到达） 6为已到达（但未解决）
  listType:Number,//订单类型 0为紧急订单 1为普通订单

  /* 从问卷中抽出的转存信息 */
  caseInfo:String,//案件描述
  userName:String,//市民姓名
  openid:String,//市民微信openid
  phoneNum:String,//市民电话号码
  idCard:String,//市民身份证号
  caseType:Number,//报案类型
  wxName:String,//用户微信昵称

  /* 从反馈问卷(paperTwo)中转存的用户评价 */
  caseResult:Number,//处置结果
  policeAttitude:Number,//民警态度
  policeSpeed:Number,//民进出警速度
  userComment:String,//用户评价
  policeComment:String,//民警评价

  /* 时间单位为毫秒，记录操作的当前时间 */
  startTime:Number,//订单发起时间（用户提交paperOne的时间）
  sendTime:Number,//委派给民警的时间
  confirmTime:Number,//民警确认的时间
  arriveTime:Number,//民警到达案发地的时间
  solvedTime:Number,//民警解决该案件的时间
  endTime:Number,//订单结束时间（用户评价后或者指挥端忽略后更新此字段）

  paperOne:Object,//问卷1
  paperTwo:Object//问卷2
}

var listSchema=new mongoose.Schema(schema,{
  collection:'list'
})

var ListModel=mongoose.model('list',listSchema)

listSchema.plugin(autoIncrement.plugin,'list')

var common=new Common(ListModel)

function List(list){
  this.list={
    listStatus:list.listStatus || 0,
    listType:list.listType,

    wxName:list.wxName,
    openid:list.openid,

    startTime:list.startTime

/*    caseInfo:'尚未填写',
    userName:'尚未填写',
    phoneNum:'尚未填写',
    idCard:'尚未填写',
    //caseType:6,//尚未填写的案件类型值
    caseType:0,//开发版默认值，之后调回6*/

    //userComment:'尚未填写',//用户评价
    //policeComment:'尚未填写',//民警评价

//转存转移到之后的表单提交的update中
/*    caseInfo:list.paperOne.q5,
    userName:list.paperOne.q1,
    openid:list.paperOne.sojumpparm,
    phoneNum:list.paperOne.q3,
    idCard:list.paperOne.q2,
    caseType:list.paperOne.q4,

    startTime:list.startTime,

    paperOne:list.paperOne*/
  }
}

module.exports=List

List.prototype={
  save (callback){
    var list=this.list
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

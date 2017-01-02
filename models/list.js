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
  //id:Number,//订单id（案件编号）
  //id:{type:Number,index:{dafault:00001}},

  /* 从问卷中抽出的转存信息 */
  caseInfo:String,//案件描述
  userName:String,//市民姓名
  openid:String,//市民微信openid
  phoneNum:String,//市民电话号码
  idCard:String,//市民身份证号
  //area:String,//市民所在区域


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
    /*创建文档的时候并不是所有字段都给出，注释掉的是之后update的*/
    //policeName:list.policeName,

    //listStatus:list.listStatus,
    listStatus:0,

    caseInfo:list.paperOne.q5,
    userName:list.paperOne.q1,
    openid:list.paperOne.sojumpparm,
    phoneNum:list.paperOne.q3,
    idCard:list.paperOne.q2,

    startTime:list.startTime,
    // endTime:list.endTime,
    // sendTime:list.sendTime,
    // confirmTime:list.confirmTime,
    // arriveTime:list.arriveTime,
    // solvedTime:list.solvedTime,

    paperOne:list.paperOne
    //paperTwo:list.paperTwo
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

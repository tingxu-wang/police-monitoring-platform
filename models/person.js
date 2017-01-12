var mongoose=require('mongoose')

var db=mongoose.connect('mongodb://127.0.0.1/control')//使用control集合
//var db=mongoose.createConnection('mongodb://localhost/control')

var Common=require('./common')

var schema={
  name:String,//人名
  location:String,//经纬度字符串 格式为:"12,11" x和y值中间用英文逗号隔开
  type:Number,//人员类别 0为市民 1为民警
  status:Number,//民警的当前状态  0 未出警 1 已委派 2 已出警(确认) 3 已到达
  openid:String,//用户的微信openid，用于微信更新用户位置
  userStatus:Number//用户状态 0为未发起订单 1为已经发起订单
}

var personSchema=new mongoose.Schema(schema,{
  collection:'person'
})

var PersonModel=mongoose.model('person',personSchema)

var common=new Common(PersonModel)

function Person(person){
  this.location=person.location || '0,0'
  this.name=person.name || 'admin'
  this.type=person.type || 0
  this.status=person.status || 0
  this.openid=person.openid
  this.userStatus=person.userStatus || 0
}

module.exports=Person

Person.prototype={
  save (callback){
    var person={
      name:this.name,
      location:this.location,
      type:this.type,
      status:this.status,
      openid:this.openid
    }
    var personModel=new PersonModel(person)

    var promise=personModel.save()
    promise.then((err,person)=>{
      if(err){
        return callback(err)
      }
      callback(null,person)
      //db.disconnect()
    })
  },
  //...common
  findOne:common.findOne.bind(common),
  find:common.find.bind(common),
  upsertUpdate:common.upsertUpdate.bind(common),
  update:common.update.bind(common),
  findOneAndUpdate:common.findOneAndUpdate.bind(common)
}

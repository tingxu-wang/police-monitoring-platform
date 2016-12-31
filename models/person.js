var mongoose=require('mongoose')

var db=mongoose.connect('mongodb://localhost/control')//使用control集合

var Common=require('./common')

var personSchema=new mongoose.Schema({
  name:String,//人名
  location:String,//经纬度字符串 格式为:"12,11" x和y值中间用英文逗号隔开
  type:Number,//人员类别 0为市民 1为民警
  status:Number//民警的当前状态
},{
  collection:'person'
})

var PersonModel=mongoose.model('person',personSchema)

var common=new Common(PersonModel)

function Person(person){
  this.location=person.location
  this.name=person.name
  this.type=person.type
  this.status=person.status
  this.updateObj=person.updateObj//用于update文档对象
}

module.exports=Person

Person.prototype={
  save (callback){
    var person={
      name:this.name,
      location:this.location,
      type:this.type
    }
    var personModel=new PersonModel(person)

    var promise=personModel.save()
    promise.then((err,person)=>{
      if(err){
        return callback(err)
      }
      callback(null,person)
    })
  },
  //...common
  findOne:common.findOne.bind(common),
  find:common.find.bind(common),
  upsertUpdate:common.upsertUpdate.bind(common),
  update:common.update.bind(common)
}

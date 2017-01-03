var tools={
  renderInfo (infoObj){//将请求体中的数据字段装填到对象中再重新返回,放置数据库解析失败
    var keys=Object.getOwnPropertyNames(infoObj)
    var filter={}

    for(var i=0;i<keys.length;i++){
      var property=keys[i]

      filter[property]=infoObj[property]
    }

    return filter
  }
}

module.exports=tools

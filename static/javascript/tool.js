var local='http://localhost:3000/',
    online='http://115.28.243.24:3000/'

function toLocal(type,obj){//type为请求的api类型 obj为请求体对象
  $.post(local+type,obj,(data)=>{
    console.dir(data)
  },'json')
}

function toOnline(type,obj){
  $.post(online+type,obj,(data)=>{
    console.dir(data)
  },'json')
}

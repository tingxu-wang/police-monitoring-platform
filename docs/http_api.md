# ajax api
---

问卷数据示例：
```javascript

{
  activity: '11600216',
  name: '贵安新区公安局报警系统',
  sojumpparm: 'od04Tv3TIg8LcodYEuQHyzIkUHko',
  q1: '段晓晨',
  q2: '123456789',
  q3: '987654321',
  q4: '2',
  q5: '这里是描述',
  q6: '河南',
  index: '8',
  timetaken: '39',
  submittime: '2016-12-31 22:42:01'
}

```

person字段实例:
```javascript

var schema={
  name:String,//人名
  location:String,//经纬度字符串 格式为:"12,11" x和y值中间用英文逗号隔开
  type:Number,//人员类别 0为市民 1为民警
  status:Number//民警的当前状态  0 未出警 1 已委派 2 已出警(确认) 3 已到达
}

```

list字段示例：
```javascript

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

```

---
## 人物数据交互api说明

- 获取单个人物信息`/findOne`:

| url | 发送值 | 返回值 | 说明 |
| :------------- | :------------- | :------------- | :------------- |
| /findOne | 筛选条件对象 | {success,person,msg} | 用客户端发送的json对象遍历person集合返回匹配的第一个对象到 `person` 字段 |
| /find | 筛选条件对象 | {success,persons,msg} | 用客户端端发送的json对象遍历person集合返回匹配的所有符合条件的对象到 `persons` 字段 |
| /upsertUpdate | 由人员name字段以及想要覆盖的字段组成的对象 | {success,msg} | 利用客户端传来的json对象中的name字段遍历数据库，其余字段更新数据库信息，如果name未匹配任何集合，则利用客户端的json对象创建相应的person对象到数据库 |
| /update | 同上 | {success,msg} |效果同上，只是name不匹配任何对象时不创建对象 |
| /save(工具api) | 人员信息对象 | {success,msg} | 先用客户端传来的name字段遍历数据库，如果有匹配则返回失败信息，如果不匹配则向数据库创建该person对象信息并返回成功信息对象 |

## 订单交互逻辑梳理及api设计(括号中的操作为person集合的操作而非对list)

发起订单：
- 创建list对象(post)`/paperOne`：用户发出paperOne问卷对象，后台新创建一个list对象保存此表单信息到paperOne字段，并将`listStatus`字段值设置为0，设置`id`字段值自增1，并将当前时间保存到`startTime`字段内,**将问卷内的关键信息转存一份到该list相应字段内**

控制台展现订单以及民警信息：
- 抓取未处理的订单`/getWantedList`：web端设置心跳抓取`listStatus=0`的list对象数组
- 抓取未出警的民警`/getfreePolice`：web端设置心跳抓取`status=0`的person对象数组

分配订单：
- 忽略未处理的订单`/ignoreList`：web端将该list的`id`字段发送到后台，后台设置该`id`的list对象`listStatus`为4

- 委派未处理的订单`/delegate`：web端将该list的`id`以及`policeName`字段发送到后台，后台设置该`id`的list对象`listStatus`为1，`policeName`设置为获取的民警姓名，`sendTime`字段保存当前时间

  (设置`person`集合中该`policeName`的民警`status`为1)

更改民警状态：
- 获取分配给自己（该民警）的任务`/getMission`：安卓端将`policeName`以及`listStatus=1`发送到后台，后台检索req.query对象将匹配的list对象去除`paperOne`以及`paperTwo`两个字段后发送给请求方

- 民警确认出警`/confirmMission`：安卓端将`policeName`以及`listStatus=1`发送给后端，后端将匹配的list对象`confirmTime`设置为当前时间

  (设置`person`集合中该`policeName`的民警`status`为2)

- 民警到达市民地点`/policeArrive`：安卓端将`policeName`以及`listStatus=1`发送到后台，后台将`arriveTime`设置为当前时间

  (设置`person`集合中该`policeName`的民警`status`为3)

- 民警解决案件`/policeSolved`：安卓端将`policeName`以及`listStatus=1`发送到后台，后台将`solveTime`设置为当前时间，将`listStatus`设置为2

  (设置`person`集合中该`policeName`的民警`status`为0)

案件终止：
- 市民评价(post)`/rated`：微信端将反馈对象提供给后端，后端将`req.body`中的订单号`id`解析出来联合上`listStatus=2`取出来list对象，匹配的话就将`paperTwo`字段设置为`req.body`
，将`listStatus`设置为3

工具接口:
- 获得单个用户的订单列表`/getUserLists`：微信端向后台发送用户的`openid`，后台遍历list集合中的`openid`，将符合该id值的所有list对象返回请求方

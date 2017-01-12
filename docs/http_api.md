# ajax api
version 2

---

问卷推送数据说明文档：

https://tower.im/projects/4026d76c72fd465483e69b81f3747f9a/docs/c2ee768471994e948428716abd948dda/

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
  status:Number,//民警的当前状态  0 未出警 1 已委派 2 已出警(确认) 3 已到达
  openid:String,//用户的微信openid，用于微信更新用户位置
  userStatus:Number//用户状态 0为未发起订单 1为已经发起订单
}

```

list字段示例：
```javascript

var schema={
  policeName:String,//民警姓名
  listStatus:Number,//订单状态 0为未接单 1为已分派民警 2为已完成 3已评价 4为已忽略 5为在路上（接单但未到达） 6为已到达（但未解决）
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

```

---

## 人物数据交互api

| url | 发送值 | 返回值 | 说明 |
| :------------- | :------------- | :------------- | :------------- |
| /findOne | 筛选条件对象 | {success,person,msg} | 用客户端发送的json对象遍历person集合返回匹配的第一个对象到 `person` 字段 |
| /find | 筛选条件对象 | {success,persons,msg} | 用客户端端发送的json对象遍历person集合返回匹配的所有符合条件的对象到 `persons` 字段 |
| /upsertUpdate | 由人员name字段以及想要覆盖的字段组成的对象 | {success,msg} | 利用客户端传来的json对象中的name字段遍历数据库，其余字段更新数据库信息，如果name未匹配任何集合，则利用客户端的json对象创建相应的person对象到数据库 |
| /update | 同上 | {success,msg} |效果同上，只是name不匹配任何对象时不创建对象 |
| /updateUserLocation | 由人员openid字段以及想要覆盖的字段组成的对象 | {success,msg} | 用openid字段更新用户对象信息，用于微信端修改用户位置所用 |
| /save(工具接口) | 人员信息对象 | {success,msg} | 先用客户端传来的name字段遍历数据库，如果有匹配则返回失败信息，如果不匹配则向数据库创建该person对象信息并返回成功信息对象 |

## 订单数据交互api
| url | 发送值 | 返回值 | 说明 |
| :------------- | :------------- | :------------- | :------------- |
| /createNormalList | {wxName,openid} | {success,msg} | 根据用户微信昵称以及openid值创建普通订单 |
| /createEmergencyList | {wxName,openid} | {success,msg} | 根据用户微信昵称以及openid值创建紧急订单 |
| /paperOne | 问卷一数据对象 | {success,msg} | 检索请求体中的`id`字段对该`id`值的订单对象的paperOne字段进行保存并对问卷中的关键信息进行转存 |
| /getWantedList | 无 | `listStatus=0`的list对象数组 | 抓取未处理的订单 |
| /getfreePolice | 无 | `status=0`的person对象数组 | 抓取未出警的民警 |
| /ignoreList | {_id:订单编号} | {success,msg} | 忽略未处理的订单,提交成功后后台会自动更新`endTime`字段并将该`_id`的订单`listStatus`设置为4 |
| /delegate | {_id,policeName} | {success,msg} | web端委派未处理的订单，提交成功后后台会自动更新`sendTime`字段并将该`policeName`的民警`status`设置为1 |
| /getHistoryLists | 无 | {success,msg,lists} | 获取已完成的订单(liststatus为2,3,4的) |
| /getUnfinishLists | 无 | {success,msg,lists} | web端获取正在进行的案件（`listStatus`为5 6的订单） |
| /getMission | {policeName} | {success,msg,list} | 获取分配给自己（该民警）的任务 |
| /confirmMission | {policeName} | {success,msg} | 提交成功后后台会自动更新`confirmTime`字段并将该`policeName`的民警`status`设置为2 |
| /policeArrive | {policeName} | {success,msg} | 提交成功后后台会自动更新`arriveTime`字段并将该`policeName`的民警`status`设置为3 |
| /policeSolved | {policeName,policeComment} | {success,msg} | 提交成功后后台会自动更新`solveTime`字段并将该`policeName`的民警`status`设置为0,将传来的`policeComment`保存到该list对象,将该`openid`值的person对象`userStatus`设置为0 |
| /paperTwo | 问卷二数据对象 | {success,msg} | 提交表单json对象后后端自动检索json中的`id`字段的list对象，将问卷信息并入匹配文档中并更新该list对象的`listStatus`为3 |
| /getPoliceHistory | {policeName} | {success,lists} | 根据民警用户名返回所有的已完成订单(`listStatus`=2 或 3) |

---

## 订单交互逻辑梳理及api设计(括号中的操作为person集合的操作而非对list)

发起订单：
- 创建普通订单list对象`/createNormalList`：调用此接口直接创建订单对象用请求体中的`wxName`和`openid`保存到创建的表单对象中，将`listType`设置为1，设置`id`字段值自增1，并将当前时间保存到`startTime`字段内，并将`listStatus`字段值设置为0，转发list对象到晓晨服务器

  (将该订单中`openid`的person对象`userStatus`设置为1)

- 创建紧急订单list对象`/createEmergencyList`：调用此接口直接创建订单对象用请求体中的`wxName`和`openid`保存到创建的表单对象中，将`listType`设置为0，设置`id`字段值自增1，并将当前时间保存到`startTime`字段内，并将`listStatus`字段值设置为0，转发list对象到晓晨服务器

  (将该订单中`openid`的person对象`userStatus`设置为1)

- 更新list对象信息`/paperOne`：调用此接口发出paperOne问卷对象，后台根据请求体总的订单`id`更新(update)该`id`值的list对象的paperOne字段，**将问卷内的关键信息转存一份到该list相应字段内**

  (将该订单中`openid`的person对象`name`设置为表单中的name)

控制台展现订单以及民警信息：
- 抓取未处理的订单`/getWantedList`：web端设置心跳抓取`listStatus=0`的list对象数组
- 抓取未出警的民警`/getfreePolice`：web端设置心跳抓取`status=0`并且`type=1`的person对象数组

分配订单：
- 忽略未处理的订单`/ignoreList`：web端将该list的`id`字段发送到后台，后台设置该`id`的list对象`listStatus`为4，将当前时间保存到`endTime`字段内

- 委派未处理的订单`/delegate`：web端将该list的`id`以及`policeName`字段发送到后台，后台设置该`id`的list对象`listStatus`为1，`policeName`设置为获取的民警姓名，`sendTime`字段保存当前时间

  (设置`person`集合中该`policeName`的民警`status`为1)

更改民警状态：
- 获取分配给自己（该民警）的任务`/getMission`：安卓端将`policeName`发送到后台，后台联合`listStatus=1 || 5 || 6`以及`req.query.policeName`将匹配的list对象去除`paperOne`以及`paperTwo`两个字段后发送给请求方

- 民警确认出警`/confirmMission`：安卓端将`policeName`发送给后端，后端联合`listStatus=1`以及`policeName`将匹配的list对象`confirmTime`设置为当前时间，`listStatus`设置为5

  (设置`person`集合中该`policeName`的民警`status`为2)

- 民警到达市民地点`/policeArrive`：安卓端将`policeName`发送到后台，后台联合`listStatus=5`以及`policeName`将匹配的list对象`arriveTime`设置为当前时间，`listStatus`设置为6

  (设置`person`集合中该`policeName`的民警`status`为3)

- 民警解决案件`/policeSolved`：安卓端将`policeName`发送到后台，后台联合`listStatus=6`以及`policeName`将匹配的list对象`listStatus`设置为2，`solveTime`设置为当前时间，`listStatus`设置为2

  (将该订单中`openid`的person对象`userStatus`设置为0)

  **将该list对象中的  `openid` `id` `caseInfo` `listStatus`字段以json格式发送到晓晨服务器上，对象示例：**
  ```javascript
  {
    openid:String,//市民微信openid
    listStatus:Number,//订单状态 0为未接单 1为已分派民警 2为已完成 3已评价 4为已忽略 5为在路上（接单但未到达） 6为已到达（但未解决）
    id:Number,//订单id（案件编号）
    caseInfo:String//案件描述
  }
  ```

  (设置`person`集合中该`policeName`的民警`status`为0)

案件终止：
- 市民评价(post)`/paperTwo`：微信端将反馈对象提供给后端，后端将`req.body`中的订单号`id`解析出来联合上`listStatus=2`取出来list对象，匹配的话就将`paperTwo`字段设置为`req.body`，并将该list对象的`endTime`字段设置为当前时间
，将`listStatus`设置为3

工具接口:
- <s>获得单个用户的订单列表`/getUserLists`：微信端向后台发送用户的`openid`，后台遍历list集合中的`openid`，将符合该id值的所有list对象返回请求方</s>

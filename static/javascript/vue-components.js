Vue.component('case-type',{
  template:`
  <div>
    <template v-if="type===1">
      治安纠纷
    </template>
    <template v-if="type===2">
      交通事故
    </template>
    <template v-if="type===3">
      抢劫抢夺
    </template>
    <template v-if="type===4">
      走失人口
    </template>
    <template v-if="type===5">
      其他求助
    </template>
    <template v-if="type===6">
      尚未选择
    </template>
  </div>
  `,
  props:['type']
})

Vue.component('list-status',{
  template:`
  <div>
    <span v-if="status===0" class="js-list-status-text">
      未分派
    </span>
    <span v-if="status===1" class="js-list-status-text">
      已分派
    </span>
    <span v-if="status===2" class="list-status-finished">
      已完成
    </span>
    <span v-if="status===3" class="js-list-status-text">
      已评价
    </span>
    <span v-if="status===4" class="list-status-ignore js-list-status-text">
      已忽略
    </span>
    <span v-if="status===5" class="list-status-onway js-list-status-text">
      在路上
    </span>
    <span v-if="status===6" class="list-status-arrive js-list-status-text">
      已到达
    </span>
  </div>
  `,
  props:['status']
})


Vue.component('use-time',{//订单的总用时
  template:`
    <span>{{ time }}</span>
  `,
  computed:{
    time (){
      var useTime=this.solvedtime-this.sendtime,
          date=new Date(useTime),
          second=date.getSeconds(),
          minutes=date.getMinutes(),
          hours=date.getHours()

      return `${hours-8}:${minutes}:${second}`
    }
  },
  props:['solvedtime','sendtime']
})

Vue.component('chat-time',{
  template:`
    <div class="chat-message-time-container">
      {{ time }}
    </div>
  `,
  computed:{
    time (){
      var mill=Number(this.chattime)*1000
          date=new Date(mill),
          year=date.getFullYear(),
          month=date.getMonth(),
          day=date.getDate(),
          second=date.getSeconds(),
          minutes=date.getMinutes(),
          hours=date.getHours()
          console.log(Number(this.chattime))
      return `${year}年${month}月${day}日${hours}:${minutes}:${second}`
    }
  },
  props:['chattime']
})

Vue.component('police-use-time',{//民警到达现场的总用时
  template:`
    <span>{{ time }}</span>
  `,
  computed:{
    time (){
      var useTime=this.arrivetime-this.sendtime,
          date=new Date(useTime),
          second=date.getSeconds(),
          minutes=date.getMinutes(),
          hours=date.getHours()

      return `${hours-8}:${minutes}:${second}`
    }
  },
  props:['arrivetime','sendtime']
})

Vue.component('live-use-time',{//即时运算当前执法花费的时间
  template:`
    <span>{{ time }}</span>
  `,
  computed:{
    time (){
      var useTime=new Date()-this.sendtime,
          watch=this.increasenumber,//动态更新时间的钩子
          //watch,
          date=new Date(useTime),
          second=date.getSeconds(),
          minutes=date.getMinutes(),
          hours=date.getHours()

    /*  if(this.liststatus===5){//只有订单状态为在路上才更新时间
        watch=this.increasenumber
      }*/

      return `${hours-8}:${minutes}:${second}`
    }
  },
  props:['sendtime','increasenumber']
})

Vue.component('police-id',{
  template:`
    <span>{{ policeId }}</span>
  `,
  computed:{
    policeId (){
      return this.policename.replace('minjing','')
    }
  },
  props:['policename']
})

Vue.component('police-name',{
  template:`
    <span>{{ realName }}</span>
  `,
  computed:{
    realName (){
      return this.realnames[this.policename]
    }
  },
  props:['realnames','policename']//名字替换依据数组，list中的policeName
})

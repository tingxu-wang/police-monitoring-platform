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
  </div>
  `,
  props:['type']
})

Vue.component('list-status',{
  template:`
  <div>
    <span v-if="status===0">
      未分派
    </span>
    <span v-if="status===1">
      已分派
    </span>
    <span v-if="status===2" class="list-status-finished">
      已完成
    </span>
    <span v-if="status===3">
      已评价
    </span>
    <span v-if="status===4" class="list-status-ignore">
      已忽略
    </span>
    <span v-if="status===5" class="list-status-onway">
      在路上
    </span>
    <span v-if="status===6" class="list-status-arrive">
      已到达
    </span>
  </div>
  `,
  props:['status']
})


Vue.component('use-time',{
  template:`
    <span>{{ time }}</span>
  `,
  computed:{
    time (){
      var useTime=this.solvedtime-this.confirmtime,
          date=new Date(useTime),
          second=date.getSeconds(),
          minutes=date.getMinutes(),
          hours=date.getHours()

      return `${hours-8}:${minutes}:${second}`
    }
  },
  props:['solvedtime','confirmtime']
})

Vue.component('live-use-time',{//即时运算当前执法花费的时间
  template:`
    <span>{{ time }}</span>
  `,
  computed:{
    time (){
      var useTime=new Date()-this.confirmtime,
          watch=this.incrasenumber,//动态更新时间的钩子
          date=new Date(useTime),
          second=date.getSeconds(),
          minutes=date.getMinutes(),
          hours=date.getHours()

      return `${hours-8}:${minutes}:${second}`
    }
  },
  props:['confirmtime','incrasenumber']
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

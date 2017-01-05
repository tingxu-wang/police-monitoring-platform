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
    <span v-if="type===0">
      未分派
    </span>
    <span v-if="type===1">
      已分派
    </span>
    <span v-if="type===2" class="list-status-finished">
      已完成
    </span>
    <span v-if="type===3">
      已评价
    </span>
    <span v-if="type===4" class="list-status-ignore">
      已忽略
    </span>
    <span v-if="type===5" class="list-status-onway">
      在路上
    </span>
    <span v-if="type===6" class="list-status-arrive">
      已到达
    </span>
  `,
  props:['list-status']
})


Vue.component('use-time',{
  template:`
    <span>{{ time }}</span>
  `,
  computed:{
    time (confirmTime,solvedTime){
      var useTime=solvedTime-confirmTime,
          date=new Date(useTime),
          second=date.getSeconds(),
          minutes=date.getMinutes(),
          hours=date.getHours()

      return `${hours}:${minutes}:${second}`
    }
  },
  props:['solvedTime','confirmTime']
})

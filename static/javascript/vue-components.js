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

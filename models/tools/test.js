var tools=require('./index')

tools.sendPost({
  openid:'od04Tv0cqVPPLDnDYP6Wx3vhH0Mc',//市民微信openid
  listStatus:2,//订单状态 0为未接单 1为已分派民警 2为已完成 3已评价 4为已忽略
  id:1,//订单id（案件编号）
  caseInfo:'今天喝了三罐可乐0.0~'//案件描述
})
/*
tools.transmit({
  policeName:'minjing1',
  listStatus:1
})
*/

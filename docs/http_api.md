# ajax api

## get

- 获取出警列表

 - 返回值：
``` javascript
  [{"success":1,"info":"","name":"mingjing1","url":"rtmp://xxxx/:id","status":1,"location":"12,13"}]
```
---
``` javascript
  {name:"minjing1"}
```
- 民警出警
  `/callout`

- 委派
  `/send`  

- 民警到达
  `/arrive`

- 已解决
  `/solve`

  status: 0 未出警 1 已委派 2 已出警 3 已到达 4 已解决

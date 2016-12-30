var path=require('path')

function joinDir(src){
  return `${__dirname}/../${src}/`
}

module.exports={
  src:joinDir('src'),
  static:joinDir('static'),
  views:joinDir('views'),
  routes:joinDir('routes'),
  models:joinDir('models')
}

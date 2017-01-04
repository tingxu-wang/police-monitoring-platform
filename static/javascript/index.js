/* views中用的脚本文件 */
function BindingModal(schema,isInsertStar){
  this.listIndex=0
}

BindingModal.prototype={
  bindingInfo (schema){
    for(var i=0;i<schema.length;i++){
      var listValue=$('.js-'+schema[i]).eq(this.listIndex).html()
      $('.js-m-'+schema[i]).html(listValue)
    }
  },
  getPosition ($this){//得到当前的list位置信息并赋值给全局变量listIndex
    var $listContainer=$this.parents('.js-list-container')

    this.listIndex=$listContainer.index()
  }
}



function StarCompile(){//点击弹框渲染星星功能的类
  this.init()
}

StarCompile.prototype={
  init (){
    this.mapRow()
    this.removeStar()
  },
  mapRow (){
    var _this=this
    $('.js-case-star-row').each(function(index){//遍历一个评价单行
      var markNumber=$(this).find('.js-hidden-info-container').html(),//隐藏域中的评价数字
          $starMainContainer=$(this).find('.js-star-main-container')//添加star的dom节点

      _this.insertStar($starMainContainer,markNumber)
    })
  },
  insertStar ($container,markNumber){//添加star的容器，星级数字
    var solidStar=`<span class="star-container">
      <img src="/static/images/star-solid.jpg" alt="">
    </span>`,
        emptyStar=`<span class="star-container">
          <img src="/static/images/star-empty.jpg" alt="">
        </span>`

    switch(Number(markNumber)){
      case 1:
      $container.append(emptyStar)
        .append(emptyStar).append(emptyStar).append(emptyStar)
      break;
      case 2:
      $container.append(solidStar)
        .append(emptyStar).append(emptyStar).append(emptyStar)
      break;
      case 3:
      $container.append(solidStar)
        .append(solidStar).append(emptyStar).append(emptyStar)
      break;
      case 4:
      $container.append(solidStar)
        .append(solidStar).append(solidStar).append(emptyStar)
      break;
      case 5:
      $container.append(solidStar)
        .append(solidStar).append(solidStar).append(solidStar)
      break;
    }
  },
  removeStar (){//弹窗关闭之后清除star文本节点
    var solidStar=`<span class="star-container">
      <img src="/static/images/star-solid.jpg" alt="">
    </span>`

    $('#js-listModal').on('hidden.bs.modal',function(){
      $('.js-star-main-container').html('').append(solidStar)
    })
  }
}

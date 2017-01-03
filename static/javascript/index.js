/* views中用的脚本文件 */

function bindingModal(schema){
  var listIndex//用于定位点击的list在列表的位置

  $('.modal').on('show.bs.modal',function(e){
    for(var i=0;i<schema.length;i++){
      var listValue=$('.js-'+schema[i]).eq(listIndex).html()
      $('.js-m-'+schema[i]).html(listValue)
    }
  })

  $('.js-show-modal').on('click',function(){
    var $listContainer=$(this).parents('.js-list-container')

    listIndex=$listContainer.index()

    $('#js-listModal').modal('show')
  })
}

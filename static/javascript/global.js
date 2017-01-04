/* 站点全局初始化代码 */
$(function(){
  $('.js-href').on('click',function(){
    window.location.href=$(this).data('link')
  })  
})

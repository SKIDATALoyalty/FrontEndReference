$('.navbar-nav>li>a').on('click', function(){
    console.log('called');
    $('.navbar-collapse').collapse('hide');
});